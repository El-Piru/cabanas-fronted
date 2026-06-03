import { useNavigate } from 'react-router-dom'

export default function CabanaCard({ cabana }) {
  const navigate = useNavigate()

  return (
    <div style={{background:'#fff',borderRadius:'12px',overflow:'hidden',border:'1px solid #ECE8E0',cursor:'pointer'}}
      onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
    >
      <div style={{height:'180px', background:'#FAF7F2', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', position:'relative'}}>
        {cabana.imagen ? (
          <img
            src={cabana.imagen}
            alt={cabana.nombre}
            style={{width:'100%', height:'100%', objectFit:'cover'}}
            onError={(e) => {
              e.target.style.display = 'none'
              const fallback = e.target.parentElement.querySelector('.card-fallback')
              if (fallback) fallback.style.display = 'flex'
            }}
          />
        ) : null}
        <div className="card-fallback" style={{
          display: cabana.imagen ? 'none' : 'flex',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg,#3D6B40,#6B9E55)',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '4rem'
        }}>
          🌲
        </div>
      </div>
      <div style={{padding:'1.25rem'}}>
        <h3 style={{margin:'0 0 4px',color:'#1A2E1B'}}>{cabana.nombre}</h3>
        <p style={{fontSize:'0.85rem',color:'#7A8E7B',margin:'0 0 .75rem'}}>{cabana.descripcion}</p>
        <div style={{display:'flex',gap:'1rem',marginBottom:'1rem',fontSize:'0.8rem',color:'#4A5E4C'}}>
          <span>Capacidad: {cabana.capacidad} personas</span>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',borderTop:'1px solid #F0EBE2',paddingTop:'.75rem'}}>
          <span style={{fontSize:'1.2rem',fontWeight:'500',color:'#2C4A2E'}}>
            ${cabana.precio.toLocaleString('es-CL')}
            <small style={{fontSize:'0.8rem',color:'#7A8E7B'}}>/noche</small>
          </span>
          <button
            onClick={() => navigate(`/reservar/${cabana.capacidad}`)}
            style={{background:'#2C4A2E',color:'#fff',border:'none',padding:'8px 16px',borderRadius:'6px',cursor:'pointer',fontWeight:'500'}}
          >
            Reservar
          </button>
        </div>
      </div>
    </div>
  )
}