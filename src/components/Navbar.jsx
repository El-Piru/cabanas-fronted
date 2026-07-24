import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const esHome = location.pathname === '/'
  const { usuario, logout, eliminarCuenta } = useAuth()
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

  // Cerrar modal con Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (mostrarModalDatos) setMostrarModalDatos(false)
        if (dropdownAbierto) setDropdownAbierto(false)
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [mostrarModalDatos, dropdownAbierto])

  const cerrarSesion = async () => {
    await logout()
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
      const res = await eliminarCuenta()
      if (res.ok) {
        alert('Tu cuenta ha sido eliminada exitosamente.')
        setMostrarModalDatos(false)
        setDropdownAbierto(false)
        setMenuAbierto(false)
        navigate('/')
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
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <Link to="/" className={styles.logoLink}>
            <img
              src="/logo.jpg"
              alt="Logo Cabañas La Higuera"
              className={styles.logoImg}
              onError={(e) => e.target.style.display = 'none'}
            />
            <span>Cabañas La Higuera</span>
          </Link>

          <button onClick={() => setMenuAbierto(!menuAbierto)} className={styles.hamburger}>
            {menuAbierto ? '✕' : '☰'}
          </button>

          <div className={styles.navDesktop}>
            {!esHome && (
              <Link to="/" className={styles.navLink}>
                Menú
              </Link>
            )}
            
            {usuario ? (
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  onClick={() => setDropdownAbierto(!dropdownAbierto)}
                  className={styles.accountBtn}
                >
                  <span>{usuario.nombre || 'Mi Cuenta'}</span>
                  <span className={styles.accountBtnIcon}>{dropdownAbierto ? '▲' : '▼'}</span>
                </button>

                {dropdownAbierto && (
                  <div className={styles.dropdownMenu}>
                    <div className={styles.dropdownHeader}>
                      <span className={styles.dropdownLabel}>Conectado como</span>
                      <p className={styles.dropdownName}>{usuario.nombre}</p>
                    </div>

                    <button
                      onClick={() => {
                        setDropdownAbierto(false)
                        setMostrarModalDatos(true)
                      }}
                      className={styles.dropdownBtn}
                    >
                      Mis Datos
                    </button>

                    {usuario?.rol === 'admin' ? (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownAbierto(false)}
                        className={styles.dropdownLinkAdmin}
                      >
                        Panel Admin
                      </Link>
                    ) : (
                      <Link
                        to="/mis-reservas"
                        onClick={() => setDropdownAbierto(false)}
                        className={styles.dropdownLink}
                      >
                        Mis Reservas
                      </Link>
                    )}

                    <div className={styles.dropdownDivider} />

                    <button
                      onClick={cerrarSesion}
                      className={styles.logoutBtn}
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className={styles.navLink}>Iniciar sesión</Link>
                <Link to="/registro" className={styles.registerBtn}>Registrarse</Link>
              </>
            )}
          </div>
        </div>

        {/* Menú Móvil */}
        {menuAbierto && (
          <div className={styles.mobileMenu}>
            {!esHome && (
              <Link to="/" onClick={() => setMenuAbierto(false)} className={styles.mobileNavLink}>
                Menú
              </Link>
            )}
            {usuario ? (
              <>
                <div className={styles.mobileUserName}>
                  Hola, {usuario?.nombre}
                </div>
                <button
                  onClick={() => {
                    setMenuAbierto(false)
                    setMostrarModalDatos(true)
                  }}
                  className={styles.mobileBtn}
                >
                  Mis Datos
                </button>
                {usuario?.rol === 'admin' ? (
                  <Link to="/admin" onClick={() => setMenuAbierto(false)} className={styles.mobileNavLinkAdmin}>Panel Admin</Link>
                ) : (
                  <Link to="/mis-reservas" onClick={() => setMenuAbierto(false)} className={styles.mobileNavLink}>Mis Reservas</Link>
                )}
                <button onClick={cerrarSesion} className={styles.mobileLogoutBtn}>
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/registro" onClick={() => setMenuAbierto(false)} className={styles.mobileNavLink}>Registrarse</Link>
                <Link to="/login" onClick={() => setMenuAbierto(false)} className={styles.mobileNavLink}>Iniciar sesión</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Modal Mis Datos */}
      {mostrarModalDatos && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Mis Datos"
          onClick={() => setMostrarModalDatos(false)}
        >
          <div
            className={styles.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMostrarModalDatos(false)}
              className={styles.modalCloseBtn}
            >
              ✕
            </button>

            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                Mis Datos
              </h3>
              <span className={styles.modalSubtitle}>
                Perfil de Cliente
              </span>
            </div>

            <div className={styles.modalDataContainer}>
              <div className={styles.dataRowFirst}>
                <span className={styles.dataLabel}>Nombre Completo</span>
                <p className={styles.dataValue}>{usuario?.nombre || 'No especificado'}</p>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Correo Electrónico</span>
                <p className={styles.dataValueLight}>{usuario?.email || 'No especificado'}</p>
              </div>
              {usuario?.telefono && (
                <div className={styles.dataRow}>
                  <span className={styles.dataLabel}>Teléfono de Contacto</span>
                  <p className={styles.dataValueLight}>{usuario.telefono}</p>
                </div>
              )}
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Tipo de Cuenta</span>
                <p className={styles.dataValue} style={{ color: usuario?.rol === 'admin' ? '#C01C1C' : '#204C72' }}>
                  {usuario?.rol === 'admin' ? 'Administrador del Complejo' : 'Cliente Registrado'}
                </p>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={handleEliminarCuenta}
                className={styles.deleteAccountBtn}
              >
                Eliminar mi cuenta
              </button>
              <button
                onClick={() => setMostrarModalDatos(false)}
                className={styles.modalActionBtn}
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
