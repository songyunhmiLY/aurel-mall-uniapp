export interface CatalogProduct {
  id: string
  name: string
  price: number
  pv?: number
  tone: string
  desc: string
  cat?: string
  unit?: string
}

export const startupUnitPrice = 1000

export const startupProducts: CatalogProduct[] = [
  {
    id: 's1',
    name: '重组蛋白冻干制剂 A-101',
    price: 1000,
    unit: '盒',
    tone: 'olive',
    desc: '研发演示用重组蛋白冻干样品。区内产品单价均为 1,000.00 元。本页仅为商品演示，不涉及适应症或疗效说明。',
  },
  {
    id: 's2',
    name: '脂质纳米粒递送制剂 N-07',
    price: 1000,
    unit: '瓶',
    tone: 'slate',
    desc: '用于演示的脂质纳米粒递送制剂样品，包装规格为单瓶。',
  },
  {
    id: 's3',
    name: '单克隆抗体样品装 M-23',
    price: 1000,
    unit: '盒',
    tone: 'navy',
    desc: '研发阶段单克隆抗体样品装，仅作下单演示。',
  },
  {
    id: 's4',
    name: '核酸载体制剂 G-09',
    price: 1000,
    unit: '瓶',
    tone: 'forest',
    desc: '核酸载体制剂演示样品，文案不构成使用或医疗建议。',
  },
  {
    id: 's5',
    name: '靶向偶联制剂 C-15',
    price: 1000,
    unit: '盒',
    tone: 'sand',
    desc: '靶向偶联方向的研发演示制剂，固定单价，仅供演示。',
  },
]

export const mallCategories = ['全部', '营养补充', '健康监测', '日常养护', '睡眠恢复']

export const mallProducts: CatalogProduct[] = [
  {
    id: 'm1',
    cat: '日常养护',
    name: '氨基酸温和洁面凝胶',
    price: 198,
    pv: 80,
    tone: 'slate',
    desc: '氨基酸表活配方，日常清洁用。下单时仅调整数量，无规格可选。',
  },
  {
    id: 'm2',
    cat: '睡眠恢复',
    name: '智能温控助眠毯',
    price: 368,
    pv: 150,
    tone: 'linen',
    desc: '可调节温区的助眠盖毯，适合日常休息。PV 与售价分别配置，并非同一数值。',
  },
  {
    id: 'm3',
    cat: '营养补充',
    name: '高纯度鱼油软胶囊',
    price: 259,
    pv: 120,
    tone: 'olive',
    desc: '精炼鱼油软胶囊，按推荐用量作为日常营养补充。本描述不作医疗承诺。',
  },
  {
    id: 'm4',
    cat: '健康监测',
    name: '便携心率监测腕带',
    price: 588,
    pv: 200,
    tone: 'sand',
    desc: '日常心率记录腕带，数据仅供参考，不能替代医疗监测设备。',
  },
  {
    id: 'm5',
    cat: '营养补充',
    name: '植物多酚精华胶囊',
    price: 328,
    pv: 180,
    tone: 'terracotta',
    desc: '植物多酚提取物胶囊，作为日常营养补充。PV 为分红基数，不等于价格。',
  },
  {
    id: 'm6',
    cat: '健康监测',
    name: '指夹式血氧监测仪',
    price: 169,
    pv: 60,
    tone: 'navy',
    desc: '便携指夹式血氧与脉率读取，结果仅供日常参考。',
  },
  {
    id: 'm7',
    cat: '睡眠恢复',
    name: '低频雾化助眠仪',
    price: 89,
    pv: 40,
    tone: 'forest',
    desc: '小型雾化助眠设备，用于营造安静的休息环境。',
  },
  {
    id: 'm8',
    cat: '营养补充',
    name: '活性益生菌冻干粉',
    price: 129,
    pv: 55,
    tone: 'stone',
    desc: '活性益生菌冻干粉，日常膳食补充用途。包装可反复密封。',
  },
]

export interface DemoOrder {
  id: string
  typeName: string
  status: string
  statusName: string
  createdAt: string
  payable: number
  items: { name: string; qty: number; price: number }[]
}

export const demoOrders: DemoOrder[] = [
  {
    id: 'S20261111-04',
    typeName: '创业专区',
    status: 'shipped',
    statusName: '待收货',
    createdAt: '2026-11-11 16:02',
    payable: 2000,
    items: [{ name: '重组蛋白冻干制剂 A-101', qty: 2, price: 1000 }],
  },
  {
    id: 'M20261109-12',
    typeName: '会员商城',
    status: 'pendingShip',
    statusName: '待发货',
    createdAt: '2026-11-09 09:18',
    payable: 561,
    items: [
      { name: '智能温控助眠毯', qty: 1, price: 368 },
      { name: '低频雾化助眠仪', qty: 2, price: 89 },
    ],
  },
  {
    id: 'M20261112-01',
    typeName: '会员商城',
    status: 'pendingPay',
    statusName: '待付款',
    createdAt: '2026-11-12 08:16',
    payable: 588,
    items: [{ name: '便携心率监测腕带', qty: 1, price: 588 }],
  },
  {
    id: 'M20261028-1102',
    typeName: '会员商城',
    status: 'refunding',
    statusName: '退款中',
    createdAt: '2026-10-28 11:02',
    payable: 141,
    items: [{ name: '活性益生菌冻干粉', qty: 1, price: 129 }],
  },
  {
    id: 'M20261015-07',
    typeName: '会员商城',
    status: 'refunded',
    statusName: '已退款',
    createdAt: '2026-10-15 16:44',
    payable: 181,
    items: [{ name: '指夹式血氧监测仪', qty: 1, price: 169 }],
  },
]

export function orderCount(kind: string): number {
  return demoOrders.filter((order) => {
    if (kind === 'refund') return order.status === 'refunding' || order.status === 'refunded'
    return order.status === kind
  }).length
}

export const demoNotices = [
  {
    id: 'n1',
    title: '系统维护通知',
    time: '2026-11-11 22:00',
    body: '系统将于今晚进行例行维护，期间部分服务可能短暂不可用。',
  },
  {
    id: 'n2',
    title: '订单发货提醒',
    time: '2026-11-11 16:10',
    body: '你的订单 S20261111-04 已发出，请留意收货。',
  },
  {
    id: 'n3',
    title: '提现已打款',
    time: '2026-11-03 16:40',
    body: '你的提现申请已完成打款，请留意收款账户到账情况。',
  },
]

export const demoAddresses = [
  {
    id: 'a1',
    name: 'Martin Keller',
    phone: '+49 151 1234 5678',
    region: '德国 巴伐利亚州 慕尼黑',
    detail: 'Maximilianstraße 18, 80539',
    def: true,
  },
  {
    id: 'a2',
    name: 'Claire Dubois',
    phone: '+33 6 12 34 56 78',
    region: '法国 法兰西岛 巴黎',
    detail: '18 Rue des Archives, 75004',
    def: false,
  },
]

export const demoBank = {
  holder: 'Martin Keller',
  bank: 'Deutsche Bank',
  branch: 'München Filiale',
  number: 'DE89 3704 0044 0532 0130 00',
}

export function findStartup(id: string): CatalogProduct | undefined {
  return startupProducts.find((item) => item.id === id)
}

export function findMall(id: string): CatalogProduct | undefined {
  return mallProducts.find((item) => item.id === id)
}
