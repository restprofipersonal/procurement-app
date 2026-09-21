import { useState } from 'react'
import { useProcurementStore } from '../store'
import styles from './AdminLogin.module.css'

function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const loginAdmin = useProcurementStore(s => s.loginAdmin)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const success = loginAdmin(password)
    if (success) {
      setPassword('')
      setError('')
    } else {
      setError('Неверный пароль')
      setPassword('')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h2>Вход в админ-панель</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            autoFocus
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button}>
            Войти
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
