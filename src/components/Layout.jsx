import Header from './Header.jsx'
import Footer from './Footer.jsx'

function Layout({ user, onLogout, children }) {
  return (
    <div className="page">
      <Header user={user} onLogout={onLogout} />
      <main className="container">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
