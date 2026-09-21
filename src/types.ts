export interface Item {
  id: string
  name: string
  article: string
  portion: string
  quantity: string
  comment: string
  price: number
  pricePerKg?: number
  pricePerUnit?: number
  supplier?: string
  category: string
}

export interface Supplier {
  name: string
  contact: string
  items: Item[]
  repName?: string
  repPhone?: string
  email?: string
  note?: string
  orderDeadline?: string
}

export interface OrderItem {
  item: Item
  supplier: Supplier
  orderedQuantity: number
}

export interface Order {
  id: string
  date: string
  items: OrderItem[]
}

export interface SuppliersData {
  suppliers: Supplier[]
  lastUpdated: string
}

export interface CategoryData {
  name: string
  items: Item[]
}
