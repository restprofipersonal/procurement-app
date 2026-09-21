import { useState } from 'react'
import { useProcurementStore } from '../store'
import type { Supplier } from '../types'
import ItemRow from './ItemRow'
import '../styles.css'

interface SupplierCardProps {
  supplier: Supplier
}

function SupplierCard({ supplier }: SupplierCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = supplier.items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="supplier-card">
      <div
        className="supplier-header"
        onClick={() => setExpanded(!expanded)}
      >
        <h3>{supplier.name}</h3>
        <span className="expand-icon">{expanded ? '▼' : '▶'}</span>
      </div>

      {supplier.contact && (
        <p className="supplier-contact">{supplier.contact}</p>
      )}

      <p className="item-count">Товаров: {supplier.items.length}</p>

      {expanded && (
        <div className="supplier-items">
          <input
            type="text"
            placeholder="Поиск товара..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input-small"
            onClick={e => e.stopPropagation()}
          />

          <div className="items-list">
            {filtered.map(item => (
              <ItemRow key={item.id} item={item} supplier={supplier} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="no-items">Товары не найдены</p>
          )}
        </div>
      )}
    </div>
  )
}

export default SupplierCard
