import { useState } from 'react'
import type { OrderItem } from '../types'
import styles from './SMSGenerator.module.css'

interface SMSGeneratorProps {
  orderItems: OrderItem[]
}

function SMSGenerator({ orderItems }: SMSGeneratorProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const groupBySupplier = (items: OrderItem[]) => {
    const map = new Map<string, OrderItem[]>()
    items.forEach(item => {
      const supplier = item.supplier.name
      if (!map.has(supplier)) {
        map.set(supplier, [])
      }
      map.get(supplier)!.push(item)
    })
    return map
  }

  const generateSMS = (supplier: string, items: OrderItem[]): string => {
    const date = new Date().toLocaleDateString('ru-RU')
    let sms = `Заказ на ${date}\n`

    items.forEach(item => {
      sms += `${item.item.name}`
      if (item.item.article) {
        sms += ` (${item.item.article})`
      }
      sms += ` - ${item.orderedQuantity}`
      if (item.item.portion) {
        sms += ` ${item.item.portion}`
      }
      sms += '\n'
    })

    return sms
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  if (orderItems.length === 0) {
    return null
  }

  const supplierMap = groupBySupplier(orderItems)
  const suppliers = Array.from(supplierMap.entries())

  return (
    <div className={styles.container}>
      <h3>📱 SMS сообщения для поставщиков</h3>
      <div className={styles.smsGrid}>
        {suppliers.map(([supplier, items], index) => {
          const sms = generateSMS(supplier, items)
          return (
            <div key={supplier} className={styles.smsCard}>
              <div className={styles.supplierName}>{supplier}</div>
              <pre className={styles.smsText}>{sms}</pre>
              <button
                onClick={() => handleCopy(sms, index)}
                className={`${styles.copyBtn} ${copiedIndex === index ? styles.copied : ''}`}
              >
                {copiedIndex === index ? '✓ Скопировано' : '📋 Копировать'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SMSGenerator
