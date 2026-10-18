// ───────────────────────────────────────────────
//  所有可以自己改的內容都集中在這個檔案
// ───────────────────────────────────────────────

export const HOLDER = '張雯婷' // 持卡人
export const ISSUER = '林子渝' // 發卡人
export const ANNIVERSARY = '2022-11-15' // 在一起紀念日（YYYY-MM-DD）
export const BIRTHDAY = '2003-12-19' // 持卡人生日
export const CVV = '223' // 卡背 CVV

export const INITIAL_CREDIT = 14520 // 開卡時的初始額度
export const ANNIV_TOPUP = 1115 // 每年紀念日自動加值金額
export const TOPUP_MAX = 50000 // 後台單筆儲值上限（防止多打一個 0）
export const TITLE_MAX = 20 // 消費項目名稱長度上限
export const AMOUNT_MAX = 9_999_999

export const TZ = 'Asia/Taipei' // 所有日期判斷一律用台北時間
export const POLL_MS = 15_000 // 畫面自動更新間隔

export type QuestionKey = 'name' | 'anniv' | 'birthday' | 'firstMeet' | 'favGift' | 'dessert'

export interface Question {
  key: QuestionKey
  type: 'text' | 'date'
  label: string
  en: string
  placeholder?: string
  maxLength?: number
  note?: string
  /** 日期題的正確答案（YYYY-MM-DD） */
  answer?: string
  wrong?: string
  hint?: string
}

// 開卡問答：由上往下依序解鎖，答錯時下面的欄位全部鎖住
export const QUESTIONS: Question[] = [
  {
    key: 'name',
    type: 'text',
    label: '卡面暱稱',
    en: 'NAME ON CARD',
    placeholder: '例如：NING',
    maxLength: 14,
    note: '會印在妳的專屬卡面上',
  },
  {
    key: 'anniv',
    type: 'date',
    label: '我們在一起的紀念日',
    en: 'OUR DAY',
    answer: ANNIVERSARY,
    wrong: '不對喔……這天可不能忘記 🥺',
    hint: '提示：那是一個秋天，十一月的某一天',
  },
  {
    key: 'birthday',
    type: 'date',
    label: '妳的生日',
    en: 'YOUR BIRTHDAY',
    answer: BIRTHDAY,
    wrong: '這是妳自己的生日耶 😳',
    hint: '提示：耶誕節前一個禮拜左右',
  },
  { key: 'firstMeet', type: 'text', label: '我們第一次見面在哪裡', en: 'WHERE WE MET', placeholder: '寫下那個地方', maxLength: 30 },
  { key: 'favGift', type: 'text', label: '最喜歡我送妳的什麼東西', en: 'FAVORITE GIFT', placeholder: '老實說沒關係', maxLength: 30 },
  { key: 'dessert', type: 'text', label: '最喜歡的甜點', en: 'FAVORITE DESSERT', placeholder: '例如：提拉米蘇', maxLength: 20 },
]

/** 開卡後會存進資料庫、之後可以修改的欄位 */
export type ProfileKey = 'name' | 'firstMeet' | 'favGift' | 'dessert'
export const PROFILE_FIELDS = QUESTIONS.filter((q): q is Question & { key: ProfileKey } => q.type === 'text')

// 卡片背面的話
export const BACK_MESSAGE = {
  title: 'Happy 4th Anniversary',
  zh: ['謝謝妳，陪我走過 1,461 個日子。', '往後的每一天，也想一直牽著妳的手 ♡'],
  en: 'Four years of loving you, and a lifetime still to go.',
}

// 四週年禮物：不扣額度、每項限兌換一次（兌換後會在明細留下一筆金額 0 的紀錄，後台看得到）
export interface Gift {
  key: string
  icon: 'gift' | 'pen'
  title: string
  desc: string
}

export const GIFTS: Gift[] = [
  { key: 'anniv4-gift', icon: 'gift', title: '四週年禮物', desc: '四週年專屬驚喜禮物，拆開那天揭曉' },
  { key: 'anniv4-letter', icon: 'pen', title: '四週年手寫卡片', desc: '親手寫下四年來最想對妳說的話' },
]

// 兌換券：扣點。once = true 表示限兌換一次（key、title、cost、once 要和資料庫 app.vouchers 一致）
export interface Voucher {
  key: string
  title: string
  desc: string
  cost: number
  once: boolean
}

export const VOUCHERS: Voucher[] = [
  { key: 'dessert', title: '手工甜點券', desc: '親手做一份妳想吃的甜點', cost: 200, once: false },
  { key: 'massage', title: '15分鐘按摩券', desc: '肩頸放鬆 15 分鐘', cost: 200, once: false },
  { key: 'blowdry', title: '吹頭髮服務券', desc: '洗完澡由我來吹頭髮', cost: 200, once: false },
  { key: 'shampoo', title: '洗頭服務券', desc: '幫妳洗頭，順便按摩頭皮', cost: 200, once: false },
  { key: 'date', title: '一日約會驚喜券', desc: '全程由我安排一日約會行程', cost: 1200, once: true },
  { key: 'wish', title: '願望兌換券', desc: '許一個願望，我來幫妳實現', cost: 2000, once: true },
  { key: 'outfit', title: '治裝券', desc: '1000塊以內，要買要快', cost: 1200, once: true },
  { key: 'poya', title: '寶雅採購券', desc: '限時兩分鐘在寶雅盡情採購', cost: 1800, once: true },
  { key: 'blindbox', title: '盲盒命運券', desc: '抽一個命運盲盒，開了才知道', cost: 800, once: true },
  { key: 'restaurant', title: '指定餐廳享用券', desc: '指定一間餐廳，我請你吃', cost: 3000, once: true },
]
