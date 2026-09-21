import { useState } from 'react'
import { useProcurementStore } from '../store'
import type { Item } from '../types'
import styles from './AdminPanel.module.css'

function AdminPanel() {
  const { suppliers, logoutAdmin, deleteItem, updateItem, addItem } = useProcurementStore(s => ({
    suppliers: s.suppliers,
    logoutAdmin: s.logoutAdmin,
    deleteItem: s.deleteItem,
    updateItem: s.updateItem,
    addItem: s.addItem
  }))

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Partial<Item>>({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState<Partial<Item>>({
    name: '',
    article: '',
    portion: '',
    price: 0,
    supplier: suppliers[0]?.name || '',
    category: ''
  })

  const allItems = suppliers.flatMap(s => s.items)

  const handleEdit = (item: Item) => {
    setEditingId(item.id)
    setEditValues(item)
  }

  const handleSaveEdit = () => {
    if (editingId && editValues.name) {
      updateItem(editingId, editValues)
      setEditingId(null)
      setEditValues({})
    }
  }

  const handleAddItem = () => {
    if (newItem.name && newItem.supplier) {
      const item: Item = {
        id: Date.now().toString(),
        name: newItem.name || '',
        article: newItem.article || '',
        portion: newItem.portion || '',
        quantity: newItem.quantity || '',
        comment: newItem.comment || '',
        price: newItem.price || 0,
        category: newItem.category || '',
        supplier: newItem.supplier
      }
      addItem(item)
      setNewItem({
        name: '',
        article: '',
        portion: '',
        price: 0,
        supplier: suppliers[0]?.name || '',
        category: ''
      })
      setShowAddForm(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Админ-панель: управление товарами</h2>
        <button onClick={logoutAdmin} className={styles.logoutBtn}>
          Выход
        </button>
      </div>

      <div className={styles.controls}>
        <button onClick={() => setShowAddForm(!showAddForm)} className={styles.addBtn}>
          {showAddForm ? '✕ Отмена' : '➕ Добавить товар'}
        </button>
      </div>

      {showAddForm && (
        <div className={styles.formSection}>
          <h3>Новый товар</h3>
          <div className={styles.formGrid}>
            <input
              type="text"
              placeholder="Название товара"
              value={newItem.name || ''}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Артикул"
              value={newItem.article || ''}
              onChange={(e) => setNewItem({ ...newItem, article: e.target.value })}
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Фасовка"
              value={newItem.portion || ''}
              onChange={(e) => setNewItem({ ...newItem, portion: e.target.value })}
              className={styles.input}
            />
            <select
              value={newItem.supplier || ''}
              onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
              className={styles.input}
            >
              <option value="">Выберите поставщика</option>
              {suppliers.map(s => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Категория"
              value={newItem.category || ''}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className={styles.input}
            />
            <input
              type="number"
              placeholder="Цена"
              value={newItem.price || ''}
              onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
              className={styles.input}
            />
          </div>
          <button onClick={handleAddItem} className={styles.saveBtn}>
            Сохранить товар
          </button>
        </div>
      )}

      <div className={styles.itemsContainer}>
        <h3>Все товары ({allItems.length})</h3>
        {allItems.map(item => (
          <div key={item.id} className={styles.itemRow}>
            {editingId === item.id ? (
              <>
                <input
                  type="text"
                  value={editValues.name || ''}
                  onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                  className={styles.input}
                />
                <input
                  type="text"
                  value={editValues.article || ''}
                  onChange={(e) => setEditValues({ ...editValues, article: e.target.value })}
                  className={styles.input}
                />
                <input
                  type="text"
                  value={editValues.portion || ''}
                  onChange={(e) => setEditValues({ ...editValues, portion: e.target.value })}
                  className={styles.input}
                />
                <input
                  type="number"
                  value={editValues.price || ''}
                  onChange={(e) => setEditValues({ ...editValues, price: Number(e.target.value) })}
                  className={styles.input}
                />
                <input
                  type="text"
                  value={editValues.category || ''}
                  onChange={(e) => setEditValues({ ...editValues, category: e.target.value })}
                  className={styles.input}
                />
                <button onClick={handleSaveEdit} className={styles.saveBtn}>✓ Сохр</button>
                <button onClick={() => setEditingId(null)} className={styles.cancelBtn}>✕ Отм</button>
              </>
            ) : (
              <>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemMeta}>
                    {item.article && <span>Арт: {item.article}</span>}
                    {item.portion && <span>Фас: {item.portion}</span>}
                    {item.category && <span>Кат: {item.category}</span>}
                  </div>
                </div>
                <div className={styles.prices}>
                  {item.price > 0 && <span>{item.price} ₽</span>}
                </div>
                <div className={styles.supplier}>{item.supplier || 'N/A'}</div>
                <button onClick={() => handleEdit(item)} className={styles.editBtn}>✎</button>
                <button onClick={() => deleteItem(item.id)} className={styles.deleteBtn}>🗑</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminPanel
