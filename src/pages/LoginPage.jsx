import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../config.js'
import FormField from '../components/FormField.jsx'
import { emptyLoginForm, validateLoginForm } from '../models/LoginForm.js'

function LoginPage({ setUser }) {
  const [form, setForm] = useState(emptyLoginForm)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setServerError('')

    const newErrors = validateLoginForm(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      return
    }

    fetch(API_URL + '/auth/login', {
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
          setUser(data.user)
          navigate('/cabinet')
        }
      })
      .catch(() => setServerError('Сервер не отвечает'))
  }

  return (
    <div className="form-page">
      <h1>Вход</h1>

      <form onSubmit={handleSubmit} className="form" noValidate>
        <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
        <FormField label="Пароль" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} />

        {serverError && <p className="error">{serverError}</p>}

        <button type="submit" className="button">Войти</button>
      </form>

      <p>Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link></p>
    </div>
  )
}

export default LoginPage
