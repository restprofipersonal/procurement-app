import { useState } from 'react'
import { useProcurementStore } from '../store'
import type { Supplier } from '../types'
import styles from './SuppliersManager.module.css'

function SuppliersManager() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useProcurementStore(s => ({
    suppliers: s.suppliers,
    addSupplier: s.addSupplier,
    updateSupplier: s.updateSupplier,
    deleteSupplier: s.deleteSupplier
  }))

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingName, setEditingName] = useState<string | null>(null)
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
    name: '',
    contact: '',
    repName: '',
    repPhone: '',
    orderDeadline: '',
    items: []
  })
  const [editValues, setEditValues] = useState<Partial<Supplier>>({})

  const handleAddSupplier = () => {
    if (newSupplier.name && !suppliers.find(s => s.name === newSupplier.name)) {
      addSupplier({
        name: newSupplier.name || '',
        contact: newSupplier.contact || '',
        repName: newSupplier.repName || '',
        repPhone: newSupplier.repPhone || '',
        orderDeadline: newSupplier.orderDeadline || '',
        items: []
      })
      setNewSupplier({
        name: '',
        contact: '',
        repName: '',
        repPhone: '',
        orderDeadline: '',
        items: []
      })
      setShowAddForm(false)
    }
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingName(supplier.name)
    setEditValues(supplier)
  }

  const handleSaveEdit = () => {
    if (editingName) {
      updateSupplier(editingName, editValues)
      setEditingName(null)
      setEditValues({})
    }
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
            <input
              type="text"
              placeholder="Название поставщика *"
              value={newSupplier.name || ''}
              onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Контактная информация"
              value={newSupplier.contact || ''}
              onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Имя торгового представителя"
              value={newSupplier.repName || ''}
              onChange={(e) => setNewSupplier({ ...newSupplier, repName: e.target.value })}
              className={styles.input}
            />
            <input
              type="tel"
              placeholder="Номер телефона (+7...)"
              value={newSupplier.repPhone || ''}
              onChange={(e) => setNewSupplier({ ...newSupplier, repPhone: e.target.value })}
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Когда делаем заявку (например: понедельник до 10:00)"
              value={newSupplier.orderDeadline || ''}
              onChange={(e) => setNewSupplier({ ...newSupplier, orderDeadline: e.target.value })}
              className={styles.input}
            />
          </div>
          <button onClick={handleAddSupplier} className={styles.saveBtn}>
            Сохранить поставщика
          </button>
        </div>
      )}

      <div className={styles.suppliersList}>
        <h3>Все поставщики ({suppliers.length})</h3>
        {suppliers.map(supplier => (
          <div key={supplier.name} className={styles.supplierCard}>
            {editingName === supplier.name ? (
              <>
                <div className={styles.formGrid}>
                  <input
                    type="text"
                    value={editValues.name || ''}
                    onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                    className={styles.input}
                  />
                  <input
                    type="text"
                    value={editValues.contact || ''}
                    onChange={(e) => setEditValues({ ...editValues, contact: e.target.value })}
                    className={styles.input}
                  />
                  <input
                    type="text"
                    value={editValues.repName || ''}
                    onChange={(e) => setEditValues({ ...editValues, repName: e.target.value })}
                    className={styles.input}
                  />
                  <input
                    type="tel"
                    value={editValues.repPhone || ''}
                    onChange={(e) => setEditValues({ ...editValues, repPhone: e.target.value })}
                    className={styles.input}
                  />
                  <input
                    type="text"
                    value={editValues.orderDeadline || ''}
                    onChange={(e) => setEditValues({ ...editValues, orderDeadline: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div className={styles.editButtons}>
                  <button onClick={handleSaveEdit} className={styles.saveBtn}>✓ Сохранить</button>
                  <button onClick={() => setEditingName(null)} className={styles.cancelBtn}>✕ Отмена</button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.supplierInfo}>
                  <div className={styles.supplierName}>{supplier.name}</div>
                  <div className={styles.details}>
                    {supplier.repName && (
                      <div className={styles.detail}>
                        <span className={styles.label}>Торговый представитель:</span>
                        <span className={styles.value}>{supplier.repName}</span>
                      </div>
                    )}
                    {supplier.repPhone && (
                      <div className={styles.detail}>
                        <span className={styles.label}>Телефон:</span>
                        <span className={styles.value}>{supplier.repPhone}</span>
                      </div>
                    )}
                    {supplier.orderDeadline && (
                      <div className={styles.detail}>
                        <span className={styles.label}>Заявка:</span>
                        <span className={styles.value}>{supplier.orderDeadline}</span>
                      </div>
                    )}
                    {supplier.contact && (
                      <div className={styles.detail}>
                        <span className={styles.label}>Контакты:</span>
                        <span className={styles.value}>{supplier.contact}</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.itemCount}>{supplier.items.length} товаров</div>
                </div>
                <div className={styles.actions}>
                  <button
                    onClick={() => handleEdit(supplier)}
                    className={styles.editBtn}
                  >
                    ✎ Редактировать
                  </button>
                  <button
                    onClick={() => deleteSupplier(supplier.name)}
                    className={styles.deleteBtn}
                  >
                    🗑 Удалить
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SuppliersManager
