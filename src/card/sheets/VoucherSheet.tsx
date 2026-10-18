import { useRef, useState } from 'react'
import { isApiError } from '../../shared/api'
import type { Voucher } from '../../shared/domain/config'
import { fmt } from '../../shared/domain/format'
import { uid } from '../../shared/domain/id'
import { activeRedeems, checkRedeem, type RedeemError } from '../../shared/domain/rules'
import { useSheetAction } from '../../shared/hooks/useSheetAction'
import FormError from '../../shared/ui/FormError'
import Icon from '../../shared/ui/Icon'
import Success from '../../shared/ui/Success'
import { useUI } from '../../shared/ui/UIProvider'
import { useCardData } from '../data'
import LockedNotice from './LockedNotice'

const RULE_MESSAGES: Record<RedeemError, string> = {
  INSUFFICIENT: '額度不足',
  LOCKED: '卡片已鎖定，請先解鎖',
  ALREADY_CLAIMED: '這張券已經兌換過了',
  INVALID_INPUT: '這張券目前無法兌換',
}

/** 兌換券：確認內容與扣點 → 顯示兌換後餘額 → 確認兌換 */
export default function VoucherSheet({ voucher }: { voucher: Voucher }) {
  const { state, derived, actions, offline, refresh } = useCardData()
  const { closeSheet } = useUI()
  const submit = useSheetAction()
  const requestId = useRef(uid()) // 這張面板代表「一次兌換」；網路重送時帶同一個 id，後端不會扣兩次
  const [paid, setPaid] = useState(0)

  const balance = derived.stats.balance
  const after = balance - voucher.cost
  const rule = checkRedeem(voucher.key, balance, activeRedeems(state.transactions), state.locked)
  const ready = !rule && !offline

  const confirm = async () => {
    if (!ready) return
    const ok = await submit.run(() => actions.redeem({ voucherKey: voucher.key, requestId: requestId.current }), {
      messages: {
        INSUFFICIENT: '餘額已經變動，額度不足了',
        ALREADY_CLAIMED: '這張券已經兌換過了',
        NETWORK: '網路不穩，請稍後再按一次（不會重複扣款）',
      },
      fallback: '兌換失敗，請稍後再試',
      onError: (e) =>
        isApiError(e) && (e.code === 'INSUFFICIENT' || e.code === 'LOCKED' || e.code === 'ALREADY_CLAIMED') && void refresh(),
    })
    if (ok) setPaid(after)
  }

  if (submit.done)
    return (
      <Success
        title="兌換成功"
        actions={
          <button className="btn btn-primary btn-block" onClick={closeSheet}>
            完成
          </button>
        }
      >
        已兌換「{voucher.title}」NT$ {fmt(voucher.cost)}
        <br />
        目前餘額 NT$ {fmt(paid)}
      </Success>
    )

  if (state.locked) return <LockedNotice action="兌換" />

  const hint = submit.error || (offline ? '目前離線，暫時無法兌換' : rule ? RULE_MESSAGES[rule] : '')

  return (
    <>
      <span className="sheet-icon">
        <Icon name="gift" />
      </span>
      <h3>{voucher.title}</h3>
      <p>{voucher.desc}</p>

      <div className="sheet-summary">
        <div>
          <span>兌換點數</span>
          <b>NT$ {fmt(voucher.cost)}</b>
        </div>
        <div>
          <span>兌換後餘額</span>
          <b className={after < 0 ? 'neg' : ''}>NT$ {fmt(after)}</b>
        </div>
      </div>

      <p>{voucher.once ? '這張券限兌換一次。' : '這張券可以重複兌換。'}</p>

      <FormError text={hint} />

      <div className="sheet-actions">
        <button className="btn btn-ghost" onClick={closeSheet}>
          取消
        </button>
        <button className="btn btn-primary" disabled={!ready || submit.busy} onClick={() => void confirm()}>
          {submit.busy ? '處理中…' : '確認兌換'}
        </button>
      </div>
    </>
  )
}
