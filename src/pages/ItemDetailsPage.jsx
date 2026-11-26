import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { API_URL } from '../config.js'

function ItemDetailsPage() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(API_URL + '/items/' + id, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setItem(data)
        }
      })
      .catch(() => setError('Сервер не отвечает. Запущен ли XAMPP?'))
  }, [id])

  if (error) {
    return (
      <div>
        <p className="error">{error}</p>
        <Link to="/items">← Ко всем книгам</Link>
      </div>
    )
  }

  if (!item) {
    return <p>Загрузка...</p>
  }

  return (
    <div className="details">
      <h1>{item.title}</h1>
      <p><b>Автор:</b> {item.author}</p>
      <p><b>Год:</b> {item.year}</p>
      <p><b>Добавил:</b> {item.owner_name}</p>
      <p className="description">{item.description || 'Описания пока нет.'}</p>
      <Link to="/items">← Ко всем книгам</Link>
    </div>
  )
}

export default ItemDetailsPage
