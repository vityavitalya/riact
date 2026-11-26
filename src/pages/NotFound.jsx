import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="text-page center">
      <h1>404</h1>
      <p>Такой страницы нет.</p>
      <Link to="/" className="button">На главную</Link>
    </div>
  )
}

export default NotFound
