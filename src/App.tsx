import { useEffect, useState } from 'react'
import { useProcurementStore } from './store'
import { SuppliersData } from './types'
import SuppliersList from './components/SuppliersList'
import CurrentOrder from './components/CurrentOrder'
import OrderHistory from './components/OrderHistory'
import AdminLogin from './components/AdminLogin'
import AdminPanel from './components/AdminPanel'
import SMSGenerator from './components/SMSGenerator'
import './styles.css'

function App() {
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'order' | 'history' | 'admin'>('order')
  const { loadSuppliers, isAdminLoggedIn, logoutAdmin, currentOrder } = useProcurementStore(s => ({
    loadSuppliers: s.loadSuppliers,
    isAdminLoggedIn: s.isAdminLoggedIn,
    logoutAdmin: s.logoutAdmin,
    currentOrder: s.currentOrder
  }))

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

  if (!isAdminLoggedIn && tab === 'admin') {
    return (
      <div className="app">
        <header className="header">
          <h1>Матрица закупок "Шанхай"</h1>
        </header>
        <AdminLogin />
      </div>
    )
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
          onClick={() => {
            setTab('order')
            if (isAdminLoggedIn) logoutAdmin()
          }}
        >
          📝 Оформить заказ
        </button>
        <button
          className={`tab ${tab === 'history' ? 'active' : ''}`}
          onClick={() => {
            setTab('history')
            if (isAdminLoggedIn) logoutAdmin()
          }}
        >
          📋 История заказов
        </button>
        <button
          className={`tab ${tab === 'admin' ? 'active' : ''}`}
          onClick={() => setTab('admin')}
        >
          ⚙️ Админ
        </button>
      </div>

      <div className="container">
        {tab === 'order' && (
          <div className="order-view">
            <SuppliersList />
            <div className="order-panel">
              <CurrentOrder />
              {currentOrder.length > 0 && <SMSGenerator orderItems={currentOrder} />}
            </div>
          </div>
        )}
        {tab === 'history' && <OrderHistory />}
        {tab === 'admin' && isAdminLoggedIn && <AdminPanel />}
      </div>
    </div>
  )
}

export default App
