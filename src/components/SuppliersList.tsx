import { useState } from 'react'
import { useProcurementStore } from '../store'
import SupplierCard from './SupplierCard'
import '../styles.css'

function SuppliersList() {
  const suppliers = useProcurementStore(s => s.suppliers)
  const [search, setSearch] = useState('')

  const filtered = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="suppliers-list">
      <div className="suppliers-header">
        <h2>Поставщики</h2>
        <input
          type="text"
          placeholder="Поиск поставщика..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="suppliers-grid">
        {filtered.map(supplier => (
          <SupplierCard key={supplier.name} supplier={supplier} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <p>Поставщики не найдены</p>
        </div>
      )}
    </div>
  )
}

export default SuppliersList
