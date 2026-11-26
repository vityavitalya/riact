export const emptyLoginForm = {
  email: '',
  password: ''
}

export function validateLoginForm(form) {
  const errors = {}

  if (form.email.trim() === '') {
    errors.email = 'Введите email'
  }
  if (form.password === '') {
    errors.password = 'Введите пароль'
  }

  return errors
}
