import { useState } from 'react'
import { useProcurementStore } from '../store'
import type { Supplier, Item } from '../types'
import styles from './SupplierDetail.module.css'

interface SupplierDetailProps {
  supplier: Supplier
  onBack: () => void
}

function SupplierDetail({ supplier, onBack }: SupplierDetailProps) {
  const { updateSupplier, deleteItem, updateItem, addItem } = useProcurementStore(s => ({
    updateSupplier: s.updateSupplier,
    deleteItem: s.deleteItem,
    updateItem: s.updateItem,
    addItem: s.addItem
  }))

  const [isEditingSupplier, setIsEditingSupplier] = useState(false)
  const [supplierData, setSupplierData] = useState<Partial<Supplier>>(supplier)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<Partial<Item>>({})
  const [showAddItem, setShowAddItem] = useState(false)
  const [newItem, setNewItem] = useState<Partial<Item>>({
    name: '',
    article: '',
    portion: '',
    price: 0,
    pricePerKg: 0,
    pricePerUnit: 0,
    category: '',
    supplier: supplier.name
  })

  const handleSaveSupplier = () => {
    updateSupplier(supplier.name, supplierData)
    setIsEditingSupplier(false)
  }

  const handleEditItem = (item: Item) => {
    setEditingItemId(item.id)
    setEditingItem(item)
  }

  const handleSaveItem = () => {
    if (editingItemId) {
      updateItem(editingItemId, editingItem)
      setEditingItemId(null)
      setEditingItem({})
    }
  }

  const handleAddItem = () => {
    if (newItem.name) {
      const item: Item = {
        id: Date.now().toString(),
        name: newItem.name || '',
        article: newItem.article || '',
        portion: newItem.portion || '',
        quantity: '',
        comment: '',
        price: newItem.price || 0,
        pricePerKg: newItem.pricePerKg || 0,
        pricePerUnit: newItem.pricePerUnit || 0,
        category: newItem.category || '',
        supplier: supplier.name
      }
      addItem(item)
      setNewItem({
        name: '',
        article: '',
        portion: '',
        price: 0,
        pricePerKg: 0,
        pricePerUnit: 0,
        category: '',
        supplier: supplier.name
      })
      setShowAddItem(false)
    }
  }

  return (
    <div className={styles.container}>
      <button onClick={onBack} className={styles.backBtn}>
        ← Назад к поставщикам
      </button>

      <div className={styles.supplierSection}>
        <div className={styles.sectionHeader}>
          <h2>Данные поставщика</h2>
          <button
            onClick={() => setIsEditingSupplier(!isEditingSupplier)}
            className={styles.editToggleBtn}
          >
            {isEditingSupplier ? '✕ Отмена' : '✎ Редактировать'}
          </button>
        </div>

        {isEditingSupplier ? (
          <div className={styles.editForm}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Наименование поставщика</label>
                <input
                  type="text"
                  value={supplierData.name || ''}
                  onChange={(e) => setSupplierData({ ...supplierData, name: e.target.value })}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Торговый представитель</label>
                <input
                  type="text"
                  value={supplierData.repName || ''}
                  onChange={(e) => setSupplierData({ ...supplierData, repName: e.target.value })}
                  className={styles.input}
                  placeholder="Имя и фамилия"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Номер телефона</label>
                <input
                  type="tel"
                  value={supplierData.repPhone || ''}
                  onChange={(e) => setSupplierData({ ...supplierData, repPhone: e.target.value })}
                  className={styles.input}
                  placeholder="+7..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>Электронная почта</label>
                <input
                  type="email"
                  value={supplierData.email || ''}
                  onChange={(e) => setSupplierData({ ...supplierData, email: e.target.value })}
                  className={styles.input}
                  placeholder="email@example.com"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Когда делаем заявку</label>
                <input
                  type="text"
                  value={supplierData.orderDeadline || ''}
                  onChange={(e) => setSupplierData({ ...supplierData, orderDeadline: e.target.value })}
                  className={styles.input}
                  placeholder="Понедельник до 10:00"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Контактная информация</label>
                <textarea
                  value={supplierData.contact || ''}
                  onChange={(e) => setSupplierData({ ...supplierData, contact: e.target.value })}
                  className={styles.textarea}
                  rows={3}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Примечание</label>
                <textarea
                  value={supplierData.note || ''}
                  onChange={(e) => setSupplierData({ ...supplierData, note: e.target.value })}
                  className={styles.textarea}
                  rows={3}
                  placeholder="Любые дополнительные заметки..."
                />
              </div>
            </div>
            <button onClick={handleSaveSupplier} className={styles.saveBtn}>
              ✓ Сохранить данные поставщика
            </button>
          </div>
        ) : (
          <div className={styles.supplierInfo}>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Наименование:</span>
                <span className={styles.value}>{supplier.name}</span>
              </div>
              {supplier.repName && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Торговый представитель:</span>
                  <span className={styles.value}>{supplier.repName}</span>
                </div>
              )}
              {supplier.repPhone && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Телефон:</span>
                  <span className={styles.value}>{supplier.repPhone}</span>
                </div>
              )}
              {supplier.email && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Email:</span>
                  <span className={styles.value}>{supplier.email}</span>
                </div>
              )}
              {supplier.orderDeadline && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Заявка:</span>
                  <span className={styles.value}>{supplier.orderDeadline}</span>
                </div>
              )}
              {supplier.contact && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Контакты:</span>
                  <span className={styles.value}>{supplier.contact}</span>
                </div>
              )}
              {supplier.note && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Примечание:</span>
                  <span className={styles.value}>{supplier.note}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={styles.itemsSection}>
        <div className={styles.sectionHeader}>
          <h2>Товары поставщика ({supplier.items.length})</h2>
          <button
            onClick={() => setShowAddItem(!showAddItem)}
            className={styles.addItemBtn}
          >
            {showAddItem ? '✕ Отмена' : '➕ Добавить товар'}
          </button>
        </div>

        {showAddItem && (
          <div className={styles.addItemForm}>
            <div className={styles.itemFormGrid}>
              <div className={styles.formGroup}>
                <label>Название товара *</label>
                <input
                  type="text"
                  value={newItem.name || ''}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Артикул</label>
                <input
                  type="text"
                  value={newItem.article || ''}
                  onChange={(e) => setNewItem({ ...newItem, article: e.target.value })}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Фасовка</label>
                <input
                  type="text"
                  value={newItem.portion || ''}
                  onChange={(e) => setNewItem({ ...newItem, portion: e.target.value })}
                  className={styles.input}
                  placeholder="1 кг, 500 гр, 1 шт..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>Категория</label>
                <input
                  type="text"
                  value={newItem.category || ''}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Цена за кг</label>
                <input
                  type="number"
                  value={newItem.pricePerKg || ''}
                  onChange={(e) => setNewItem({ ...newItem, pricePerKg: Number(e.target.value) })}
                  className={styles.input}
                  step="0.01"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Цена за штуку</label>
                <input
                  type="number"
                  value={newItem.pricePerUnit || ''}
                  onChange={(e) => setNewItem({ ...newItem, pricePerUnit: Number(e.target.value) })}
                  className={styles.input}
                  step="0.01"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Основная цена</label>
                <input
                  type="number"
                  value={newItem.price || ''}
                  onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                  className={styles.input}
                  step="0.01"
                />
              </div>
            </div>
            <button onClick={handleAddItem} className={styles.saveBtn}>
              ✓ Добавить товар
            </button>
          </div>
        )}

        <div className={styles.itemsTable}>
          {supplier.items.length === 0 ? (
            <p className={styles.noItems}>Товары не добавлены</p>
          ) : (
            <div className={styles.itemsList}>
              {supplier.items.map(item => (
                <div key={item.id} className={styles.itemCard}>
                  {editingItemId === item.id ? (
                    <div className={styles.editItemForm}>
                      <div className={styles.itemFormGrid}>
                        <input
                          type="text"
                          value={editingItem.name || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                          className={styles.input}
                          placeholder="Название"
                        />
                        <input
                          type="text"
                          value={editingItem.article || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, article: e.target.value })}
                          className={styles.input}
                          placeholder="Артикул"
                        />
                        <input
                          type="text"
                          value={editingItem.portion || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, portion: e.target.value })}
                          className={styles.input}
                          placeholder="Фасовка"
                        />
                        <input
                          type="text"
                          value={editingItem.category || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                          className={styles.input}
                          placeholder="Категория"
                        />
                        <input
                          type="number"
                          value={editingItem.pricePerKg || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, pricePerKg: Number(e.target.value) })}
                          className={styles.input}
                          placeholder="Цена/кг"
                          step="0.01"
                        />
                        <input
                          type="number"
                          value={editingItem.pricePerUnit || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, pricePerUnit: Number(e.target.value) })}
                          className={styles.input}
                          placeholder="Цена/шт"
                          step="0.01"
                        />
                        <input
                          type="number"
                          value={editingItem.price || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                          className={styles.input}
                          placeholder="Цена"
                          step="0.01"
                        />
                      </div>
                      <div className={styles.itemActions}>
                        <button onClick={handleSaveItem} className={styles.saveBtn}>✓ Сохр</button>
                        <button onClick={() => setEditingItemId(null)} className={styles.cancelBtn}>✕ Отм</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={styles.itemContent}>
                        <div className={styles.itemName}>{item.name}</div>
                        <div className={styles.itemSpecs}>
                          {item.article && <span>Арт: {item.article}</span>}
                          {item.portion && <span>Фас: {item.portion}</span>}
                          {item.category && <span>Кат: {item.category}</span>}
                        </div>
                        <div className={styles.itemPrices}>
                          {item.pricePerKg > 0 && <span>{item.pricePerKg} ₽/кг</span>}
                          {item.pricePerUnit > 0 && <span>{item.pricePerUnit} ₽/шт</span>}
                          {item.price > 0 && <span>{item.price} ₽</span>}
                        </div>
                      </div>
                      <div className={styles.itemActions}>
                        <button
                          onClick={() => handleEditItem(item)}
                          className={styles.editItemBtn}
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className={styles.deleteItemBtn}
                        >
                          🗑
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SupplierDetail
