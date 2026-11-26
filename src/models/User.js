export const emptyUser = {
  id: 0,
  name: '',
  email: '',
  role: 'User'
}

export function isAdmin(user) {
  return user !== null && user.role === 'Admin'
}
