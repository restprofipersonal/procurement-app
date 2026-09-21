import { useEffect, useState } from 'react'
import { useProcurementStore } from './store'
import { SuppliersData } from './types'
import SuppliersList from './components/SuppliersList'
import CurrentOrder from './components/CurrentOrder'
import OrderHistory from './components/OrderHistory'
import './styles.css'

function App() {
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'order' | 'history'>('order')
  const loadSuppliers = useProcurementStore(s => s.loadSuppliers)

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/suppliers-data.json')
        const data: SuppliersData = await response.json()
        loadSuppliers(data.suppliers)
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [loadSuppliers])

  if (loading) {
    return <div className="app loading">Загрузка данных...</div>
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Матрица закупок "Шанхай"</h1>
        <p className="subtitle">Система управления закупками для заведения</p>
      </header>

      <div className="tabs">
        <button
          className={`tab ${tab === 'order' ? 'active' : ''}`}
          onClick={() => setTab('order')}
        >
          📝 Оформить заказ
        </button>
        <button
          className={`tab ${tab === 'history' ? 'active' : ''}`}
          onClick={() => setTab('history')}
        >
          📋 История заказов
        </button>
      </div>

      <div className="container">
        {tab === 'order' && (
          <div className="order-view">
            <SuppliersList />
            <CurrentOrder />
          </div>
        )}
        {tab === 'history' && <OrderHistory />}
      </div>
    </div>
  )
}

export default App
