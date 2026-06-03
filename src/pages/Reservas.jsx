import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Reservas() {
  const navigate = useNavigate()
  const [reservas, setReservas] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const usuario = localStorage.getItem('usuario')
    if (!usuario) { navigate('/login'); return }
    api.misReservas().then(res => {
      if (res.ok) setReservas(res.data)
      setCargando(false)
    })
  }, [])

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
            Ver cabanas
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
                <span style={{background: r.estado === 'confirmada' ? '#D1FAE5' : '#FEE2E2',color: r.estado === 'confirmada' ? '#065F46' : '#991B1B',padding:'4px 12px',borderRadius:'20px',fontSize:'0.8rem',fontWeight:'500'}}>
                  {r.estado}
                </span>
              </div>
              <div style={{borderTop:'1px solid #F0EBE2',paddingTop:'.75rem',display:'flex',justifyContent:'space-between'}}>
                <span style={{fontSize:'0.85rem',color:'#4A5E4C'}}>Total pagado</span>
                <span style={{fontWeight:'500',color:'#2C4A2E'}}>${r.total.toLocaleString('es-CL')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}