import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Preloader from './components/Preloader/Preloader'
import Navbar from './components/Navbar/Navbar'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import Footer from './components/Footer/Footer'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import PropertyDetail from './pages/PropertyDetail'
import Tasaciones from './pages/Tasaciones'
import Nosotros from './pages/Nosotros'
import Contacto from './pages/Contacto'
import AdminPanel from './pages/AdminPanel'

function App() {
  const [loading, setLoading] = useState(true)
  const [fastLoad, setFastLoad] = useState(false)
  const location = useLocation()
  const [prevPath, setPrevPath] = useState(location.pathname)
  const isAdmin = location.pathname.startsWith('/admin')

  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname)
    if (!isAdmin) {
      setFastLoad(true)
      setLoading(true)
    }
  }

  return (
    <>
      {!isAdmin && <ScrollToTop />}
      {loading && !isAdmin && <Preloader onFinish={() => setLoading(false)} fast={fastLoad} />}
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/propiedades" element={<Catalog />} />
        <Route path="/propiedad/:id" element={<PropertyDetail />} />
        <Route path="/tasaciones" element={<Tasaciones />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      {!isAdmin && <Footer />}
    </>
  )
}

export default App