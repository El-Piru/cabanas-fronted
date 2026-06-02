import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Reservar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cabana, setCabana] = useState(null)
  const [form, setForm] = useState({ llegada: '', salida: '' })
  const [noches, setNoches] = useState(0)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    api.getCabana(parseInt(id)).then(res => {
      if (res.ok) setCabana(res.data)
    })
  }, [id])

  useEffect(() => {
    if (form.llegada && form.salida) {
      const d1 = new Date(form.llegada)
      const d2 = new Date(form.salida)
      const n = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24))
      if (n > 0 && cabana) {
        setNoches(n)
        setTotal(n * cabana.precio)
      }
    }
  }, [form, cabana])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    const res = await api.crearReserva({
      cabanaId: parseInt(id),
      llegada: form.llegada,
      salida: form.salida
    })
    if (res.ok) {
      setExito(true)
    } else {
      setError(res.mensaje)
    }
    setCargando(false)
  }

  if (!cabana) return <div style={{textAlign:'center',padding:'3rem'}}>Cargando...</div>

  if (exito) return (
    <div style={{maxWidth:'500px',margin:'4rem auto',textAlign:'center',padding:'2rem'}}>
      <div style={{fontSize:'4rem',marginBottom:'1rem'}}>✅</div>
      <h2 style={{color:'#1A2E1B',marginBottom:'1rem'}}>Reserva confirmada</h2>
      <p style={{color:'#7A8E7B',marginBottom:'2rem'}}>{cabana.nombre} — {noches} noches — ${total.toLocaleString('es-CL')}</p>
      <button onClick={() => navigate('/mis-reservas')} style={{background:'#2C4A2E',color:'#fff',border:'none',padding:'12px 24px',borderRadius:'8px',cursor:'pointer',fontSize:'1rem'}}>
        Ver mis reservas
      </button>
    </div>
  )

  return (
    <div style={{maxWidth:'500px',margin:'2rem auto',padding:'0 1rem'}}>
      <h1 style={{fontFamily:'Georgia,serif',color:'#1A2E1B',marginBottom:'0.5rem'}}>Reservar</h1>
      <p style={{color:'#7A8E7B',marginBottom:'2rem'}}>{cabana.nombre} — ${cabana.precio.toLocaleString('es-CL')}/noche</p>

      {error && <div style={{background:'#FEE2E2',color:'#991B1B',padding:'10px',borderRadius:'8px',marginBottom:'1rem'}}>{error}</div>}

      <div style={{background:'#fff',borderRadius:'16px',padding:'2rem',boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'1rem'}}>
            <label style={{display:'block',marginBottom:'6px',fontWeight:'500'}}>Fecha de llegada</label>
            <input type="date" value={form.llegada} onChange={e => setForm({...form,llegada:e.target.value})} required min={new Date().toISOString().split('T')[0]} style={{width:'100%',padding:'10px',border:'1.5px solid #E8E4DC',borderRadius:'8px',boxSizing:'border-box'}} />
          </div>
          <div style={{marginBottom:'1.5rem'}}>
            <label style={{display:'block',marginBottom:'6px',fontWeight:'500'}}>Fecha de salida</label>
            <input type="date" value={form.salida} onChange={e => setForm({...form,salida:e.target.value})} required min={form.llegada} style={{width:'100%',padding:'10px',border:'1.5px solid #E8E4DC',borderRadius:'8px',boxSizing:'border-box'}} />
          </div>

          {noches > 0 && (
            <div style={{background:'#F5ECD7',borderRadius:'10px',padding:'1rem',marginBottom:'1.5rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px',fontSize:'0.9rem'}}>
                <span>{noches} noches × ${cabana.precio.toLocaleString('es-CL')}</span>
                <span>${total.toLocaleString('es-CL')}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontWeight:'600',borderTop:'1px solid #DDD5C4',paddingTop:'8px'}}>
                <span>Total</span>
                <span style={{color:'#18521c'}}>${total.toLocaleString('es-CL')}</span>
              </div>
            </div>
          )}

          <button type="submit" disabled={cargando || noches === 0} style={{width:'100%',background:noches > 0 ? '#2C4A2E' : '#ccc',color:'#fff',border:'none',padding:'12px',borderRadius:'8px',fontSize:'1rem',cursor:noches > 0 ? 'pointer' : 'not-allowed'}}>
            {cargando ? 'Confirmando...' : 'Confirmar reserva'}
          </button>
        </form>
      </div>
    </div>
  )
}