export const emptyRegisterForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
}

export function validateRegisterForm(form) {
  const errors = {}

  if (form.name.trim() === '') {
    errors.name = 'Введите имя'
  }
  if (!form.email.includes('@')) {
    errors.email = 'Введите правильный email'
  }
  if (form.password.length < 6) {
    errors.password = 'Пароль должен быть не короче 6 символов'
  }
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают'
  }

  return errors
}
