import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { OrderItem, Order, Item, Supplier } from './types'

interface ProcurementStore {
  currentOrder: OrderItem[]
  orders: Order[]
  suppliers: Supplier[]

  addItemToOrder: (item: Item, supplier: Supplier, quantity: number) => void
  updateItemQuantity: (itemId: string, supplierId: string, quantity: number) => void
  removeItemFromOrder: (itemId: string, supplierId: string) => void
  clearOrder: () => void
  saveOrder: () => void
  loadSuppliers: (suppliers: Supplier[]) => void
  updateItemPrice: (itemId: string, supplierId: string, price: number) => void
}

export const useProcurementStore = create<ProcurementStore>(
  persist(
    (set, get) => ({
      currentOrder: [],
      orders: [],
      suppliers: [],

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
        set({ suppliers })
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
      }
    }),
    {
      name: 'procurement-store'
    }
  )
)
