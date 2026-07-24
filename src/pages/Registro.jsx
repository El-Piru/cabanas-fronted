import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'
import SEO from '../components/SEO'
import styles from './Registro.module.css'

export default function Registro() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', email: '', password: '', telefono: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    
    // Formatear número de teléfono con +56 si no lo tiene
    let telefonoFormateado = form.telefono.trim()
    if (telefonoFormateado) {
      // Remover cualquier variación de +56, 56 o espacios al inicio
      telefonoFormateado = telefonoFormateado.replace(/^(\+?56)?\s?/, '')
      telefonoFormateado = `+56 ${telefonoFormateado}`
    }

    try {
      const res = await api.registro({ ...form, telefono: telefonoFormateado })
      if (res.ok) {
        navigate('/login')
      } else {
        setError(res.mensaje || 'Error al registrar usuario')
      }
    } catch (err) {
      console.error('Error de registro:', err)
      setError('Error de comunicación con el servidor. Por favor, intenta más tarde.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className={styles.container}>
      <SEO titulo="Crear Cuenta" descripcion="Regístrate en Cabañas La Higuera Rapel para reservar tu estadía a orillas del Lago Rapel." />
      <div className={styles.card}>
        <h2 className={styles.title}>
          Crear cuenta
        </h2>
        <p className={styles.subtitle}>
          Unete a Cabañas La Higuera
        </p>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Nombre completo
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={e => setForm({...form, nombre: e.target.value})}
              placeholder="Tu nombre"
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Correo electronico
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              placeholder="tu@correo.cl"
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Teléfono de contacto
            </label>
            <div className={styles.phoneWrapper}>
              <span className={styles.phonePrefix}>+56</span>
              <input
                type="tel"
                value={form.telefono}
                onChange={e => setForm({...form, telefono: e.target.value})}
                placeholder="9 8669 8970"
                className={styles.phoneInput}
              />
            </div>
          </div>
          <div className={styles.inputGroupLast}>
            <label className={styles.label}>
              Contrasena
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              placeholder="Minimo 6 caracteres"
              required
              className={styles.input}
            />
          </div>
          <button
            type="submit"
            disabled={cargando}
            className={styles.submitBtn}
          >
            {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className={styles.footer}>
          Ya tienes cuenta?{' '}
          <Link to="/login" className={styles.loginLink}>Inicia sesion</Link>
        </p>
      </div>
    </div>
  )
}