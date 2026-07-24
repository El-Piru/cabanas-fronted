import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

import Home from './pages/Home'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Reservas from './pages/Reservas'
import Reservar from './pages/Reservar'
import Admin from './pages/Admin'
import PagoResultado from './pages/PagoResultado'
import Terminos from './pages/Terminos'
import Privacidad from './pages/Privacidad'
import RecuperarPassword from './pages/RecuperarPassword'
import RestablecerPassword from './pages/RestablecerPassword'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/reservar/:id" element={<Reservar />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/mis-reservas" element={<Reservas />} />
      <Route path="/pago/resultado" element={<PagoResultado />} />
      <Route path="/terminos-y-condiciones" element={<Terminos />} />
      <Route path="/politica-de-privacidad" element={<Privacidad />} />
      <Route path="/recuperar-password" element={<RecuperarPassword />} />
      <Route path="/restablecer-password" element={<RestablecerPassword />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <a href="#main-content" className="skip-to-content">Saltar al contenido</a>
        <div style={{minHeight:'100vh',background:'#FAF8F5',display:'flex',flexDirection:'column'}}>
          <Navbar />
          <main id="main-content" style={{flex:1}}>
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App