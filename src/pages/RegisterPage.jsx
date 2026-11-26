import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../config.js'
import FormField from '../components/FormField.jsx'
import { emptyRegisterForm, validateRegisterForm } from '../models/RegisterForm.js'

function RegisterPage({ setUser }) {
  const [form, setForm] = useState(emptyRegisterForm)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setServerError('')

    const newErrors = validateRegisterForm(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      return
    }

    fetch(API_URL + '/auth/register', {
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
      <h1>Регистрация</h1>

      <form onSubmit={handleSubmit} className="form" noValidate>
        <FormField label="Имя" name="name" value={form.name} onChange={handleChange} error={errors.name} />
        <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
        <FormField label="Пароль (минимум 6 символов)" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} />
        <FormField label="Повторите пароль" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />

        {serverError && <p className="error">{serverError}</p>}

        <button type="submit" className="button">Зарегистрироваться</button>
      </form>

      <p>Уже есть аккаунт? <Link to="/login">Войдите</Link></p>
    </div>
  )
}

export default RegisterPage
