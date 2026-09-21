import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { OrderItem, Order, Item, Supplier } from './types'

interface ProcurementStore {
  currentOrder: OrderItem[]
  orders: Order[]
  suppliers: Supplier[]
  isAdminLoggedIn: boolean
  allItems: Item[]

  addItemToOrder: (item: Item, supplier: Supplier, quantity: number) => void
  updateItemQuantity: (itemId: string, supplierId: string, quantity: number) => void
  removeItemFromOrder: (itemId: string, supplierId: string) => void
  clearOrder: () => void
  saveOrder: () => void
  loadSuppliers: (suppliers: Supplier[]) => void
  updateItemPrice: (itemId: string, supplierId: string, price: number) => void
  loginAdmin: (password: string) => boolean
  logoutAdmin: () => void
  addItem: (item: Item) => void
  deleteItem: (itemId: string) => void
  updateItem: (itemId: string, updates: Partial<Item>) => void
  loadItemsFromJSON: (items: Item[]) => void
  addSupplier: (supplier: Supplier) => void
  updateSupplier: (supplierName: string, updates: Partial<Supplier>) => void
  deleteSupplier: (supplierName: string) => void
}

export const useProcurementStore = create<ProcurementStore>()(
  persist(
    (set, get) => ({
      currentOrder: [],
      orders: [],
      suppliers: [],
      isAdminLoggedIn: false,
      allItems: [],

      addItemToOrder: (item, supplier, quantity) => {
        set(state => {
          const existing = state.currentOrder.find(
            o => o.item.id === item.id && o.supplier.name === supplier.name
          )

          if (existing) {
            return {
              currentOrder: state.currentOrder.map(o =>
                o.item.id === item.id && o.supplier.name === supplier.name
                  ? { ...o, orderedQuantity: o.orderedQuantity + quantity }
                  : o
              )
            }
          }

          return {
            currentOrder: [...state.currentOrder, { item, supplier, orderedQuantity: quantity }]
          }
        })
      },

      updateItemQuantity: (itemId, supplierId, quantity) => {
        if (quantity <= 0) {
          get().removeItemFromOrder(itemId, supplierId)
          return
        }

        set(state => ({
          currentOrder: state.currentOrder.map(o =>
            o.item.id === itemId && o.supplier.name === supplierId
              ? { ...o, orderedQuantity: quantity }
              : o
          )
        }))
      },

      removeItemFromOrder: (itemId, supplierId) => {
        set(state => ({
          currentOrder: state.currentOrder.filter(
            o => !(o.item.id === itemId && o.supplier.name === supplierId)
          )
        }))
      },

      clearOrder: () => {
        set({ currentOrder: [] })
      },

      saveOrder: () => {
        set(state => {
          if (state.currentOrder.length === 0) return state

          const newOrder: Order = {
            id: Date.now().toString(),
            date: new Date().toLocaleString('ru-RU'),
            items: JSON.parse(JSON.stringify(state.currentOrder))
          }

          return {
            orders: [newOrder, ...state.orders],
            currentOrder: []
          }
        })
      },

      loadSuppliers: (suppliers) => {
        const allItems = suppliers.flatMap(s => s.items)
        set({ suppliers, allItems })
      },

      updateItemPrice: (itemId, supplierId, price) => {
        set(state => {
          const updatedSuppliers = state.suppliers.map(supplier =>
            supplier.name === supplierId
              ? {
                  ...supplier,
                  items: supplier.items.map(item =>
                    item.id === itemId ? { ...item, price } : item
                  )
                }
              : supplier
          )

          return { suppliers: updatedSuppliers }
        })
      },

      loginAdmin: (password: string) => {
        if (password === 'zakupka_oleg') {
          set({ isAdminLoggedIn: true })
          return true
        }
        return false
      },

      logoutAdmin: () => {
        set({ isAdminLoggedIn: false })
      },

      addItem: (item: Item) => {
        set(state => {
          const updatedSuppliers = state.suppliers.map(supplier =>
            supplier.name === item.supplier
              ? { ...supplier, items: [...supplier.items, item] }
              : supplier
          )
          return {
            suppliers: updatedSuppliers,
            allItems: [...state.allItems, item]
          }
        })
      },

      deleteItem: (itemId: string) => {
        set(state => {
          const updatedSuppliers = state.suppliers.map(supplier => ({
            ...supplier,
            items: supplier.items.filter(item => item.id !== itemId)
          }))
          return {
            suppliers: updatedSuppliers,
            allItems: state.allItems.filter(item => item.id !== itemId)
          }
        })
      },

      updateItem: (itemId: string, updates: Partial<Item>) => {
        set(state => {
          const updatedSuppliers = state.suppliers.map(supplier => ({
            ...supplier,
            items: supplier.items.map(item =>
              item.id === itemId ? { ...item, ...updates } : item
            )
          }))
          const updatedAllItems = state.allItems.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
          )
          return {
            suppliers: updatedSuppliers,
            allItems: updatedAllItems
          }
        })
      },

      loadItemsFromJSON: (items: Item[]) => {
        const suppliersMap = new Map<string, Item[]>()
        items.forEach(item => {
          if (!suppliersMap.has(item.supplier)) {
            suppliersMap.set(item.supplier, [])
          }
          suppliersMap.get(item.supplier)!.push(item)
        })

        const suppliers: Supplier[] = Array.from(suppliersMap).map(([name, itemsList]) => ({
          name,
          contact: '',
          items: itemsList
        }))

        set({ suppliers, allItems: items })
      },

      addSupplier: (supplier: Supplier) => {
        set(state => ({
          suppliers: [...state.suppliers, supplier]
        }))
      },

      updateSupplier: (supplierName: string, updates: Partial<Supplier>) => {
        set(state => ({
          suppliers: state.suppliers.map(s =>
            s.name === supplierName ? { ...s, ...updates } : s
          )
        }))
      },

      deleteSupplier: (supplierName: string) => {
        set(state => ({
          suppliers: state.suppliers.filter(s => s.name !== supplierName),
          allItems: state.allItems.filter(item => item.supplier !== supplierName)
        }))
      }
    }),
    {
      name: 'procurement-store'
    }
  )
)
