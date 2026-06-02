import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'

export default function Registro() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    const res = await api.registro(form)
    if (res.ok) {
      navigate('/login')
    } else {
      setError(res.mensaje)
    }
    setCargando(false)
  }

  return (
    <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#FAF7F2'}}>
      <div style={{background:'#fff',borderRadius:'16px',padding:'2.5rem',width:'100%',maxWidth:'400px',boxShadow:'0 8px 40px rgba(0,0,0,0.08)'}}>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'1.8rem',color:'#1A2E1B',marginBottom:'0.5rem',textAlign:'center'}}>
          Crear cuenta
        </h2>
        <p style={{color:'#7A8E7B',textAlign:'center',marginBottom:'2rem',fontSize:'0.9rem'}}>
          Unete a Cabanas del Bosque
        </p>

        {error && (
          <div style={{background:'#FEE2E2',color:'#991B1B',padding:'10px 14px',borderRadius:'8px',marginBottom:'1rem',fontSize:'0.9rem'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'1rem'}}>
            <label style={{display:'block',fontSize:'0.8rem',fontWeight:'500',color:'#4A5E4C',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'.04em'}}>
              Nombre completo
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={e => setForm({...form, nombre: e.target.value})}
              placeholder="Tu nombre"
              required
              style={{width:'100%',border:'1.5px solid #E8E4DC',borderRadius:'8px',padding:'10px 12px',fontSize:'0.9rem',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div style={{marginBottom:'1rem'}}>
            <label style={{display:'block',fontSize:'0.8rem',fontWeight:'500',color:'#4A5E4C',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'.04em'}}>
              Correo electronico
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              placeholder="tu@correo.cl"
              required
              style={{width:'100%',border:'1.5px solid #E8E4DC',borderRadius:'8px',padding:'10px 12px',fontSize:'0.9rem',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div style={{marginBottom:'1.5rem'}}>
            <label style={{display:'block',fontSize:'0.8rem',fontWeight:'500',color:'#4A5E4C',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'.04em'}}>
              Contrasena
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              placeholder="Minimo 6 caracteres"
              required
              style={{width:'100%',border:'1.5px solid #E8E4DC',borderRadius:'8px',padding:'10px 12px',fontSize:'0.9rem',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <button
            type="submit"
            disabled={cargando}
            style={{width:'100%',background:'#2C4A2E',color:'#fff',border:'none',padding:'12px',borderRadius:'8px',fontSize:'1rem',fontWeight:'500',cursor:'pointer'}}
          >
            {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p style={{textAlign:'center',marginTop:'1.5rem',fontSize:'0.9rem',color:'#7A8E7B'}}>
          Ya tienes cuenta?{' '}
          <Link to="/login" style={{color:'#2C4A2E',fontWeight:'500'}}>Inicia sesion</Link>
        </p>
      </div>
    </div>
  )
}