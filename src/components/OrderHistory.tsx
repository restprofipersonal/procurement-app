import { useMemo } from 'react'
import { useProcurementStore } from '../store'
import '../styles.css'

function OrderHistory() {
  const orders = useProcurementStore(s => s.orders)

  const orderStats = useMemo(() => {
    return orders.map(order => {
      const total = order.items.reduce(
        (sum, item) => sum + item.orderedQuantity * (item.item.price || 0),
        0
      )
      return { ...order, total }
    })
  }, [orders])

  if (orderStats.length === 0) {
    return (
      <div className="order-history">
        <h2>История заказов</h2>
        <div className="empty-order">
          <p>Нет сохранённых заказов</p>
        </div>
      </div>
    )
  }

  return (
    <div className="order-history">
      <h2>История заказов</h2>

      <div className="history-list">
        {orderStats.map(order => (
          <details key={order.id} className="history-item">
            <summary>
              <div className="history-summary">
                <span className="history-date">{order.date}</span>
                <span className="history-total">
                  {order.items.length} позиций • {order.total.toFixed(2)} ₽
                </span>
              </div>
            </summary>

            <div className="history-details">
              {order.items.map((item, idx) => {
                const cost = item.orderedQuantity * (item.item.price || 0)
                return (
                  <div key={idx} className="history-order-item">
                    <div className="history-item-info">
                      <div>
                        <div className="history-item-name">{item.item.name}</div>
                        <div className="history-item-supplier">{item.supplier.name}</div>
                      </div>
                    </div>
                    <div className="history-item-qty">
                      {item.orderedQuantity} {item.item.portion}
                    </div>
                    <div className="history-item-cost">{cost.toFixed(2)} ₽</div>
                  </div>
                )
              })}
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}

export default OrderHistory
