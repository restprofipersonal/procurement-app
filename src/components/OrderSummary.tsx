import type { OrderItem } from '../types'
import '../styles.css'

interface OrderSummaryProps {
  orders: OrderItem[]
}

function OrderSummary({ orders }: OrderSummaryProps) {
  const supplierTotals = orders.reduce((acc, item) => {
    const key = item.supplier.name
    if (!acc[key]) {
      acc[key] = { count: 0, total: 0 }
    }
    const cost = item.orderedQuantity * (item.item.price || 0)
    acc[key].count += item.orderedQuantity
    acc[key].total += cost
    return acc
  }, {} as Record<string, { count: number; total: number }>)

  const totalCost = Object.values(supplierTotals).reduce((sum, s) => sum + s.total, 0)

  return (
    <div className="order-summary">
      <h3>Итого по поставщикам</h3>
      <div className="summary-items">
        {Object.entries(supplierTotals).map(([supplier, data]) => (
          <div key={supplier} className="summary-item">
            <span className="summary-label">{supplier}</span>
            <span className="summary-value">
              {data.count.toFixed(1)} ед. — {data.total.toFixed(2)} ₽
            </span>
          </div>
        ))}
      </div>
      <div className="summary-total">
        <strong>Всего: {totalCost.toFixed(2)} ₽</strong>
      </div>
    </div>
  )
}

export default OrderSummary
