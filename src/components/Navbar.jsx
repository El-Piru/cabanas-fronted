import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { api } from '../api'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const esHome = location.pathname === '/'
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null')
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [dropdownAbierto, setDropdownAbierto] = useState(false)
  const [mostrarModalDatos, setMostrarModalDatos] = useState(false)
  const dropdownRef = useRef(null)

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownAbierto(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const cerrarSesion = async () => {
    try {
      await api.logout()
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor:', error)
    }
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setDropdownAbierto(false)
    setMenuAbierto(false)
    navigate('/login')
  }

  const handleEliminarCuenta = async () => {
    const confirmacion = window.confirm(
      '¿Estás seguro de que deseas eliminar tu cuenta?\n\nEsta acción es permanente y no se podrá deshacer.'
    )
    if (!confirmacion) return

    try {
      const res = await api.eliminarCuenta()
      if (res.ok) {
        alert('Tu cuenta ha sido eliminada exitosamente.')
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
        setMostrarModalDatos(false)
        setDropdownAbierto(false)
        setMenuAbierto(false)
        navigate('/')
        window.location.reload()
      } else {
        alert(res.mensaje || 'No se pudo eliminar la cuenta.')
      }
    } catch (err) {
      console.error(err)
      alert('Error de conexión con el servidor.')
    }
  }

  return (
    <>
      <nav style={{ background: '#407DAF', padding: '0 1.5rem', position: 'relative', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', maxWidth: '1100px', margin: '0 auto' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#FAF7F2', fontWeight: 'bold', fontSize: '1.05rem', textDecoration: 'none', fontFamily: 'Georgia,serif', flexShrink: 0 }}>
            <img
              src="/logo.jpg"
              alt="Logo Cabañas La Higuera"
              style={{ height: '36px', width: '36px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(250,247,242,0.6)' }}
              onError={(e) => e.target.style.display = 'none'}
            />
            <span>Cabañas La Higuera</span>
          </Link>

          <button onClick={() => setMenuAbierto(!menuAbierto)} style={{ display: 'none', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer', padding: '4px' }} className="hamburger">
            {menuAbierto ? '✕' : '☰'}
          </button>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }} className="nav-desktop">
            {!esHome && (
              <Link to="/" style={{ color: 'rgba(250,247,242,0.8)', textDecoration: 'none', fontSize: '0.9rem' }}>
                Menú
              </Link>
            )}
            
            {usuario ? (
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  onClick={() => setDropdownAbierto(!dropdownAbierto)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    color: '#FAF7F2',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    padding: '6px 14px',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{usuario.nombre || 'Mi Cuenta'}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{dropdownAbierto ? '▲' : '▼'}</span>
                </button>

                {dropdownAbierto && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    background: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
                    border: '1px solid rgba(236, 232, 224, 0.8)',
                    minWidth: '200px',
                    padding: '8px 0',
                    zIndex: 1000,
                    overflow: 'hidden'
                  }}>
                    <div style={{ padding: '8px 16px', borderBottom: '1px solid #FAF6F0' }}>
                      <span style={{ fontSize: '0.75rem', color: '#7A8E7B', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Conectado como</span>
                      <p style={{ margin: '2px 0 0', fontSize: '0.9rem', fontWeight: '600', color: '#182535', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{usuario.nombre}</p>
                    </div>

                    <button
                      onClick={() => {
                        setDropdownAbierto(false)
                        setMostrarModalDatos(true)
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 16px',
                        background: 'none',
                        border: 'none',
                        color: '#182535',
                        fontSize: '0.88rem',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FAF8F5'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      Mis Datos
                    </button>

                    {usuario?.rol === 'admin' ? (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownAbierto(false)}
                        style={{
                          display: 'block',
                          padding: '10px 16px',
                          color: '#C01C1C',
                          textDecoration: 'none',
                          fontSize: '0.88rem',
                          fontWeight: '600'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#FAF8F5'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        Panel Admin
                      </Link>
                    ) : (
                      <Link
                        to="/mis-reservas"
                        onClick={() => setDropdownAbierto(false)}
                        style={{
                          display: 'block',
                          padding: '10px 16px',
                          color: '#182535',
                          textDecoration: 'none',
                          fontSize: '0.88rem'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#FAF8F5'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        Mis Reservas
                      </Link>
                    )}

                    <div style={{ borderTop: '1px solid #FAF6F0', margin: '4px 0' }} />

                    <button
                      onClick={cerrarSesion}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 16px',
                        background: 'none',
                        border: 'none',
                        color: '#C01C1C',
                        fontSize: '0.88rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FFF5F5'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" style={{ color: 'rgba(250,247,242,0.8)', textDecoration: 'none', fontSize: '0.9rem' }}>Iniciar sesión</Link>
                <Link to="/registro" style={{ background: '#C01C1C', color: '#fff', padding: '6px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem' }}>Registrarse</Link>
              </>
            )}
          </div>
        </div>

        {/* Menú Móvil */}
        {menuAbierto && (
          <div style={{ background: '#407DAF', padding: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.1)', maxWidth: '1100px', margin: '0 auto' }}>
            {!esHome && (
              <Link to="/" onClick={() => setMenuAbierto(false)} style={{ display: 'block', color: 'rgba(250,247,242,0.8)', textDecoration: 'none', padding: '10px 0', fontSize: '1rem' }}>
                Menú
              </Link>
            )}
            {usuario ? (
              <>
                <div style={{ color: '#F5C842', padding: '8px 0', fontWeight: '600', fontSize: '1rem' }}>
                  Hola, {usuario?.nombre}
                </div>
                <button
                  onClick={() => {
                    setMenuAbierto(false)
                    setMostrarModalDatos(true)
                  }}
                  style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', color: 'rgba(250,247,242,0.9)', padding: '10px 0', fontSize: '1rem', cursor: 'pointer' }}
                >
                  Mis Datos
                </button>
                {usuario?.rol === 'admin' ? (
                  <Link to="/admin" onClick={() => setMenuAbierto(false)} style={{ display: 'block', color: '#F5C842', textDecoration: 'none', padding: '10px 0', fontWeight: '500', fontSize: '1rem' }}>Panel Admin</Link>
                ) : (
                  <Link to="/mis-reservas" onClick={() => setMenuAbierto(false)} style={{ display: 'block', color: 'rgba(250,247,242,0.8)', textDecoration: 'none', padding: '10px 0', fontSize: '1rem' }}>Mis Reservas</Link>
                )}
                <button onClick={cerrarSesion} style={{ background: '#C01C1C', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', marginTop: '8px' }}>
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/registro" onClick={() => setMenuAbierto(false)} style={{ display: 'block', color: 'rgba(250,247,242,0.8)', textDecoration: 'none', padding: '10px 0', fontSize: '1rem' }}>Registrarse</Link>
                <Link to="/login" onClick={() => setMenuAbierto(false)} style={{ display: 'block', color: 'rgba(250,247,242,0.8)', textDecoration: 'none', padding: '10px 0', fontSize: '1rem' }}>Iniciar sesión</Link>
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

      {/* Modal Mis Datos */}
      {mostrarModalDatos && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(24, 37, 53, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1rem'
          }}
          onClick={() => setMostrarModalDatos(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              maxWidth: '460px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
              position: 'relative',
              border: '1px solid rgba(236, 232, 224, 0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMostrarModalDatos(false)}
              style={{
                position: 'absolute',
                top: '16px', right: '16px',
                background: '#FAF6F0',
                border: 'none',
                width: '32px', height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: '#182535'
              }}
            >
              ✕
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#182535', fontSize: '1.4rem', fontFamily: '"Outfit", sans-serif', fontWeight: '600' }}>
                Mis Datos
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#7A8E7B', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginTop: '4px', display: 'block' }}>
                Perfil de Cliente
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#FAF8F5', padding: '1.25rem', borderRadius: '16px', border: '1px solid #ECE8E0' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#7A8E7B', fontWeight: '600', textTransform: 'uppercase' }}>Nombre Completo</span>
                <p style={{ margin: '2px 0 0', color: '#182535', fontWeight: '600', fontSize: '0.95rem' }}>{usuario?.nombre || 'No especificado'}</p>
              </div>
              <div style={{ borderTop: '1px solid #ECE8E0', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#7A8E7B', fontWeight: '600', textTransform: 'uppercase' }}>Correo Electrónico</span>
                <p style={{ margin: '2px 0 0', color: '#182535', fontWeight: '500', fontSize: '0.95rem' }}>{usuario?.email || 'No especificado'}</p>
              </div>
              {usuario?.telefono && (
                <div style={{ borderTop: '1px solid #ECE8E0', paddingTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#7A8E7B', fontWeight: '600', textTransform: 'uppercase' }}>Teléfono de Contacto</span>
                  <p style={{ margin: '2px 0 0', color: '#182535', fontWeight: '500', fontSize: '0.95rem' }}>{usuario.telefono}</p>
                </div>
              )}
              <div style={{ borderTop: '1px solid #ECE8E0', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#7A8E7B', fontWeight: '600', textTransform: 'uppercase' }}>Tipo de Cuenta</span>
                <p style={{ margin: '2px 0 0', color: usuario?.rol === 'admin' ? '#C01C1C' : '#204C72', fontWeight: '600', fontSize: '0.95rem' }}>
                  {usuario?.rol === 'admin' ? 'Administrador del Complejo' : 'Cliente Registrado'}
                </p>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handleEliminarCuenta}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#991B1B',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  textDecoration: 'underline',
                  padding: '4px 0'
                }}
              >
                Eliminar mi cuenta
              </button>
              <button
                onClick={() => setMostrarModalDatos(false)}
                style={{
                  background: '#C01C1C',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
