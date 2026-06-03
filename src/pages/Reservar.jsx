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
  const [fechasOcupadas, setFechasOcupadas] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    
    api.getCabana(parseInt(id)).then(res => {
      if (res.ok) setCabana(res.data)
    })

    api.getFechasOcupadas(parseInt(id)).then(res => {
      if (res.ok) setFechasOcupadas(res.data)
    })
  }, [id])

  const verificarSolapamiento = (llegada, salida) => {
    if (!llegada || !salida) return false
    const d1 = new Date(llegada)
    const d2 = new Date(salida)

    return fechasOcupadas.some(reserva => {
      const inicio = new Date(reserva.llegada)
      const fin = new Date(reserva.salida)
      return d1 < fin && d2 > inicio
    })
  }

  useEffect(() => {
    if (form.llegada && form.salida) {
      const d1 = new Date(form.llegada)
      const d2 = new Date(form.salida)
      const n = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24))
      
      if (n <= 0) {
        setNoches(0)
        setTotal(0)
        setError('La fecha de salida debe ser posterior a la de llegada')
      } else if (verificarSolapamiento(form.llegada, form.salida)) {
        setNoches(0)
        setTotal(0)
        setError('La cabaña ya está reservada en esas fechas. Por favor elige otra.')
      } else {
        setNoches(n)
        setTotal(n * cabana.precio)
        setError('')
      }
    }
  }, [form, cabana, fechasOcupadas])

  const formatFecha = (fecha) => {
    if (!fecha) return ''
    return new Date(fecha + 'T12:00:00').toLocaleDateString('es-CL', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (verificarSolapamiento(form.llegada, form.salida)) {
      setError('La cabaña ya está reservada en esas fechas.')
      return
    }
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
      <h2 style={{color:'#1A2E1B',marginBottom:'0.5rem'}}>¡Reserva confirmada!</h2>
      <p style={{color:'#7A8E7B',marginBottom:'0.5rem'}}>Te enviaremos un correo con todos los detalles.</p>
      <p style={{color:'#7A8E7B',marginBottom:'2rem',fontSize:'0.9rem'}}>Para consultas: 📞 9 8669 8970</p>
      <div style={{background:'#F5ECD7',borderRadius:'12px',padding:'1.5rem',marginBottom:'2rem',textAlign:'left'}}>
        <p style={{margin:'0 0 8px'}}><strong>🏕️ Cabaña:</strong> {cabana.nombre}</p>
        <p style={{margin:'0 0 8px'}}><strong>📅 Entrada:</strong> {formatFecha(form.llegada)} desde las 10:00 am</p>
        <p style={{margin:'0 0 8px'}}><strong>📅 Salida:</strong> {formatFecha(form.salida)} hasta las 7:00 pm</p>
        <p style={{margin:'0 0 8px'}}><strong>🌙 Noches:</strong> {noches}</p>
        <p style={{margin:'0'}}><strong>💰 Total:</strong> ${total.toLocaleString('es-CL')}</p>
      </div>
      <button onClick={() => navigate('/mis-reservas')} style={{background:'#2C4A2E',color:'#fff',border:'none',padding:'12px 24px',borderRadius:'8px',cursor:'pointer',fontSize:'1rem'}}>
        Ver mis reservas
      </button>
    </div>
  )

  return (
    <div style={{maxWidth:'500px',margin:'2rem auto',padding:'0 1rem'}}>
      <h1 style={{fontFamily:'Georgia,serif',color:'#1A2E1B',marginBottom:'0.5rem'}}>Reservar</h1>
      <p style={{color:'#7A8E7B',marginBottom:'2rem'}}>{cabana.nombre} — ${cabana.precio.toLocaleString('es-CL')}/noche · {cabana.capacidad} personas</p>

      {error && <div style={{background:'#FEE2E2',color:'#991B1B',padding:'10px',borderRadius:'8px',marginBottom:'1rem'}}>{error}</div>}

      <div style={{background:'#fff',borderRadius:'16px',padding:'2rem',boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
        <div style={{marginBottom:'1rem'}}>
          <label style={{display:'block',marginBottom:'6px',fontWeight:'500'}}>Fecha de llegada</label>
          <input type="date" value={form.llegada} onChange={e => setForm({...form,llegada:e.target.value})} required min={new Date().toISOString().split('T')[0]} style={{width:'100%',padding:'10px',border:'1.5px solid #E8E4DC',borderRadius:'8px',boxSizing:'border-box'}} />
          {form.llegada && <p style={{color:'#7A8E7B',fontSize:'0.85rem',margin:'4px 0 0'}}>Entrada desde las 10:00 am</p>}
        </div>
        <div style={{marginBottom:'1.5rem'}}>
          <label style={{display:'block',marginBottom:'6px',fontWeight:'500'}}>Fecha de salida</label>
          <input type="date" value={form.salida} onChange={e => setForm({...form,salida:e.target.value})} required min={form.llegada} style={{width:'100%',padding:'10px',border:'1.5px solid #E8E4DC',borderRadius:'8px',boxSizing:'border-box'}} />
          {form.salida && <p style={{color:'#7A8E7B',fontSize:'0.85rem',margin:'4px 0 0'}}>Salida hasta las 7:00 pm</p>}
        </div>

        {noches > 0 && (
          <div style={{background:'#F5ECD7',borderRadius:'10px',padding:'1rem',marginBottom:'1.5rem'}}>
            <h4 style={{margin:'0 0 10px',color:'#1A2E1B'}}>Resumen de tu reserva</h4>
            <p style={{margin:'0 0 6px',fontSize:'0.9rem'}}>🏕️ {cabana.nombre}</p>
            <p style={{margin:'0 0 6px',fontSize:'0.9rem'}}>📅 {formatFecha(form.llegada)} → {formatFecha(form.salida)}</p>
            <p style={{margin:'0 0 6px',fontSize:'0.9rem'}}>🌙 {noches} {noches === 1 ? 'noche' : 'noches'}</p>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.9rem',marginBottom:'6px'}}>
              <span>{noches} noches × ${cabana.precio.toLocaleString('es-CL')}</span>
              <span>${total.toLocaleString('es-CL')}</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',fontWeight:'600',borderTop:'1px solid #DDD5C4',paddingTop:'8px'}}>
              <span>Total</span>
              <span style={{color:'#2C4A2E'}}>${total.toLocaleString('es-CL')}</span>
            </div>
          </div>
        )}

        <button onClick={handleSubmit} disabled={cargando || noches === 0} style={{width:'100%',background:noches > 0 ? '#2C4A2E' : '#ccc',color:'#fff',border:'none',padding:'12px',borderRadius:'8px',fontSize:'1rem',cursor:noches > 0 ? 'pointer' : 'not-allowed'}}>
          {cargando ? 'Confirmando...' : 'Confirmar reserva'}
        </button>
      </div>
    </div>
  )
}
