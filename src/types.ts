export interface Item {
  id: string
  name: string
  article: string
  portion: string
  quantity: string
  comment: string
  price: number
  category: string
}

export interface Supplier {
  name: string
  contact: string
  items: Item[]
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
