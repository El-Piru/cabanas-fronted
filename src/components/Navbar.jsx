import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null')
  const [menuAbierto, setMenuAbierto] = useState(false)

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/login')
    setMenuAbierto(false)
  }

  return (
    <nav style={{background:'#1A2E1B',padding:'0 1.5rem',position:'relative'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:'60px'}}>
        <Link to="/" style={{color:'#FAF7F2',fontWeight:'bold',fontSize:'1rem',textDecoration:'none',fontFamily:'Georgia,serif',flexShrink:0}}>
          Cabañas La Higuera
        </Link>

        {/* Botón hamburguesa para móvil */}
        <button onClick={() => setMenuAbierto(!menuAbierto)} style={{display:'none',background:'none',border:'none',color:'#fff',fontSize:'1.5rem',cursor:'pointer',padding:'4px'}} className="hamburger">
          {menuAbierto ? '✕' : '☰'}
        </button>

        {/* Menú desktop */}
        <div style={{display:'flex',gap:'1rem',alignItems:'center'}} className="nav-desktop">
          <Link to="/" style={{color:'rgba(250,247,242,0.8)',textDecoration:'none',fontSize:'0.9rem'}}>Cabañas</Link>
          {token ? (
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

      {/* Menú móvil desplegable */}
      {menuAbierto && (
        <div style={{background:'#1A2E1B',padding:'1rem 0',borderTop:'1px solid rgba(255,255,255,0.1)'}}>
          {token ? (
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
