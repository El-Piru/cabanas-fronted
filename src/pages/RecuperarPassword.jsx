import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

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
    <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'"Outfit", sans-serif'}}>
      <div style={{background:'#fff',borderRadius:'16px',padding:'2.5rem',width:'400px',boxShadow:'0 8px 40px rgba(0,0,0,0.06)',border:'1px solid #ECE8E4'}}>
        <h2 style={{textAlign:'center',marginBottom:'1rem',color:'#204C72',fontFamily:'"Outfit", sans-serif',fontWeight:'600'}}>Recuperar contraseña</h2>
        <p style={{color:'#7A8E7B',fontSize:'0.88rem',textAlign:'center',marginBottom:'2rem',lineHeight:'1.4'}}>
          Ingresa tu dirección de correo electrónico y te enviaremos un enlace para que puedas volver a ingresar.
        </p>

        {error && <div style={{background:'#FEE2E2',color:'#991B1B',padding:'10px',borderRadius:'8px',marginBottom:'1rem',fontSize:'0.9rem'}}>{error}</div>}
        {msg && <div style={{background:'#D1FAE5',color:'#065F46',padding:'12px',borderRadius:'8px',marginBottom:'1rem',fontSize:'0.9rem',lineHeight:'1.4'}}>{msg}</div>}

        {!msg && (
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom:'1.8rem'}}>
              <label style={{display:'block',marginBottom:'6px',fontSize:'0.9rem',fontWeight:'500',color:'#182535'}}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="ejemplo@correo.com" style={{width:'100%',padding:'10px',border:'1.5px solid #E8E4DC',borderRadius:'8px',boxSizing:'border-box',fontFamily:'inherit'}} />
            </div>
            <button type="submit" disabled={cargando} style={{width:'100%',background:'#2B5880',color:'#fff',border:'none',padding:'12px',borderRadius:'8px',fontSize:'1rem',cursor:'pointer',fontWeight:'600',fontFamily:'inherit',transition:'background 0.2s ease'}}
              onMouseEnter={e => e.currentTarget.style.background='#204C72'}
              onMouseLeave={e => e.currentTarget.style.background='#2B5880'}
            >
              {cargando ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>
        )}

        <p style={{textAlign:'center',marginTop:'1.5rem',fontSize:'0.9rem'}}>
          <Link to="/login" style={{color:'#2B5880',textDecoration:'none',fontWeight:'600'}}>Volver al inicio de sesión</Link>
        </p>
      </div>
    </div>
  )
}
