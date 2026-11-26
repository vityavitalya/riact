import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../config.js'
import CabinetMenu from '../../components/CabinetMenu.jsx'
import FormField from '../../components/FormField.jsx'
import { emptyItemForm, validateItemForm } from '../../models/ItemForm.js'

function CreateItemPage({ onLogout }) {
  const [form, setForm] = useState(emptyItemForm)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()

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

    fetch(API_URL + '/cabinet/items', {
      method: 'POST',
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

  return (
    <div>
      <CabinetMenu onLogout={onLogout} />
      <div className="form-page">
        <h1>Новая книга</h1>

        <form onSubmit={handleSubmit} className="form" noValidate>
          <FormField label="Название" name="title" value={form.title} onChange={handleChange} error={errors.title} />
          <FormField label="Автор" name="author" value={form.author} onChange={handleChange} error={errors.author} />
          <FormField label="Год" name="year" type="number" value={form.year} onChange={handleChange} error={errors.year} />
          <FormField label="Описание" name="description" type="textarea" value={form.description} onChange={handleChange} />

          {serverError && <p className="error">{serverError}</p>}

          <button type="submit" className="button">Добавить</button>
        </form>
      </div>
    </div>
  )
}

export default CreateItemPage
