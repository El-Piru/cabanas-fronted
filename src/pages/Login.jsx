import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SEO from '../components/SEO'
import styles from './Login.module.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [mostrarPassword, setMostrarPassword] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      const res = await login(form)
      if (res.ok) {
        navigate('/')
      } else {
        setError(res.mensaje || 'Error al iniciar sesión')
      }
    } catch (err) {
      console.error('Error de login:', err)
      setError('Error de comunicación con el servidor. Por favor, intenta más tarde.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className={styles.container}>
      <SEO titulo="Iniciar Sesión" descripcion="Inicia sesión en tu cuenta de Cabañas La Higuera Rapel para gestionar tus reservas." />
      <div className={styles.card}>
        <h2 className={styles.title}>Iniciar sesión</h2>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} required className={styles.input} />
          </div>
          <div className={styles.inputGroupPassword}>
            <div className={styles.passwordHeader}>
              <label className={styles.passwordLabel}>Contraseña</label>
              <Link to="/recuperar-password" className={styles.forgotLink}>¿Olvidaste tu contraseña?</Link>
            </div>
            <div className={styles.passwordWrapper}>
              <input type={mostrarPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form,password:e.target.value})} required className={styles.passwordInput} />
              <button type="button" onClick={() => setMostrarPassword(!mostrarPassword)} className={styles.showPasswordBtn}>
                {mostrarPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>
          <button type="submit" disabled={cargando} className={styles.submitBtn}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <p className={styles.footer}>
          ¿No tienes cuenta? <Link to="/registro" className={styles.registerLink}>Regístrate</Link>
        </p>
      </div>
    </div>
  )
}
