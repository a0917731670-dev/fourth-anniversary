import { GIFTS, VOUCHERS } from '../../shared/domain/config'
import { fullDateTime } from '../../shared/domain/format'
import { activeRedeems, balanceOf, giftClaimTimes } from '../../shared/domain/rules'
import Icon from '../../shared/ui/Icon'
import Page from '../../shared/ui/Page'
import { useUI } from '../../shared/ui/UIProvider'
import { useCardData } from '../data'
import GiftSheet from '../sheets/GiftSheet'
import VoucherSheet from '../sheets/VoucherSheet'

export default function Gifts() {
  const { state } = useCardData()
  const { openSheet } = useUI()
  const claimedAt = giftClaimTimes(state.transactions)
  const left = GIFTS.length - claimedAt.size
  const redeemed = activeRedeems(state.transactions)
  const balance = balanceOf(state.transactions)

  return (
    <Page>
      <div className="page-head">
        <span className="eyebrow">FOR OUR 4TH</span>
        <h2>四週年禮物</h2>
        <p>
          專屬於妳的禮物，不扣除額度，每項限兌換一次 ♡
          <br />
          {left > 0 ? `還有 ${left} 份等妳兌換` : '兩份禮物都兌換囉，等我準備驚喜'}
        </p>
      </div>

      <div className="gifts stagger">
        {GIFTS.map((g) => {
          const at = claimedAt.get(g.key)
          const done = at !== undefined
          return (
            <div className={`gift glass ${done ? 'is-claimed' : ''}`} key={g.key}>
              <div className="ribbon" />
              <span className="gift-big-ic">
                <Icon name={done ? 'check' : g.icon} />
              </span>
              <div className="gift-body">
                <span className="tag-line">🎁 四週年限定</span>
                <b>{g.title}</b>
                <small>{done && at ? `兌換於 ${fullDateTime(at)}` : g.desc}</small>
              </div>
              {done ? (
                <span className="pill">已兌換</span>
              ) : (
                <button className="btn btn-primary sm" onClick={() => openSheet(<GiftSheet gift={g} />)}>
                  兌換
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className="page-head">
        <span className="eyebrow">COUPONS</span>
        <h2>兌換券</h2>
        <p>
          用額度兌換專屬服務與驚喜 ♡
          <br />
          目前額度 NT$ {balance.toLocaleString()}
        </p>
      </div>

      <div className="gifts stagger">
        {VOUCHERS.map((v) => {
          const r = redeemed.get(v.key)
          const done = v.once && r !== undefined
          const short = !done && balance < v.cost
          return (
            <div className={`gift glass ${done ? 'is-claimed' : ''}`} key={v.key}>
              <div className="ribbon" />
              <span className="gift-big-ic">
                <Icon name={done ? 'check' : 'gift'} />
              </span>
              <div className="gift-body">
                <span className="tag-line">
                  NT$ {v.cost.toLocaleString()}・{v.once ? '限兌換一次' : r ? `已兌換 ${r.count} 次` : '可重複兌換'}
                </span>
                <b>{v.title}</b>
                <small>{done && r ? `兌換於 ${fullDateTime(r.lastAt)}` : v.desc}</small>
              </div>
              {done ? (
                <span className="pill">已兌換</span>
              ) : (
                <button
                  className="btn btn-primary sm"
                  disabled={short}
                  onClick={() => openSheet(<VoucherSheet voucher={v} />)}
                >
                  {short ? '額度不足' : '兌換'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </Page>
  )
}
