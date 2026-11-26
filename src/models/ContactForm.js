export const emptyContactForm = {
  name: '',
  email: '',
  message: ''
}

export function validateContactForm(form) {
  const errors = {}

  if (form.name.trim() === '') {
    errors.name = 'Введите имя'
  }
  if (!form.email.includes('@')) {
    errors.email = 'Введите правильный email'
  }
  if (form.message.trim().length < 10) {
    errors.message = 'Сообщение должно быть не короче 10 символов'
  }

  return errors
}
