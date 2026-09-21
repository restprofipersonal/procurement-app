import { useState } from 'react'
import { useProcurementStore } from '../store'
import styles from './SupplierList.module.css'

interface SupplierListProps {
  selectedSupplier: string | null
  onSelectSupplier: (name: string) => void
}

function SupplierList({ selectedSupplier, onSelectSupplier }: SupplierListProps) {
  const suppliers = useProcurementStore(s => s.suppliers)
  const [search, setSearch] = useState('')

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <h3>Поставщики</h3>
      <input
        type="text"
        placeholder="Поиск поставщика..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />
      <div className={styles.list}>
        {filtered.map(supplier => (
          <div
            key={supplier.name}
            className={`${styles.supplierItem} ${selectedSupplier === supplier.name ? styles.active : ''}`}
            onClick={() => onSelectSupplier(supplier.name)}
          >
            <div className={styles.name}>{supplier.name}</div>
            <div className={styles.itemCount}>{supplier.items.length} товаров</div>
            {supplier.repName && (
              <div className={styles.repInfo}>
                {supplier.repName}
                {supplier.repPhone && ` • ${supplier.repPhone}`}
              </div>
            )}
            {supplier.orderDeadline && (
              <div className={styles.deadline}>{supplier.orderDeadline}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SupplierList
