export const emptyProfileForm = {
  name: '',
  email: ''
}

export function validateProfileForm(form) {
  const errors = {}

  if (form.name.trim() === '') {
    errors.name = 'Введите имя'
  }
  if (!form.email.includes('@')) {
    errors.email = 'Введите правильный email'
  }

  return errors
}
