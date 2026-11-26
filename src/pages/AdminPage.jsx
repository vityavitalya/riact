import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../config.js'

function AdminPage() {
  const [users, setUsers] = useState([])
  const [items, setItems] = useState([])
  const [contacts, setContacts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(API_URL + '/admin/users', { credentials: 'include' })
      .then(res => res.json())
      .then(data => data.error ? setError(data.error) : setUsers(data))

    fetch(API_URL + '/items', { credentials: 'include' })
      .then(res => res.json())
      .then(data => data.error ? setError(data.error) : setItems(data))

    fetch(API_URL + '/admin/contacts', { credentials: 'include' })
      .then(res => res.json())
      .then(data => data.error ? setError(data.error) : setContacts(data))
  }, [])

  function deleteItem(item) {
    if (!window.confirm('Удалить книгу «' + item.title + '»?')) {
      return
    }

    fetch(API_URL + '/admin/items/' + item.id, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setItems(items.filter(i => i.id !== item.id))
        }
      })
  }

  return (
    <div>
      <h1>Админка</h1>
      {error && <p className="error">{error}</p>}

      <h2>Пользователи</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Имя</th><th>Email</th><th>Роль</th><th>Книг</th><th>Регистрация</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.items_count}</td>
                <td>{u.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Все книги</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Название</th><th>Автор</th><th>Год</th><th>Владелец</th><th></th></tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td><Link to={'/items/' + item.id}>{item.title}</Link></td>
                <td>{item.author}</td>
                <td>{item.year}</td>
                <td>{item.owner_name}</td>
                <td>
                  <button className="button button-small button-danger" onClick={() => deleteItem(item)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Сообщения с формы контактов</h2>
      {contacts.length === 0 && <p>Сообщений пока нет.</p>}
      {contacts.map(c => (
        <div key={c.id} className="message">
          <p><b>{c.name}</b> ({c.email}) — {c.created_at}</p>
          <p>{c.message}</p>
        </div>
      ))}
    </div>
  )
}

export default AdminPage
