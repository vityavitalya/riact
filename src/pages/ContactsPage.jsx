import { useState } from 'react'
import { API_URL } from '../config.js'
import FormField from '../components/FormField.jsx'
import { emptyContactForm, validateContactForm } from '../models/ContactForm.js'

function ContactsPage() {
  const [form, setForm] = useState(emptyContactForm)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSuccess('')
    setServerError('')

    const newErrors = validateContactForm(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      return
    }

    fetch(API_URL + '/contact', {
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
          setSuccess(data.message)
          setForm(emptyContactForm)
        }
      })
      .catch(() => setServerError('Сервер не отвечает'))
  }

  return (
    <div className="form-page">
      <h1>Контакты</h1>
      <p>Email: books@example.com · Телефон: +7 (000) 000-00-00</p>
      <p>Или напишите нам через форму:</p>

      <form onSubmit={handleSubmit} className="form" noValidate>
        <FormField label="Ваше имя" name="name" value={form.name} onChange={handleChange} error={errors.name} />
        <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
        <FormField label="Сообщение" name="message" type="textarea" value={form.message} onChange={handleChange} error={errors.message} />

        {serverError && <p className="error">{serverError}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit" className="button">Отправить</button>
      </form>
    </div>
  )
}

export default ContactsPage
