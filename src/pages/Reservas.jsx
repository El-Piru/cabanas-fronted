import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Reservas() {
  const navigate = useNavigate()
  const [reservas, setReservas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [procesandoPago, setProcesandoPago] = useState(null)

  useEffect(() => {
    const usuario = localStorage.getItem('usuario')
    if (!usuario) { navigate('/login'); return }
    api.misReservas().then(res => {
      if (res.ok) setReservas(res.data)
      setCargando(false)
    })
  }, [navigate])

  const handlePagar = async (id) => {
    setProcesandoPago(id)
    try {
      const res = await api.pagarReserva(id)
      if (res.ok && res.initPoint) {
        window.location.href = res.initPoint
      } else {
        alert(res.mensaje || 'Error al generar el portal de pago de Mercado Pago')
      }
    } catch (err) {
      console.error(err)
      alert('Error de conexión con el servidor')
    } finally {
      setProcesandoPago(null)
    }
  }

  const getInsigniaEstado = (estado) => {
    let background = '#FEF3C7', color = '#92400E' // Pendiente (Amarillo)
    if (estado === 'confirmada') {
      background = '#D1FAE5'; color = '#065F46' // Confirmado (Verde)
    } else if (estado === 'cancelada') {
      background = '#FEE2E2'; color = '#991B1B' // Cancelado (Rojo)
    }
    return (
      <span style={{background, color, padding:'4px 12px', borderRadius:'20px', fontSize:'0.8rem', fontWeight:'500', textTransform:'capitalize'}}>
        {estado}
      </span>
    )
  }

  return (
    <div style={{maxWidth:'800px',margin:'0 auto',padding:'2rem'}}>
      <h1 style={{fontFamily:'Georgia,serif',fontSize:'2rem',color:'#1A2E1B',marginBottom:'2rem'}}>
        Mis Reservas
      </h1>

      {cargando ? (
        <p style={{color:'#7A8E7B'}}>Cargando...</p>
      ) : reservas.length === 0 ? (
        <div style={{textAlign:'center',padding:'3rem',background:'#fff',borderRadius:'12px',border:'1px solid #ECE8E0'}}>
          <p style={{color:'#7A8E7B',marginBottom:'1rem'}}>No tienes reservas aun</p>
          <button
            onClick={() => navigate('/')}
            style={{background:'#2C4A2E',color:'#fff',border:'none',padding:'10px 24px',borderRadius:'8px',cursor:'pointer'}}
          >
            Ver cabañas
          </button>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          {reservas.map(r => (
            <div key={r.id} style={{background:'#fff',borderRadius:'12px',padding:'1.5rem',border:'1px solid #ECE8E0'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div>
                  <h3 style={{margin:'0 0 4px',color:'#1A2E1B'}}>{r.cabana.nombre}</h3>
                  <p style={{fontSize:'0.85rem',color:'#7A8E7B',margin:'0 0 .75rem'}}>
                    {new Date(r.llegada).toLocaleDateString('es-CL')} → {new Date(r.salida).toLocaleDateString('es-CL')}
                  </p>
                </div>
                {getInsigniaEstado(r.estado)}
              </div>
              <div style={{borderTop:'1px solid #F0EBE2',paddingTop:'.75rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <span style={{fontSize:'0.85rem',color:'#4A5E4C'}}>
                    {r.estado === 'confirmada' ? 'Total pagado' : 'Total a pagar'}
                  </span>
                  <span style={{fontWeight:'600',color:'#2C4A2E',marginLeft:'8px'}}>${r.total.toLocaleString('es-CL')}</span>
                </div>
                
                {r.estado === 'pendiente' && (
                  <button
                    onClick={() => handlePagar(r.id)}
                    disabled={procesandoPago === r.id}
                    style={{background:'#C8860A',color:'#fff',border:'none',padding:'8px 16px',borderRadius:'6px',cursor:'pointer',fontSize:'0.85rem',fontWeight:'500'}}
                  >
                    {procesandoPago === r.id ? 'Cargando pago...' : 'Pagar ahora 💳'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
