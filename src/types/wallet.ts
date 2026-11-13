/** 单个钱包。三个金额都是十进制字符串，单位是分。 */
export interface WalletAccount {
  balanceFen: string
  frozenFen: string
  availableFen: string
}

export interface WalletBalances {
  points: WalletAccount
  withdrawable: WalletAccount
  consumption: WalletAccount
}
