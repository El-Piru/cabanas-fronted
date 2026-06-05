import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

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
  const [aceptaTerminos, setAceptaTerminos] = useState(false)

  useEffect(() => {
    const usuario = localStorage.getItem('usuario')
    if (!usuario) { navigate('/login'); return }
    
    api.getCabanaPorCapacidad(parseInt(id))
      .then(res => {
        if (res.ok && res.data) {
          setCabana(res.data)
        } else {
          if (res.mensaje === 'Token requerido' || res.mensaje === 'Token inválido') {
            localStorage.removeItem('usuario')
            navigate('/login')
          } else {
            setError(res.mensaje || 'La capacidad especificada no existe o no está disponible.')
          }
        }
      })
      .catch(err => {
        console.error(err)
        setError('Error de comunicación con el servidor')
      })

    api.getFechasOcupadas(parseInt(id))
      .then(res => {
        if (res.ok) setFechasOcupadas(res.data)
      })
      .catch(err => console.error('Error al obtener fechas ocupadas:', err))
  }, [id, navigate])

  const verificarSolapamiento = (llegada, salida) => {
    if (!llegada || !salida) return false
    const d1 = new Date(llegada + 'T12:00:00')
    const d2 = new Date(salida + 'T12:00:00')

    return fechasOcupadas.some(reserva => {
      const inicio = new Date(reserva.llegada.split('T')[0] + 'T12:00:00')
      const fin = new Date(reserva.salida.split('T')[0] + 'T12:00:00')
      // Lógica estricta de solapamiento de días enteros
      return d1 <= fin && d2 >= inicio
    })
  }

  useEffect(() => {
    if (form.llegada && form.salida) {
      const d1 = new Date(form.llegada + 'T12:00:00')
      const d2 = new Date(form.salida + 'T12:00:00')
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

  // Obtiene fechas incluyendo el día final (checkout)
  const obtenerFechasExcluidas = () => {
    const excluidas = []
    fechasOcupadas.forEach(reserva => {
      const llegadaStr = reserva.llegada.split('T')[0]
      const salidaStr = reserva.salida.split('T')[0]
      
      let actual = new Date(llegadaStr + 'T12:00:00')
      const fin = new Date(salidaStr + 'T12:00:00')
      
      // actual <= fin para incluir también el día de salida en los bloqueados
      while (actual <= fin) {
        excluidas.push(new Date(actual))
        actual.setDate(actual.getDate() + 1)
      }
    })
    return excluidas
  }

  const formatFecha = (fecha) => {
    if (!fecha) return ''
    return new Date(fecha + 'T12:00:00').toLocaleDateString('es-CL', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!aceptaTerminos) {
      setError('Debes aceptar los Términos y Condiciones y las Políticas de Cancelación para continuar.')
      return
    }
    if (verificarSolapamiento(form.llegada, form.salida)) {
      setError('La cabaña ya está reservada en esas fechas.')
      return
    }
    setCargando(true)
    setError('')
    try {
      const res = await api.crearReserva({
        capacidad: parseInt(id),
        llegada: form.llegada,
        salida: form.salida
      })
      if (res.ok) {
        if (res.initPoint) {
          window.location.href = res.initPoint
        } else {
          setError(res.mensaje || 'Se creó la reserva pero no se pudo generar el enlace de pago.')
        }
      } else {
        setError(res.mensaje)
      }
    } catch (err) {
      console.error('Error al crear reserva:', err)
      setError('Error de comunicación con el servidor. Por favor, intenta más tarde.')
    } finally {
      setCargando(false)
    }
  }

  if (error && !cabana) return (
    <div style={{textAlign:'center',padding:'4rem 1rem'}}>
      <div style={{fontSize:'3rem',marginBottom:'1rem'}}>⚠️</div>
      <h3 style={{color:'#991B1B',marginBottom:'0.5rem'}}>No pudimos cargar la cabaña</h3>
      <p style={{color:'#7A8E7B',marginBottom:'2rem'}}>{error}</p>
      <button onClick={() => navigate('/')} style={{background:'#C01C1C',color:'#fff',border:'none',padding:'10px 24px',borderRadius:'8px',cursor:'pointer'}}>
        Volver al inicio
      </button>
    </div>
  )

  if (!cabana) return <div style={{textAlign:'center',padding:'3rem'}}>Cargando...</div>

  if (exito) return (
    <div style={{maxWidth:'500px',margin:'4rem auto',textAlign:'center',padding:'2rem'}}>
      <div style={{fontSize:'4rem',marginBottom:'1rem'}}>✅</div>
      <h2 style={{color:'#1A2E1B',marginBottom:'0.5rem'}}>¡Reserva confirmada!</h2>
      <p style={{color:'#7A8E7B',marginBottom:'0.5rem'}}>Te enviaremos un correo con todos los detalles.</p>
      <p style={{color:'#7A8E7B',marginBottom:'2rem',fontSize:'0.9rem'}}>Para consultas: 📞 9 8669 8970</p>
      <div style={{background:'#fff',borderRadius:'12px',padding:'1.5rem',marginBottom:'2rem',textAlign:'left',border:'1px solid #E8E4DC',borderLeft:'4px solid #C01C1C',boxShadow:'0 4px 12px rgba(0,0,0,0.03)'}}>
        <p style={{margin:'0 0 8px'}}><strong>Detalles de tu estadía:</strong></p>
        <p style={{margin:'0 0 8px',color:'#3D4C5E'}}><strong>🏕️ Cabaña:</strong> {cabana.nombre}</p>
        <p style={{margin:'0 0 8px',color:'#3D4C5E'}}><strong>📅 Entrada:</strong> {formatFecha(form.llegada)} desde las 10:00 am</p>
        <p style={{margin:'0 0 8px',color:'#3D4C5E'}}><strong>📅 Salida:</strong> {formatFecha(form.salida)} hasta las 7:00 pm</p>
        <p style={{margin:'0 0 8px',color:'#3D4C5E'}}><strong>🌙 Noches:</strong> {noches}</p>
        <div style={{display:'flex',justifyContent:'space-between',fontWeight:'600',borderTop:'1px solid #ECE8E0',paddingTop:'10px',marginTop:'12px'}}>
          <span style={{color:'#182535'}}>Total</span>
          <span style={{color:'#C01C1C',fontSize:'1.15rem'}}>${total.toLocaleString('es-CL')}</span>
        </div>
      </div>
      <button onClick={() => navigate('/mis-reservas')} style={{background:'#C01C1C',color:'#fff',border:'none',padding:'12px 24px',borderRadius:'8px',cursor:'pointer',fontSize:'1rem'}}>
        Ver mis reservas
      </button>
    </div>
  )

  return (
    <div style={{maxWidth:'500px',margin:'2rem auto',padding:'0 1rem'}}>
      <h1 style={{fontFamily:'"Outfit",sans-serif',color:'#182535',marginBottom:'0.5rem'}}>Reservar</h1>
      <p style={{color:'#5A6A5C',marginBottom:'2rem'}}>{cabana.nombre} — ${cabana.precio.toLocaleString('es-CL')}/noche · {cabana.capacidad} personas</p>

      {error && <div style={{background:'#FEE2E2',color:'#991B1B',padding:'10px',borderRadius:'8px',marginBottom:'1rem'}}>{error}</div>}

      <div style={{background:'#fff',borderRadius:'16px',padding:'2rem',boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
        <div style={{marginBottom:'1rem'}}>
          <label style={{display:'block',marginBottom:'6px',fontWeight:'500'}}>Fecha de llegada</label>
          <DatePicker
            selected={form.llegada ? new Date(form.llegada + 'T12:00:00') : null}
            onChange={date => setForm({...form, llegada: date ? date.toISOString().split('T')[0] : '', salida: ''})}
            selectsStart
            startDate={form.llegada ? new Date(form.llegada + 'T12:00:00') : null}
            endDate={form.salida ? new Date(form.salida + 'T12:00:00') : null}
            minDate={new Date()}
            excludeDates={obtenerFechasExcluidas()}
            placeholderText="Selecciona fecha de llegada"
            dateFormat="dd/MM/yyyy"
            className="mi-datepicker"
            required
          />
          {form.llegada && <p style={{color:'#7A8E7B',fontSize:'0.85rem',margin:'4px 0 0'}}>Entrada desde las 10:00 am</p>}
        </div>
        <div style={{marginBottom:'1.5rem'}}>
          <label style={{display:'block',marginBottom:'6px',fontWeight:'500'}}>Fecha de salida</label>
          <DatePicker
            selected={form.salida ? new Date(form.salida + 'T12:00:00') : null}
            onChange={date => setForm({...form, salida: date ? date.toISOString().split('T')[0] : ''})}
            selectsEnd
            startDate={form.llegada ? new Date(form.llegada + 'T12:00:00') : null}
            endDate={form.salida ? new Date(form.salida + 'T12:00:00') : null}
            minDate={form.llegada ? new Date(form.llegada + 'T12:00:00') : new Date()}
            excludeDates={obtenerFechasExcluidas()}
            placeholderText="Selecciona fecha de salida"
            dateFormat="dd/MM/yyyy"
            className="mi-datepicker"
            required
            disabled={!form.llegada}
          />
          {form.salida && <p style={{color:'#7A8E7B',fontSize:'0.85rem',margin:'4px 0 0'}}>Salida hasta las 7:00 pm</p>}
        </div>

        {noches > 0 && (
          <div style={{background:'#FAF7F2',borderRadius:'10px',padding:'1.25rem',marginBottom:'1.5rem',border:'1px solid #E8E4DC'}}>
            <h4 style={{margin:'0 0 10px',color:'#1A2E1B',fontFamily:'Georgia,serif'}}>Resumen de tu reserva</h4>
            <p style={{margin:'0 0 6px',fontSize:'0.9rem',color:'#4A5E4C'}}>🏕️ {cabana.nombre}</p>
            <p style={{margin:'0 0 6px',fontSize:'0.9rem',color:'#4A5E4C'}}>📅 {formatFecha(form.llegada)} → {formatFecha(form.salida)}</p>
            <p style={{margin:'0 0 10px',fontSize:'0.9rem',color:'#4A5E4C'}}>🌙 {noches} {noches === 1 ? 'noche' : 'noches'}</p>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.9rem',marginBottom:'6px',color:'#7A8E7B'}}>
              <span>{noches} noches × ${cabana.precio.toLocaleString('es-CL')}</span>
              <span>${total.toLocaleString('es-CL')}</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',fontWeight:'600',borderTop:'1px solid #E8E4DC',paddingTop:'8px',marginTop:'8px'}}>
              <span>Total</span>
              <span style={{color:'#C01C1C'}}>${total.toLocaleString('es-CL')}</span>
            </div>
          </div>
        )}

        {noches > 0 && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '1.5rem', marginTop: '1rem', textAlign: 'left' }}>
            <input 
              type="checkbox" 
              id="terminos" 
              checked={aceptaTerminos} 
              onChange={(e) => setAceptaTerminos(e.target.checked)} 
              style={{ marginTop: '4px', cursor: 'pointer', width: '16px', height: '16px' }}
            />
            <label htmlFor="terminos" style={{ fontSize: '0.85rem', color: '#5A6A5C', cursor: 'pointer', lineHeight: '1.4' }}>
              Acepto los <a href="/terminos" target="_blank" rel="noopener noreferrer" style={{ color: '#C01C1C', textDecoration: 'underline', fontWeight: '500' }}>Términos y Condiciones</a> y las <a href="/terminos#politica-cancelacion" target="_blank" rel="noopener noreferrer" style={{ color: '#C01C1C', textDecoration: 'underline', fontWeight: '500' }}>Políticas de Cancelación</a> de Cabañas La Higuera.
            </label>
          </div>
        )}

        <button onClick={handleSubmit} disabled={cargando || noches === 0 || !aceptaTerminos} style={{width:'100%',background:(noches > 0 && aceptaTerminos) ? '#C01C1C' : '#ccc',color:'#fff',border:'none',padding:'12px',borderRadius:'8px',fontSize:'1rem',cursor:(noches > 0 && aceptaTerminos) ? 'pointer' : 'not-allowed',transition:'background 0.2s'}}>
          {cargando ? 'Confirmando...' : 'Confirmar reserva'}
        </button>
      </div>
      <style>{`
        .react-datepicker-wrapper {
          display: block !important;
          width: 100% !important;
        }
        .mi-datepicker {
          width: 100% !important;
          padding: 10px !important;
          border: 1.5px solid #E8E4DC !important;
          border-radius: 8px !important;
          box-sizing: border-box !important;
          font-size: 1rem !important;
          background: #fff !important;
          color: #182535 !important;
          outline: none !important;
        }
      `}</style>
    </div>
  )
}
