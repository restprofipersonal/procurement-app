import { useState } from 'react'
import { useProcurementStore } from '../store'
import type { Item, Supplier } from '../types'
import '../styles.css'

interface ItemRowProps {
  item: Item
  supplier: Supplier
}

function ItemRow({ item, supplier }: ItemRowProps) {
  const [quantity, setQuantity] = useState('')
  const addItem = useProcurementStore(s => s.addItemToOrder)

  const handleAdd = () => {
    const qty = parseFloat(quantity)
    if (qty > 0) {
      addItem(item, supplier, qty)
      setQuantity('')
    }
  }

  return (
    <div className="item-row">
      <div className="item-info">
        <div className="item-name">{item.name}</div>
        {item.portion && <div className="item-detail">Фасовка: {item.portion}</div>}
        {item.article && <div className="item-detail">Артикул: {item.article}</div>}
        {item.comment && <div className="item-detail">Примечание: {item.comment}</div>}
      </div>

      <div className="item-actions">
        <input
          type="number"
          placeholder="Кол-во"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          className="qty-input"
          step="0.1"
          min="0"
        />
        <button onClick={handleAdd} className="btn btn-add">
          Добавить
        </button>
      </div>
    </div>
  )
}

export default ItemRow
