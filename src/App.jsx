import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Reservas from './pages/Reservas'
import Reservar from './pages/Reservar'
import Admin from './pages/Admin'
import PagoResultado from './pages/PagoResultado'
import Terminos from './pages/Terminos'
import Privacidad from './pages/Privacidad'

function App() {
  return (
    <BrowserRouter>
      <div style={{minHeight:'100vh',background:'#FAF8F5',display:'flex',flexDirection:'column'}}>
        <Navbar />
        <div style={{flex:1}}>
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
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App