import { useState } from 'react'
import { API_URL } from '../../config.js'
import CabinetMenu from '../../components/CabinetMenu.jsx'
import FormField from '../../components/FormField.jsx'
import { emptyPasswordForm, validatePasswordForm } from '../../models/PasswordForm.js'

function ChangePasswordPage({ onLogout }) {
  const [form, setForm] = useState(emptyPasswordForm)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    setSuccess('')

    const newErrors = validatePasswordForm(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      return
    }

    fetch(API_URL + '/cabinet/change-password', {
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
          setForm(emptyPasswordForm)
        }
      })
      .catch(() => setServerError('Сервер не отвечает'))
  }

  return (
    <div>
      <CabinetMenu onLogout={onLogout} />
      <div className="form-page">
        <h1>Смена пароля</h1>

        <form onSubmit={handleSubmit} className="form" noValidate>
          <FormField label="Старый пароль" name="oldPassword" type="password" value={form.oldPassword} onChange={handleChange} error={errors.oldPassword} />
          <FormField label="Новый пароль" name="newPassword" type="password" value={form.newPassword} onChange={handleChange} error={errors.newPassword} />
          <FormField label="Повторите новый пароль" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />

          {serverError && <p className="error">{serverError}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit" className="button">Сменить пароль</button>
        </form>
      </div>
    </div>
  )
}

export default ChangePasswordPage
