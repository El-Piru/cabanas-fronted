import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

// Lazy load de páginas pesadas para code splitting
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Registro = lazy(() => import('./pages/Registro'))
const Reservas = lazy(() => import('./pages/Reservas'))
const Reservar = lazy(() => import('./pages/Reservar'))
const Admin = lazy(() => import('./pages/Admin'))
const PagoResultado = lazy(() => import('./pages/PagoResultado'))
const Terminos = lazy(() => import('./pages/Terminos'))
const Privacidad = lazy(() => import('./pages/Privacidad'))
const RecuperarPassword = lazy(() => import('./pages/RecuperarPassword'))
const RestablecerPassword = lazy(() => import('./pages/RestablecerPassword'))

function AppRoutes() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    }>
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
    </Suspense>
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