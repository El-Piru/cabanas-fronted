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
    const res = await api.login(form)
    if (res.ok) {
      localStorage.setItem('token', res.token)
      localStorage.setItem('usuario', JSON.stringify(res.usuario))
      navigate('/')
    } else {
      setError(res.mensaje)
    }
    setCargando(false)
  }

  return (
    <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#fff',borderRadius:'16px',padding:'2.5rem',width:'400px',boxShadow:'0 8px 40px rgba(0,0,0,0.08)'}}>
        <h2 style={{textAlign:'center',marginBottom:'2rem',color:'#1A2E1B'}}>Iniciar sesion</h2>
        {error && <div style={{background:'#FEE2E2',color:'#991B1B',padding:'10px',borderRadius:'8px',marginBottom:'1rem'}}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'1rem'}}>
            <label style={{display:'block',marginBottom:'6px'}}>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} required style={{width:'100%',padding:'10px',border:'1.5px solid #E8E4DC',borderRadius:'8px',boxSizing:'border-box'}} />
          </div>
          <div style={{marginBottom:'1.5rem'}}>
            <label style={{display:'block',marginBottom:'6px'}}>Contrasena</label>
            <input type="password" value={form.password} onChange={e => setForm({...form,password:e.target.value})} required style={{width:'100%',padding:'10px',border:'1.5px solid #E8E4DC',borderRadius:'8px',boxSizing:'border-box'}} />
          </div>
          <button type="submit" disabled={cargando} style={{width:'100%',background:'#2C4A2E',color:'#fff',border:'none',padding:'12px',borderRadius:'8px',fontSize:'1rem',cursor:'pointer'}}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:'1.5rem'}}>
          No tienes cuenta? <Link to="/registro" style={{color:'#2C4A2E'}}>Registrate</Link>
        </p>
      </div>
    </div>
  )
}