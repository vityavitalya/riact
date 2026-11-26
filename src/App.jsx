import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { API_URL } from './config.js'
import Layout from './components/Layout.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import HomePage from './pages/HomePage.jsx'
import ItemsPage from './pages/ItemsPage.jsx'
import ItemDetailsPage from './pages/ItemDetailsPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactsPage from './pages/ContactsPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import CabinetPage from './pages/cabinet/CabinetPage.jsx'
import MyItemsPage from './pages/cabinet/MyItemsPage.jsx'
import CreateItemPage from './pages/cabinet/CreateItemPage.jsx'
import EditItemPage from './pages/cabinet/EditItemPage.jsx'
import DeleteItemPage from './pages/cabinet/DeleteItemPage.jsx'
import ProfilePage from './pages/cabinet/ProfilePage.jsx'
import ChangePasswordPage from './pages/cabinet/ChangePasswordPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(API_URL + '/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setUser(data.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  function logout() {
    fetch(API_URL + '/auth/logout', { method: 'POST', credentials: 'include' })
      .finally(() => {
        setUser(null)
        navigate('/login')
      })
  }

  if (loading) {
    return <p className="loading">Загрузка...</p>
  }

  return (
    <Layout user={user} onLogout={logout}>
      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/items/:id" element={<ItemDetailsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage setUser={setUser} />} />

        <Route path="/cabinet" element={
          <PrivateRoute user={user}><CabinetPage onLogout={logout} /></PrivateRoute>
        } />
        <Route path="/cabinet/items" element={
          <PrivateRoute user={user}><MyItemsPage onLogout={logout} /></PrivateRoute>
        } />
        <Route path="/cabinet/items/create" element={
          <PrivateRoute user={user}><CreateItemPage onLogout={logout} /></PrivateRoute>
        } />
        <Route path="/cabinet/items/edit/:id" element={
          <PrivateRoute user={user}><EditItemPage onLogout={logout} /></PrivateRoute>
        } />
        <Route path="/cabinet/items/delete/:id" element={
          <PrivateRoute user={user}><DeleteItemPage onLogout={logout} /></PrivateRoute>
        } />
        <Route path="/cabinet/profile" element={
          <PrivateRoute user={user}><ProfilePage onLogout={logout} setUser={setUser} /></PrivateRoute>
        } />
        <Route path="/cabinet/change-password" element={
          <PrivateRoute user={user}><ChangePasswordPage onLogout={logout} /></PrivateRoute>
        } />

        <Route path="/admin" element={
          <PrivateRoute user={user} adminOnly><AdminPage /></PrivateRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

export default App
