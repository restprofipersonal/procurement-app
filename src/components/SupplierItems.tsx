import { useState } from 'react'
import { useProcurementStore } from '../store'
import type { Supplier } from '../types'
import styles from './SupplierItems.module.css'

interface SupplierItemsProps {
  supplier: Supplier | null
}

function SupplierItems({ supplier }: SupplierItemsProps) {
  const [search, setSearch] = useState('')
  const addItemToOrder = useProcurementStore(s => s.addItemToOrder)

  if (!supplier) {
    return (
      <div className={styles.empty}>
        <p>Выберите поставщика слева</p>
      </div>
    )
  }

  const filtered = supplier.items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.article.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>{supplier.name}</h3>
        {supplier.repName && (
          <div className={styles.repInfo}>
            {supplier.repName}
            {supplier.repPhone && ` • ${supplier.repPhone}`}
          </div>
        )}
      </div>

      <input
        type="text"
        placeholder="Поиск по названию или артикулу..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />

      <div className={styles.itemsList}>
        {filtered.length === 0 ? (
          <div className={styles.noItems}>Товары не найдены</div>
        ) : (
          filtered.map(item => (
            <div key={item.id} className={styles.itemCard}>
              <div className={styles.itemContent}>
                <div className={styles.itemName}>{item.name}</div>
                <div className={styles.itemDetails}>
                  {item.article && <span>Арт: {item.article}</span>}
                  {item.portion && <span>Фас: {item.portion}</span>}
                  {item.category && <span>Кат: {item.category}</span>}
                </div>
                {item.price > 0 && (
                  <div className={styles.price}>{item.price} ₽</div>
                )}
              </div>
              <button
                onClick={() => addItemToOrder(item, supplier, 1)}
                className={styles.addBtn}
                title="Добавить в заказ"
              >
                ➕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SupplierItems
