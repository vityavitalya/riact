import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API_URL } from '../../config.js'
import CabinetMenu from '../../components/CabinetMenu.jsx'
import FormField from '../../components/FormField.jsx'
import { emptyItemForm, validateItemForm } from '../../models/ItemForm.js'

function EditItemPage({ onLogout }) {
  const { id } = useParams()
  const [form, setForm] = useState(emptyItemForm)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loadError, setLoadError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetch(API_URL + '/cabinet/items/' + id, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setLoadError(data.error)
        } else {
          setForm({
            title: data.title,
            author: data.author,
            year: String(data.year),
            description: data.description || ''
          })
        }
      })
      .catch(() => setLoadError('Сервер не отвечает'))
  }, [id])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setServerError('')

    const newErrors = validateItemForm(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      return
    }

    fetch(API_URL + '/cabinet/items/' + id, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setServerError(data.error)
        } else {
          navigate('/cabinet/items')
        }
      })
      .catch(() => setServerError('Сервер не отвечает'))
  }

  if (loadError) {
    return (
      <div>
        <CabinetMenu onLogout={onLogout} />
        <p className="error">{loadError}</p>
      </div>
    )
  }

  return (
    <div>
      <CabinetMenu onLogout={onLogout} />
      <div className="form-page">
        <h1>Редактирование книги</h1>

        <form onSubmit={handleSubmit} className="form" noValidate>
          <FormField label="Название" name="title" value={form.title} onChange={handleChange} error={errors.title} />
          <FormField label="Автор" name="author" value={form.author} onChange={handleChange} error={errors.author} />
          <FormField label="Год" name="year" type="number" value={form.year} onChange={handleChange} error={errors.year} />
          <FormField label="Описание" name="description" type="textarea" value={form.description} onChange={handleChange} />

          {serverError && <p className="error">{serverError}</p>}

          <button type="submit" className="button">Сохранить</button>
        </form>
      </div>
    </div>
  )
}

export default EditItemPage
