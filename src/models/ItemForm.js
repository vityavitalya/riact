export const emptyItemForm = {
  title: '',
  author: '',
  year: '',
  description: ''
}

export function validateItemForm(form) {
  const errors = {}
  const year = Number(form.year)
  const currentYear = new Date().getFullYear()

  if (form.title.trim() === '') {
    errors.title = 'Введите название книги'
  }
  if (form.author.trim() === '') {
    errors.author = 'Введите автора'
  }
  if (!Number.isInteger(year) || year < 1 || year > currentYear) {
    errors.year = 'Год должен быть от 1 до ' + currentYear
  }

  return errors
}
