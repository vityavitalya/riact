import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { API_URL } from '../../config.js'
import CabinetMenu from '../../components/CabinetMenu.jsx'

function DeleteItemPage({ onLogout }) {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetch(API_URL + '/cabinet/items/' + id, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setItem(data)
        }
      })
      .catch(() => setError('Сервер не отвечает'))
  }, [id])

  function handleDelete() {
    fetch(API_URL + '/cabinet/items/' + id, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          navigate('/cabinet/items')
        }
      })
      .catch(() => setError('Сервер не отвечает'))
  }

  return (
    <div>
      <CabinetMenu onLogout={onLogout} />
      <h1>Удаление книги</h1>
      {error && <p className="error">{error}</p>}

      {item && (
        <div className="confirm-box">
          <p>Точно удалить книгу <b>«{item.title}»</b> ({item.author})?</p>
          <button className="button button-danger" onClick={handleDelete}>Да, удалить</button>{' '}
          <Link to="/cabinet/items" className="button button-light">Отмена</Link>
        </div>
      )}
    </div>
  )
}

export default DeleteItemPage
