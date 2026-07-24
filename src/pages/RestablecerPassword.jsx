import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api'
import SEO from '../components/SEO'
import styles from './RestablecerPassword.module.css'

export default function RestablecerPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const id = searchParams.get('id')

  const [verificando, setVerificando] = useState(true)
  const [tokenValido, setTokenValido] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [cargandoSubmit, setCargandoSubmit] = useState(false)

  useEffect(() => {
    if (!token || !id) {
      setVerificando(false)
      setTokenValido(false)
      return
    }

    api.verificarTokenReset(id, token)
      .then(res => {
        if (res.ok) {
          setTokenValido(true)
        } else {
          setTokenValido(false)
        }
      })
      .catch(err => {
        console.error('Error al verificar token:', err)
        setTokenValido(false)
      })
      .finally(() => {
        setVerificando(false)
      })
  }, [id, token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setCargandoSubmit(true)
    setError('')
    setMsg('')

    try {
      const res = await api.restablecerPassword(id, token, password)
      if (res.ok) {
        setMsg('Tu contraseña ha sido restablecida con éxito. Ya puedes iniciar sesión.')
      } else {
        setError(res.mensaje || 'Error al restablecer la contraseña.')
      }
    } catch (err) {
      console.error('Error al restablecer password:', err)
      setError('Error de comunicación con el servidor. Por favor, intenta más tarde.')
    } finally {
      setCargandoSubmit(false)
    }
  }

  return (
    <div className={styles.container}>
      <SEO titulo="Restablecer Contraseña" descripcion="Establece una nueva contraseña para tu cuenta." />
      <div className={styles.card}>
        <h2 className={styles.title}>Nueva contraseña</h2>

        {verificando ? (
          <div className={styles.verificando}>
            <div className={`${styles.spinner} spinner`} />
            <span>Verificando enlace...</span>
          </div>
        ) : !tokenValido ? (
          <div className={styles.invalidTokenContainer}>
            <div className={styles.invalidTokenMsg}>
              ⚠️ El enlace de recuperación es inválido o ha expirado. Por favor, solicita uno nuevo.
            </div>
            <Link to="/recuperar-password" className={styles.primaryLink}>
              Solicitar nuevo enlace
            </Link>
          </div>
        ) : (
          <div>
            {error && <div className={styles.error}>{error}</div>}
            {msg && (
              <div className={styles.successContainer}>
                <div className={styles.successMsg}>
                  ✅ {msg}
                </div>
                <Link to="/login" className={styles.primaryLinkLarge}>
                  Iniciar sesión
                </Link>
              </div>
            )}

            {!msg && (
              <form onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nueva contraseña</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Mínimo 6 caracteres" className={styles.input} />
                </div>
                <div className={styles.inputGroupLast}>
                  <label className={styles.label}>Confirmar contraseña</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="Repite la contraseña" className={styles.input} />
                </div>
                <button type="submit" disabled={cargandoSubmit} className={styles.submitBtn}>
                  {cargandoSubmit ? 'Restableciendo...' : 'Restablecer contraseña'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
