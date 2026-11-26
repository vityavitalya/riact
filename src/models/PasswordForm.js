export const emptyPasswordForm = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
}

export function validatePasswordForm(form) {
  const errors = {}

  if (form.oldPassword === '') {
    errors.oldPassword = 'Введите старый пароль'
  }
  if (form.newPassword.length < 6) {
    errors.newPassword = 'Новый пароль должен быть не короче 6 символов'
  }
  if (form.newPassword !== form.confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают'
  }

  return errors
}
