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
    <div style={{maxWidth:'1100px',margin:'0 auto',padding:'2rem'}}>
      <div style={{textAlign:'center',marginBottom:'3rem'}}>
        <h1 style={{fontFamily:'Georgia,serif',fontSize:'2.5rem',color:'#1A2E1B',marginBottom:'1rem'}}>
          Nuestras Cabanas
        </h1>
        <p style={{color:'#7A8E7B',fontSize:'1.1rem'}}>
          Encuentra tu refugio perfecto en la naturaleza
        </p>
      </div>

      {cargando ? (
        <div style={{textAlign:'center',padding:'3rem',color:'#7A8E7B'}}>
          Cargando cabanas...
        </div>
      ) : cabanas.length === 0 ? (
        <div style={{textAlign:'center',padding:'3rem',color:'#7A8E7B'}}>
          No hay cabanas disponibles por el momento.
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'1.5rem'}}>
          {cabanas.map(cabana => (
            <CabanaCard key={cabana.id} cabana={cabana} />
          ))}
        </div>
      )}
    </div>
  )
}