import { useState } from 'react'
import { useProcurementStore } from '../store'
import type { Supplier } from '../types'
import SupplierDetail from './SupplierDetail'
import styles from './SuppliersManager.module.css'

function SuppliersManager() {
  const { suppliers, addSupplier, deleteSupplier } = useProcurementStore(s => ({
    suppliers: s.suppliers,
    addSupplier: s.addSupplier,
    deleteSupplier: s.deleteSupplier
  }))

  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
    name: '',
    repName: '',
    repPhone: '',
    email: '',
    contact: '',
    note: '',
    orderDeadline: '',
    items: []
  })

  const handleAddSupplier = () => {
    if (newSupplier.name && !suppliers.find(s => s.name === newSupplier.name)) {
      addSupplier({
        name: newSupplier.name || '',
        contact: newSupplier.contact || '',
        repName: newSupplier.repName || '',
        repPhone: newSupplier.repPhone || '',
        email: newSupplier.email || '',
        note: newSupplier.note || '',
        orderDeadline: newSupplier.orderDeadline || '',
        items: []
      })
      setNewSupplier({
        name: '',
        repName: '',
        repPhone: '',
        email: '',
        contact: '',
        note: '',
        orderDeadline: '',
        items: []
      })
      setShowAddForm(false)
    }
  }

  const selectedSupplierData = suppliers.find(s => s.name === selectedSupplier)

  if (selectedSupplierData) {
    return (
      <SupplierDetail
        supplier={selectedSupplierData}
        onBack={() => setSelectedSupplier(null)}
      />
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Управление поставщиками</h2>
      </div>

      <div className={styles.controls}>
        <button onClick={() => setShowAddForm(!showAddForm)} className={styles.addBtn}>
          {showAddForm ? '✕ Отмена' : '➕ Добавить поставщика'}
        </button>
      </div>

      {showAddForm && (
        <div className={styles.formSection}>
          <h3>Новый поставщик</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Наименование поставщика *</label>
              <input
                type="text"
                placeholder="Название"
                value={newSupplier.name || ''}
                onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Торговый представитель</label>
              <input
                type="text"
                placeholder="Имя и фамилия"
                value={newSupplier.repName || ''}
                onChange={(e) => setNewSupplier({ ...newSupplier, repName: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Номер телефона</label>
              <input
                type="tel"
                placeholder="+7..."
                value={newSupplier.repPhone || ''}
                onChange={(e) => setNewSupplier({ ...newSupplier, repPhone: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Электронная почта</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={newSupplier.email || ''}
                onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Когда делаем заявку</label>
              <input
                type="text"
                placeholder="Понедельник до 10:00"
                value={newSupplier.orderDeadline || ''}
                onChange={(e) => setNewSupplier({ ...newSupplier, orderDeadline: e.target.value })}
                className={styles.input}
              />
            </div>
          </div>
          <div className={styles.textareaGroup}>
            <div className={styles.formGroup}>
              <label>Контактная информация</label>
              <textarea
                placeholder="Адрес, способ связи и т.д."
                value={newSupplier.contact || ''}
                onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                className={styles.textarea}
                rows={3}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Примечание</label>
              <textarea
                placeholder="Любые дополнительные заметки..."
                value={newSupplier.note || ''}
                onChange={(e) => setNewSupplier({ ...newSupplier, note: e.target.value })}
                className={styles.textarea}
                rows={3}
              />
            </div>
          </div>
          <button onClick={handleAddSupplier} className={styles.saveBtn}>
            ✓ Создать поставщика
          </button>
        </div>
      )}

      <div className={styles.suppliersList}>
        <h3>Все поставщики ({suppliers.length})</h3>
        {suppliers.length === 0 ? (
          <p className={styles.noSuppliers}>Поставщики не добавлены</p>
        ) : (
          <div className={styles.grid}>
            {suppliers.map(supplier => (
              <div key={supplier.name} className={styles.supplierCard}>
                <div className={styles.cardHeader}>
                  <h4>{supplier.name}</h4>
                  <span className={styles.itemCount}>{supplier.items.length} товаров</span>
                </div>

                <div className={styles.cardContent}>
                  {supplier.repName && (
                    <div className={styles.detail}>
                      <span className={styles.label}>Представитель:</span>
                      <span className={styles.text}>{supplier.repName}</span>
                    </div>
                  )}
                  {supplier.repPhone && (
                    <div className={styles.detail}>
                      <span className={styles.label}>Телефон:</span>
                      <span className={styles.text}>{supplier.repPhone}</span>
                    </div>
                  )}
                  {supplier.email && (
                    <div className={styles.detail}>
                      <span className={styles.label}>Email:</span>
                      <span className={styles.text}>{supplier.email}</span>
                    </div>
                  )}
                  {supplier.orderDeadline && (
                    <div className={styles.detail}>
                      <span className={styles.label}>Заявка:</span>
                      <span className={styles.text}>{supplier.orderDeadline}</span>
                    </div>
                  )}
                </div>

                <div className={styles.cardActions}>
                  <button
                    onClick={() => setSelectedSupplier(supplier.name)}
                    className={styles.detailsBtn}
                  >
                    📋 Редактировать & Товары
                  </button>
                  <button
                    onClick={() => deleteSupplier(supplier.name)}
                    className={styles.deleteBtn}
                  >
                    🗑 Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SuppliersManager
