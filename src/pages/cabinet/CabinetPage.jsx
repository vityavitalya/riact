import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../../config.js'
import CabinetMenu from '../../components/CabinetMenu.jsx'

function CabinetPage({ onLogout }) {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(API_URL + '/cabinet/summary', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setSummary(data)
        }
      })
      .catch(() => setError('Сервер не отвечает'))
  }, [])

  return (
    <div>
      <CabinetMenu onLogout={onLogout} />
      <h1>Личный кабинет</h1>
      {error && <p className="error">{error}</p>}

      {summary && (
        <div className="summary">
          <p>Здравствуйте, <b>{summary.name}</b>!</p>
          <p>У вас записей: <b>{summary.count}</b></p>
          <Link to="/cabinet/items" className="button">Мои записи</Link>{' '}
          <Link to="/cabinet/items/create" className="button button-light">Добавить книгу</Link>
        </div>
      )}
    </div>
  )
}

export default CabinetPage
