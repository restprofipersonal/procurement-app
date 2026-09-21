import { useMemo } from 'react'
import { useProcurementStore } from '../store'
import OrderSummary from './OrderSummary'
import '../styles.css'

function CurrentOrder() {
  const currentOrder = useProcurementStore(s => s.currentOrder)
  const removeItem = useProcurementStore(s => s.removeItemFromOrder)
  const updateQuantity = useProcurementStore(s => s.updateItemQuantity)
  const clearOrder = useProcurementStore(s => s.clearOrder)
  const saveOrder = useProcurementStore(s => s.saveOrder)

  const groupedBySupplier = useMemo(() => {
    const groups: Record<string, typeof currentOrder> = {}
    currentOrder.forEach(item => {
      const key = item.supplier.name
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(item)
    })
    return groups
  }, [currentOrder])

  return (
    <div className="current-order">
      <h2>Текущий заказ</h2>

      {currentOrder.length === 0 ? (
        <div className="empty-order">
          <p>Заказ пуст</p>
          <p className="hint">Выберите товары из списка поставщиков</p>
        </div>
      ) : (
        <>
          <div className="order-items">
            {Object.entries(groupedBySupplier).map(([supplierName, items]) => (
              <div key={supplierName} className="supplier-order-group">
                <h4 className="supplier-name-order">{supplierName}</h4>
                <div className="order-items-list">
                  {items.map((orderItem, idx) => (
                    <div key={idx} className="order-item">
                      <div className="order-item-info">
                        <div className="order-item-name">{orderItem.item.name}</div>
                        {orderItem.item.portion && (
                          <div className="order-item-detail">{orderItem.item.portion}</div>
                        )}
                      </div>
                      <div className="order-item-controls">
                        <input
                          type="number"
                          value={orderItem.orderedQuantity}
                          onChange={e => updateQuantity(
                            orderItem.item.id,
                            supplierName,
                            parseFloat(e.target.value) || 0
                          )}
                          className="qty-input-small"
                          step="0.1"
                          min="0"
                        />
                        <button
                          onClick={() => removeItem(orderItem.item.id, supplierName)}
                          className="btn btn-remove"
                          title="Удалить"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <OrderSummary orders={currentOrder} />

          <div className="order-actions">
            <button onClick={clearOrder} className="btn btn-secondary">
              Очистить заказ
            </button>
            <button onClick={saveOrder} className="btn btn-primary">
              Сохранить заказ
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default CurrentOrder
