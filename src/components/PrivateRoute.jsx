import { Navigate } from 'react-router-dom'
import { isAdmin } from '../models/User.js'

function PrivateRoute({ user, adminOnly, children }) {
  if (!user) {
    return <Navigate to="/login" />
  }

  if (adminOnly && !isAdmin(user)) {
    return <Navigate to="/" />
  }

  return children
}

export default PrivateRoute
