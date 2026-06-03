import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Reservas from './pages/Reservas'
import Reservar from './pages/Reservar'
import Admin from './pages/Admin'

function App() {
  return (
    <BrowserRouter>
      <div style={{minHeight:'100vh',background:'#FAF7F2'}}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/mis-reservas" element={<Reservas />} />
          <Route path="/reservar/:id" element={<Reservar />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
