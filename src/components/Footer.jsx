import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>© {new Date().getFullYear()} Книжная полка — учебный проект на React и PHP</p>
        <p>
          <Link to="/about">О сайте</Link> · <Link to="/contacts">Написать нам</Link>
        </p>
      </div>
    </footer>
  )
}

export default Footer
