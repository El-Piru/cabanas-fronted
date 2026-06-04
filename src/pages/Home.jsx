import { useEffect, useState } from 'react'
import { api } from '../api'
import CabanaCard from '../components/CabanaCard'

export default function Home() {
  const [cabanas, setCabanas] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    api.getCabanas().then(res => {
      if (res.ok) setCabanas(res.data)
      setCargando(false)
    })
  }, [])

  return (
    <div>
      <div style={{background:'linear-gradient(135deg, #1A2E1B 0%, #2C4A2E 60%, #1A6B8A 100%)',padding:'4rem 1.5rem',textAlign:'center',color:'#fff'}}>
        <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(1.8rem, 5vw, 3rem)',marginBottom:'1rem',lineHeight:'1.2'}}>
          Cabañas La Higuera Rapel
        </h1>
        <p style={{fontSize:'clamp(1rem, 3vw, 1.25rem)',opacity:.85,marginBottom:'2rem'}}>
          Tu refugio perfecto a orillas del Lago Rapel
        </p>
        <div style={{display:'flex',justifyContent:'center',gap:'1rem',flexWrap:'wrap',fontSize:'clamp(0.85rem, 2.5vw, 1rem)',opacity:.9}}>
          <span>🚤 Paseos en lancha</span>
          <span>🚣 Kayak y botes</span>
          <span>🏊 Piscina</span>
          <span>🏄 Moto de agua</span>
        </div>
      </div>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'2rem 1rem'}}>
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(1.5rem, 4vw, 2rem)',color:'#1A2E1B',marginBottom:'0.5rem'}}>
            Nuestras Cabañas
          </h2>
          <p style={{color:'#7A8E7B',fontSize:'0.95rem'}}>
            Cabañas para 2, 4, 6 y 8 personas — todos los servicios incluidos
          </p>
        </div>

        {cargando ? (
          <div style={{textAlign:'center',padding:'3rem',color:'#7A8E7B'}}>Cargando cabañas...</div>
        ) : cabanas.length === 0 ? (
          <div style={{textAlign:'center',padding:'3rem',color:'#7A8E7B'}}>No hay cabañas disponibles.</div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1.5rem'}}>
            {cabanas.map(cabana => (
              <CabanaCard key={cabana.capacidad} cabana={cabana} />
            ))}
          </div>
        )}

        <div style={{marginTop:'3rem',background:'#2C4A2E',borderRadius:'16px',padding:'2rem 1.5rem',textAlign:'center',color:'#fff'}}>
          <h3 style={{fontFamily:'Georgia,serif',fontSize:'1.3rem',marginBottom:'0.75rem'}}>¿Tienes dudas?</h3>
          <p style={{opacity:.85,marginBottom:'1.5rem',fontSize:'0.95rem'}}>Contáctanos directamente y te ayudamos a elegir la cabaña perfecta</p>
          <div style={{display:'flex',justifyContent:'center',gap:'1rem',flexWrap:'wrap'}}>
            <a href="https://wa.me/56978996989" target="_blank" style={{background:'#25D366',color:'#fff',padding:'10px 20px',borderRadius:'8px',textDecoration:'none',fontWeight:'500'}}>
              💬 WhatsApp
            </a>
            <a href="mailto:juinzhy@gmail.com" style={{background:'rgba(255,255,255,0.15)',color:'#fff',padding:'10px 20px',borderRadius:'8px',textDecoration:'none',fontWeight:'500'}}>
              ✉️ Email
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
