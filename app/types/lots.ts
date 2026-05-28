export interface ILotItem {
  id: string
  name: string
  description: string
  category: string
  startingPrice: number
  currentPrice: number
  bidCount: number
  endTime: string
  status: 'active' | 'closed' | 'cancelled'
  seller: string
}

export interface ICatalogResponce {
  items: ILotItem[]
  total: number
  hasMore: boolean
}
