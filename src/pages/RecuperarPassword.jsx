import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import SEO from '../components/SEO'
import styles from './RecuperarPassword.module.css'

export default function RecuperarPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    setMsg('')
    try {
      const res = await api.recuperarPassword(email)
      if (res.ok) {
        setMsg('Te hemos enviado un correo con instrucciones para restablecer tu contraseña. Revisa también tu carpeta de spam.')
        setEmail('')
      } else {
        setError(res.mensaje || 'Error al procesar la solicitud')
      }
    } catch (err) {
      console.error('Error en recuperar password:', err)
      setError('Error de comunicación con el servidor. Por favor, intenta más tarde.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className={styles.container}>
      <SEO titulo="Recuperar Contraseña" descripcion="Recupera tu contraseña de Cabañas La Higuera Rapel." />
      <div className={styles.card}>
        <h2 className={styles.title}>Recuperar contraseña</h2>
        <p className={styles.description}>
          Ingresa tu dirección de correo electrónico y te enviaremos un enlace para que puedas volver a ingresar.
        </p>

        {error && <div className={styles.error}>{error}</div>}
        {msg && <div className={styles.success}>{msg}</div>}

        {!msg && (
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="ejemplo@correo.com" className={styles.input} />
            </div>
            <button type="submit" disabled={cargando} className={styles.submitBtn}>
              {cargando ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>
        )}

        <p className={styles.footer}>
          <Link to="/login" className={styles.loginLink}>Volver al inicio de sesión</Link>
        </p>
      </div>
    </div>
  )
}
