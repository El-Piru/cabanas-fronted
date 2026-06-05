import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      const res = await api.login(form)
      if (res.ok) {
        localStorage.setItem('token', res.token)
        localStorage.setItem('usuario', JSON.stringify(res.usuario))
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
    <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'"Outfit", sans-serif'}}>
      <div style={{background:'#fff',borderRadius:'16px',padding:'2.5rem',width:'400px',boxShadow:'0 8px 40px rgba(0,0,0,0.06)',border:'1px solid #ECE8E4'}}>
        <h2 style={{textAlign:'center',marginBottom:'2rem',color:'#204C72',fontFamily:'"Outfit", sans-serif',fontWeight:'600'}}>Iniciar sesión</h2>
        {error && <div style={{background:'#FEE2E2',color:'#991B1B',padding:'10px',borderRadius:'8px',marginBottom:'1rem',fontSize:'0.9rem'}}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'1rem'}}>
            <label style={{display:'block',marginBottom:'6px',fontSize:'0.9rem',fontWeight:'500',color:'#182535'}}>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} required style={{width:'100%',padding:'10px',border:'1.5px solid #E8E4DC',borderRadius:'8px',boxSizing:'border-box',fontFamily:'inherit'}} />
          </div>
          <div style={{marginBottom:'1.8rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
              <label style={{margin:0,fontSize:'0.9rem',fontWeight:'500',color:'#182535'}}>Contraseña</label>
              <Link to="/recuperar-password" style={{color:'#407DAF',fontSize:'0.8rem',textDecoration:'none',fontWeight:'500'}}>¿Olvidaste tu contraseña?</Link>
            </div>
            <input type="password" value={form.password} onChange={e => setForm({...form,password:e.target.value})} required style={{width:'100%',padding:'10px',border:'1.5px solid #E8E4DC',borderRadius:'8px',boxSizing:'border-box',fontFamily:'inherit'}} />
          </div>
          <button type="submit" disabled={cargando} style={{width:'100%',background:'#2B5880',color:'#fff',border:'none',padding:'12px',borderRadius:'8px',fontSize:'1rem',cursor:'pointer',fontWeight:'600',fontFamily:'inherit',transition:'background 0.2s ease'}}
            onMouseEnter={e => e.currentTarget.style.background='#204C72'}
            onMouseLeave={e => e.currentTarget.style.background='#2B5880'}
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:'1.5rem',fontSize:'0.9rem',color:'#7A8E7B'}}>
          ¿No tienes cuenta? <Link to="/registro" style={{color:'#2B5880',textDecoration:'none',fontWeight:'600'}}>Regístrate</Link>
        </p>
      </div>
    </div>
  )
}
