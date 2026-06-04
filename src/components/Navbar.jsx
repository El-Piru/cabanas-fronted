import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { api } from '../api'

export default function Navbar() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null')
  const [menuAbierto, setMenuAbierto] = useState(false)

  const cerrarSesion = async () => {
    try {
      await api.logout()
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor:', error)
    }
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/login')
    setMenuAbierto(false)
  }

  return (
    <nav style={{background:'#1F313E',padding:'0 1.5rem',position:'relative'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:'60px',maxWidth:'1100px',margin:'0 auto'}}>
        <Link to="/" style={{display:'flex',alignItems:'center',gap:'10px',color:'#FAF7F2',fontWeight:'bold',fontSize:'1.05rem',textDecoration:'none',fontFamily:'Georgia,serif',flexShrink:0}}>
          <img
            src="/logo.jpg"
            alt="Logo Cabañas La Higuera"
            style={{height:'36px', width:'36px', borderRadius:'50%', objectFit:'cover', border:'1.5px solid rgba(250,247,242,0.6)'}}
            onError={(e) => e.target.style.display = 'none'}
          />
          <span>Cabañas La Higuera</span>
        </Link>

        <button onClick={() => setMenuAbierto(!menuAbierto)} style={{display:'none',background:'none',border:'none',color:'#fff',fontSize:'1.5rem',cursor:'pointer',padding:'4px'}} className="hamburger">
          {menuAbierto ? '✕' : '☰'}
        </button>

        <div style={{display:'flex',gap:'1rem',alignItems:'center'}} className="nav-desktop">
          <Link to="/" style={{color:'rgba(250,247,242,0.8)',textDecoration:'none',fontSize:'0.9rem'}}>Cabañas</Link>
          {usuario ? (
            <>
              {usuario?.rol === 'admin' ? (
                <Link to="/admin" style={{color:'#F5C842',textDecoration:'none',fontWeight:'500',fontSize:'0.9rem'}}>Panel Admin</Link>
              ) : (
                <Link to="/mis-reservas" style={{color:'rgba(250,247,242,0.8)',textDecoration:'none',fontSize:'0.9rem'}}>Mis Reservas</Link>
              )}
              <button onClick={cerrarSesion} style={{background:'#C8860A',color:'#fff',border:'none',padding:'6px 16px',borderRadius:'6px',cursor:'pointer',fontSize:'0.85rem'}}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{color:'rgba(250,247,242,0.8)',textDecoration:'none',fontSize:'0.9rem'}}>Iniciar sesión</Link>
              <Link to="/registro" style={{background:'#C8860A',color:'#fff',padding:'6px 16px',borderRadius:'6px',textDecoration:'none',fontSize:'0.9rem'}}>Registrarse</Link>
            </>
          )}
        </div>
      </div>

      {menuAbierto && (
        <div style={{background:'#1F313E',padding:'1rem 0',borderTop:'1px solid rgba(255,255,255,0.1)',maxWidth:'1100px',margin:'0 auto'}}>
          {usuario ? (
            <>
              {usuario?.rol === 'admin' ? (
                <Link to="/admin" onClick={() => setMenuAbierto(false)} style={{display:'block',color:'#F5C842',textDecoration:'none',padding:'10px 0',fontWeight:'500',fontSize:'1rem'}}>Panel Admin</Link>
              ) : (
                <Link to="/mis-reservas" onClick={() => setMenuAbierto(false)} style={{display:'block',color:'rgba(250,247,242,0.8)',textDecoration:'none',padding:'10px 0',fontSize:'1rem'}}>Mis Reservas</Link>
              )}
              <div style={{color:'rgba(250,247,242,0.6)',padding:'10px 0',fontSize:'0.9rem'}}>Hola, {usuario?.nombre}</div>
              <button onClick={cerrarSesion} style={{background:'#C8860A',color:'#fff',border:'none',padding:'8px 20px',borderRadius:'6px',cursor:'pointer',fontSize:'0.9rem',marginTop:'4px'}}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/registro" onClick={() => setMenuAbierto(false)} style={{display:'block',color:'rgba(250,247,242,0.8)',textDecoration:'none',padding:'10px 0',fontSize:'1rem'}}>Registrarse</Link>
              <Link to="/login" onClick={() => setMenuAbierto(false)} style={{display:'block',color:'rgba(250,247,242,0.8)',textDecoration:'none',padding:'10px 0',fontSize:'1rem'}}>Iniciar sesión</Link>
              <Link to="/" onClick={() => setMenuAbierto(false)} style={{display:'block',color:'rgba(250,247,242,0.8)',textDecoration:'none',padding:'10px 0',fontSize:'1rem'}}>Cabañas</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          .nav-desktop { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
