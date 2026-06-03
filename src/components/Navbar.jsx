import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null')

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  return (
    <nav style={{background:'#2C4A2E',padding:'0 2rem',height:'60px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <Link to="/" style={{color:'#FAF7F2',fontWeight:'bold',fontSize:'1.2rem',textDecoration:'none'}}>
        Cabanas del Bosque
      </Link>
      <div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
        <Link to="/" style={{color:'rgba(250,247,242,0.8)',textDecoration:'none'}}>Cabanas</Link>
        {token ? (
          <>
            {usuario?.rol === 'admin' ? (
              <Link to="/admin" style={{color:'#F5C842',textDecoration:'none',fontWeight:'500'}}>Panel Admin</Link>
            ) : (
              <Link to="/mis-reservas" style={{color:'rgba(250,247,242,0.8)',textDecoration:'none'}}>Mis Reservas</Link>
            )}
            <span style={{color:'rgba(250,247,242,0.6)',fontSize:'0.85rem'}}>Hola, {usuario?.nombre}</span>
            <button onClick={cerrarSesion} style={{background:'#C8860A',color:'#fff',border:'none',padding:'6px 16px',borderRadius:'6px',cursor:'pointer'}}>
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{color:'rgba(250,247,242,0.8)',textDecoration:'none'}}>Iniciar sesion</Link>
            <Link to="/registro" style={{background:'#C8860A',color:'#fff',padding:'6px 16px',borderRadius:'6px',textDecoration:'none'}}>Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  )
}