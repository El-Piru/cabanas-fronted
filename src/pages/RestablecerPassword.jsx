import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api'

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
    <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'"Outfit", sans-serif'}}>
      <div style={{background:'#fff',borderRadius:'16px',padding:'2.5rem',width:'400px',boxShadow:'0 8px 40px rgba(0,0,0,0.06)',border:'1px solid #ECE8E4'}}>
        <h2 style={{textAlign:'center',marginBottom:'1.5rem',color:'#204C72',fontFamily:'"Outfit", sans-serif',fontWeight:'600'}}>Nueva contraseña</h2>

        {verificando ? (
          <div style={{textAlign:'center',padding:'2rem',color:'#7A8E7B'}}>
            <div className="spinner" style={{
              border: '3px solid rgba(43, 88, 128, 0.1)',
              borderTop: '3px solid #2B5880',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              margin: '0 auto 1rem',
              animation: 'spin 1s linear infinite'
            }} />
            <span>Verificando enlace...</span>
          </div>
        ) : !tokenValido ? (
          <div style={{textAlign:'center'}}>
            <div style={{background:'#FEE2E2',color:'#991B1B',padding:'15px',borderRadius:'8px',marginBottom:'1.5rem',fontSize:'0.9rem',lineHeight:'1.4'}}>
              ⚠️ El enlace de recuperación es inválido o ha expirado. Por favor, solicita uno nuevo.
            </div>
            <Link to="/recuperar-password" style={{background:'#2B5880',color:'#fff',padding:'10px 20px',borderRadius:'8px',textDecoration:'none',fontSize:'0.9rem',fontWeight:'600',display:'inline-block'}}>
              Solicitar nuevo enlace
            </Link>
          </div>
        ) : (
          <div>
            {error && <div style={{background:'#FEE2E2',color:'#991B1B',padding:'10px',borderRadius:'8px',marginBottom:'1rem',fontSize:'0.9rem'}}>{error}</div>}
            {msg && (
              <div style={{textAlign:'center'}}>
                <div style={{background:'#D1FAE5',color:'#065F46',padding:'15px',borderRadius:'8px',marginBottom:'1.5rem',fontSize:'0.95rem',lineHeight:'1.4'}}>
                  ✅ {msg}
                </div>
                <Link to="/login" style={{background:'#2B5880',color:'#fff',padding:'10px 24px',borderRadius:'8px',textDecoration:'none',fontSize:'0.95rem',fontWeight:'600',display:'inline-block'}}>
                  Iniciar sesión
                </Link>
              </div>
            )}

            {!msg && (
              <form onSubmit={handleSubmit}>
                <div style={{marginBottom:'1rem'}}>
                  <label style={{display:'block',marginBottom:'6px',fontSize:'0.9rem',fontWeight:'500',color:'#182535'}}>Nueva contraseña</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Mínimo 6 caracteres" style={{width:'100%',padding:'10px',border:'1.5px solid #E8E4DC',borderRadius:'8px',boxSizing:'border-box',fontFamily:'inherit'}} />
                </div>
                <div style={{marginBottom:'1.8rem'}}>
                  <label style={{display:'block',marginBottom:'6px',fontSize:'0.9rem',fontWeight:'500',color:'#182535'}}>Confirmar contraseña</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="Repite la contraseña" style={{width:'100%',padding:'10px',border:'1.5px solid #E8E4DC',borderRadius:'8px',boxSizing:'border-box',fontFamily:'inherit'}} />
                </div>
                <button type="submit" disabled={cargandoSubmit} style={{width:'100%',background:'#2B5880',color:'#fff',border:'none',padding:'12px',borderRadius:'8px',fontSize:'1rem',cursor:'pointer',fontWeight:'600',fontFamily:'inherit',transition:'background 0.2s ease'}}
                  onMouseEnter={e => e.currentTarget.style.background='#204C72'}
                  onMouseLeave={e => e.currentTarget.style.background='#2B5880'}
                >
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
