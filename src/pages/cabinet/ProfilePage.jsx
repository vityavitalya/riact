import { useState, useEffect } from 'react'
import { API_URL } from '../../config.js'
import CabinetMenu from '../../components/CabinetMenu.jsx'
import FormField from '../../components/FormField.jsx'
import { emptyProfileForm, validateProfileForm } from '../../models/ProfileForm.js'

function ProfilePage({ onLogout, setUser }) {
  const [form, setForm] = useState(emptyProfileForm)
  const [profile, setProfile] = useState(null)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetch(API_URL + '/cabinet/profile', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setServerError(data.error)
        } else {
          setProfile(data)
          setForm({ name: data.name, email: data.email })
        }
      })
      .catch(() => setServerError('Сервер не отвечает'))
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    setSuccess('')

    const newErrors = validateProfileForm(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      return
    }

    fetch(API_URL + '/cabinet/profile', {
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
          setSuccess(data.message)
          setUser(data.user)
        }
      })
      .catch(() => setServerError('Сервер не отвечает'))
  }

  return (
    <div>
      <CabinetMenu onLogout={onLogout} />
      <div className="form-page">
        <h1>Профиль</h1>

        {profile && (
          <div className="profile-info">
            <p><b>Роль:</b> {profile.role}</p>
            <p><b>Дата регистрации:</b> {profile.created_at}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form" noValidate>
          <FormField label="Имя" name="name" value={form.name} onChange={handleChange} error={errors.name} />
          <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />

          {serverError && <p className="error">{serverError}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit" className="button">Сохранить</button>
        </form>
      </div>
    </div>
  )
}

export default ProfilePage
