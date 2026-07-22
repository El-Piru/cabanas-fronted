import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DETALLES_POR_CAPACIDAD = {
  2: {
    dormitorios: "2 dormitorios (1 Cama matrimonial)",
    banos: "1 baño",
    servicios: "Calefacción eléctrica, TV Smart (Netflix), acceso a piscina y tobogán, estacionamiento"
  },
  4: {
    dormitorios: "2 dormitorios (1 Cama matrimonial y 2 Camas bajas)",
    banos: "1 baño",
    servicios: "TV por cable, calefacción, acceso a piscina y tobogán, kayaks, estacionamiento"
  },
  6: {
    dormitorios: "2 dormitorios (1 Cama matrimonial y 2 Camarotes)",
    banos: "1 baño",
    servicios: "Calefacción a leña (bosca), TV satelital, acceso a piscina y tobogán, botes de remo, estacionamiento para 2 vehículos"
  },
  8: {
    dormitorios: "3 dormitorios (1 Cama matrimonial, 2 Camarotes y 2 Camas bajas)",
    banos: "1 baño",
    servicios: "Chimenea de leña, Smart TV de 50\", acceso a piscina y tobogán, kayaks, estacionamiento"
  },
  10: {
    dormitorios: "3 dormitorios (1 Cama matrimonial en una habitación, 2 Camarotes en la segunda y 2 Camarotes en la tercera)",
    banos: "1 baño",
    servicios: "Calefacción por pellet, Smart TV, acceso completo a paseos en lancha, kayaks, piscina, tobogán y muelle privado, estacionamiento para 3 vehículos"
  }
}

// Genera un vector SVG minimalista y animado de cabaña rectangular según la capacidad
const renderAnimatedCabin = (capacidad, isHovered) => {
  // Palette matching the brand red and nature theme
  const roofColor = '#C01C1C' // Brand red
  const wallColor = '#9A7E65' // Warm clean wood tone
  const wallColorLight = '#B59C85' // Wood line highlights
  const groundColor = '#8A7865' // Deep soil
  const doorColor = '#533B27' // Dark wood door
  const treeColor = '#416347' // Forest green pine trees
  const treeColorLight = '#537A5A' // Highlight tree
  const hillColor = '#E3DFD5' // Warm sand hills in background
  const windowOffColor = '#2D3748' // Dark window
  const windowOnColor = '#FBBF24' // Warm yellow window
  
  const windowColor = isHovered ? windowOnColor : windowOffColor;

  const smokeStyle = `
    @keyframes floatSmoke1 {
      0% { transform: translateY(0) scale(0.8); opacity: 0; }
      10% { opacity: 0.6; }
      90% { opacity: 0; }
      100% { transform: translateY(-35px) scale(1.5); opacity: 0; }
    }
    @keyframes floatSmoke2 {
      0% { transform: translateY(0) scale(0.6); opacity: 0; }
      10% { opacity: 0.5; }
      90% { opacity: 0; }
      100% { transform: translateY(-45px) scale(1.8); opacity: 0; }
    }
    .smoke-p1-${capacidad} { animation: floatSmoke1 3s infinite linear; transform-origin: 140px 65px; }
    .smoke-p2-${capacidad} { animation: floatSmoke2 3s infinite linear 1.5s; transform-origin: 140px 65px; }
    .cabin-win { transition: fill 0.3s ease; }
  `;

  if (capacidad === 2) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" style={{maxHeight:'100%',maxWidth:'100%'}}>
        <style>{smokeStyle}</style>
        {/* Sky */}
        <rect width="200" height="150" fill="#FAF8F5" />
        
        {/* Soft Background Hills */}
        <path d="M-10,130 C40,105 80,110 130,130 T210,130" fill={hillColor} opacity="0.6" />
        <path d="M30,130 C90,115 120,115 180,130" fill="#EBE7DE" opacity="0.8" />

        {/* Pine Trees behind cabin */}
        <polygon points="25,130 45,130 35,80" fill={treeColor} />
        <polygon points="155,130 180,130 167.5,70" fill={treeColor} />
        <polygon points="165,130 185,130 175,85" fill={treeColorLight} opacity="0.9" />

        {/* Smoke */}
        <circle cx="140" cy="65" r="4" fill="#B8B2A7" className={`smoke-p1-${capacidad}`} />
        <circle cx="140" cy="65" r="5" fill="#B8B2A7" className={`smoke-p2-${capacidad}`} />
        
        {/* Chimney */}
        <rect x="136" y="70" width="8" height="20" fill="#2D3748" rx="1" />
        
        {/* Cabin Walls */}
        <rect x="60" y="85" width="80" height="45" fill={wallColor} rx="3" />
        <line x1="60" y1="95" x2="140" y2="95" stroke={wallColorLight} strokeWidth="2" />
        <line x1="60" y1="107" x2="140" y2="107" stroke={wallColorLight} strokeWidth="2" />
        <line x1="60" y1="119" x2="140" y2="119" stroke={wallColorLight} strokeWidth="2" />
        
        {/* Roof */}
        <polygon points="50,85 150,85 100,50" fill={roofColor} />
        <polygon points="50,85 150,85 100,54" fill="#991B1B" opacity="0.2" /> {/* Roof shade */}

        {/* Door */}
        <rect x="72" y="98" width="16" height="32" fill={doorColor} rx="1" />
        <circle cx="84" cy="114" r="1.5" fill="#FCD34D" />
        
        {/* Window */}
        <circle cx="112" cy="106" r="10" fill={windowColor} className="cabin-win" stroke="#2D3748" strokeWidth="2" />
        <line x1="102" y1="106" x2="122" y2="106" stroke="#2D3748" strokeWidth="1" />
        <line x1="112" y1="96" x2="112" y2="116" stroke="#2D3748" strokeWidth="1" />
        
        {/* Ground */}
        <rect x="15" y="130" width="170" height="4" fill={groundColor} rx="2" />
      </svg>
    );
  } else if (capacidad === 4) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" style={{maxHeight:'100%',maxWidth:'100%'}}>
        <style>{smokeStyle}</style>
        <rect width="200" height="150" fill="#FAF8F5" />
        
        <path d="M-10,130 C40,105 80,110 130,130 T210,130" fill={hillColor} opacity="0.6" />
        <path d="M30,130 C90,115 120,115 180,130" fill="#EBE7DE" opacity="0.8" />

        <polygon points="20,130 42,130 31,75" fill={treeColor} />
        <polygon points="150,130 172,130 161,72" fill={treeColor} />
        <polygon points="160,130 182,130 171,82" fill={treeColorLight} opacity="0.9" />

        <circle cx="140" cy="60" r="4" fill="#B8B2A7" className={`smoke-p1-${capacidad}`} />
        <circle cx="140" cy="60" r="5" fill="#B8B2A7" className={`smoke-p2-${capacidad}`} />
        <rect x="136" y="64" width="8" height="20" fill="#2D3748" rx="1" />
        
        <rect x="55" y="80" width="90" height="50" fill={wallColor} rx="3" />
        <line x1="55" y1="90" x2="145" y2="90" stroke={wallColorLight} strokeWidth="2" />
        <line x1="55" y1="102" x2="145" y2="102" stroke={wallColorLight} strokeWidth="2" />
        <line x1="55" y1="114" x2="145" y2="114" stroke={wallColorLight} strokeWidth="2" />
        
        <polygon points="45,80 155,80 100,45" fill={roofColor} />
        <polygon points="45,80 155,80 100,49" fill="#991B1B" opacity="0.2" />

        <rect x="68" y="93" width="18" height="37" fill={doorColor} rx="1" />
        <circle cx="81" cy="111" r="1.5" fill="#FCD34D" />
        
        <rect x="102" y="93" width="22" height="22" fill={windowColor} className="cabin-win" rx="2" stroke="#2D3748" strokeWidth="2" />
        <line x1="113" y1="93" x2="113" y2="115" stroke="#2D3748" strokeWidth="1" />
        <line x1="102" y1="104" x2="124" y2="104" stroke="#2D3748" strokeWidth="1" />
        
        <rect x="15" y="130" width="170" height="4" fill={groundColor} rx="2" />
      </svg>
    );
  } else if (capacidad === 6) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" style={{maxHeight:'100%',maxWidth:'100%'}}>
        <style>{smokeStyle}</style>
        <rect width="200" height="150" fill="#FAF8F5" />
        
        <path d="M-10,130 C40,105 80,110 130,130 T210,130" fill={hillColor} opacity="0.6" />
        <path d="M30,130 C90,115 120,115 180,130" fill="#EBE7DE" opacity="0.8" />

        <polygon points="15,130 38,130 26.5,70" fill={treeColor} />
        <polygon points="160,130 182,130 171,70" fill={treeColor} />
        <polygon points="170,130 192,130 181,80" fill={treeColorLight} opacity="0.9" />

        <circle cx="150" cy="55" r="4" fill="#B8B2A7" className={`smoke-p1-${capacidad}`} />
        <circle cx="150" cy="55" r="5" fill="#B8B2A7" className={`smoke-p2-${capacidad}`} />
        <rect x="146" y="59" width="8" height="20" fill="#2D3748" rx="1" />
        
        <rect x="45" y="75" width="110" height="55" fill={wallColor} rx="3" />
        <line x1="45" y1="85" x2="155" y2="85" stroke={wallColorLight} strokeWidth="2" />
        <line x1="45" y1="97" x2="155" y2="97" stroke={wallColorLight} strokeWidth="2" />
        <line x1="45" y1="109" x2="155" y2="109" stroke={wallColorLight} strokeWidth="2" />
        
        <polygon points="35,75 165,75 100,40" fill={roofColor} />
        <polygon points="35,75 165,75 100,44" fill="#991B1B" opacity="0.2" />

        <rect x="91" y="88" width="18" height="42" fill={doorColor} rx="1" />
        <circle cx="104" cy="109" r="1.5" fill="#FCD34D" />
        
        <rect x="58" y="92" width="20" height="20" fill={windowColor} className="cabin-win" rx="2" stroke="#2D3748" strokeWidth="2" />
        <line x1="68" y1="92" x2="68" y2="112" stroke="#2D3748" strokeWidth="1" />
        <line x1="58" y1="102" x2="78" y2="102" stroke="#2D3748" strokeWidth="1" />
        
        <rect x="122" y="92" width="20" height="20" fill={windowColor} className="cabin-win" rx="2" stroke="#2D3748" strokeWidth="2" />
        <line x1="132" y1="92" x2="132" y2="112" stroke="#2D3748" strokeWidth="1" />
        <line x1="122" y1="102" x2="142" y2="102" stroke="#2D3748" strokeWidth="1" />
        
        <rect x="15" y="130" width="170" height="4" fill={groundColor} rx="2" />
      </svg>
    );
  } else if (capacidad === 8) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" style={{maxHeight:'100%',maxWidth:'100%'}}>
        <style>{smokeStyle}</style>
        <rect width="200" height="150" fill="#FAF8F5" />
        
        <path d="M-10,130 C40,105 80,110 130,130 T210,130" fill={hillColor} opacity="0.6" />
        <path d="M30,130 C90,115 120,115 180,130" fill="#EBE7DE" opacity="0.8" />

        <polygon points="18,130 40,130 29,68" fill={treeColor} />
        <polygon points="152,130 174,130 163,65" fill={treeColor} />
        <polygon points="162,130 184,130 173,78" fill={treeColorLight} opacity="0.9" />

        <circle cx="140" cy="45" r="4" fill="#B8B2A7" className={`smoke-p1-${capacidad}`} />
        <circle cx="140" cy="45" r="5" fill="#B8B2A7" className={`smoke-p2-${capacidad}`} />
        <rect x="136" y="49" width="8" height="20" fill="#2D3748" rx="1" />
        
        <rect x="55" y="65" width="90" height="65" fill={wallColor} rx="3" />
        <line x1="55" y1="75" x2="145" y2="75" stroke={wallColorLight} strokeWidth="2" />
        <line x1="55" y1="87" x2="145" y2="87" stroke={wallColorLight} strokeWidth="2" />
        <line x1="55" y1="99" x2="145" y2="99" stroke={wallColorLight} strokeWidth="2" />
        <line x1="55" y1="111" x2="145" y2="111" stroke={wallColorLight} strokeWidth="2" />
        
        <polygon points="45,65 155,65 100,28" fill={roofColor} />
        <polygon points="45,65 155,65 100,32" fill="#991B1B" opacity="0.2" />

        <rect x="68" y="90" width="18" height="40" fill={doorColor} rx="1" />
        <circle cx="81" cy="110" r="1.5" fill="#FCD34D" />
        
        <rect x="102" y="98" width="22" height="22" fill={windowColor} className="cabin-win" rx="2" stroke="#2D3748" strokeWidth="2" />
        <line x1="113" y1="98" x2="113" y2="120" stroke="#2D3748" strokeWidth="1" />
        <line x1="102" y1="109" x2="124" y2="109" stroke="#2D3748" strokeWidth="1" />
        
        <rect x="89" y="72" width="22" height="15" fill={windowColor} className="cabin-win" rx="2" stroke="#2D3748" strokeWidth="2" />
        <line x1="100" y1="72" x2="100" y2="87" stroke="#2D3748" strokeWidth="1" />
        
        <rect x="15" y="130" width="170" height="4" fill={groundColor} rx="2" />
      </svg>
    );
  } else {
    // 10 personas
    return (
      <svg width="100%" height="100%" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" style={{maxHeight:'100%',maxWidth:'100%'}}>
        <style>{smokeStyle}</style>
        <rect width="200" height="150" fill="#FAF8F5" />
        
        <path d="M-10,130 C40,105 80,110 130,130 T210,130" fill={hillColor} opacity="0.6" />
        <path d="M30,130 C90,115 120,115 180,130" fill="#EBE7DE" opacity="0.8" />

        <polygon points="12,130 35,130 23.5,62" fill={treeColor} />
        <polygon points="160,130 182,130 171,60" fill={treeColor} />
        <polygon points="170,130 192,130 181,72" fill={treeColorLight} opacity="0.9" />

        <circle cx="150" cy="40" r="4" fill="#B8B2A7" className={`smoke-p1-${capacidad}`} />
        <circle cx="150" cy="40" r="5" fill="#B8B2A7" className={`smoke-p2-${capacidad}`} />
        <rect x="146" y="44" width="8" height="20" fill="#2D3748" rx="1" />
        
        <rect x="45" y="60" width="110" height="70" fill={wallColor} rx="3" />
        <line x1="45" y1="70" x2="155" y2="70" stroke={wallColorLight} strokeWidth="2" />
        <line x1="45" y1="82" x2="155" y2="82" stroke={wallColorLight} strokeWidth="2" />
        <line x1="45" y1="94" x2="155" y2="94" stroke={wallColorLight} strokeWidth="2" />
        <line x1="45" y1="106" x2="155" y2="106" stroke={wallColorLight} strokeWidth="2" />
        <line x1="45" y1="118" x2="155" y2="118" stroke={wallColorLight} strokeWidth="2" />
        
        <polygon points="35,60 165,60 100,22" fill={roofColor} />
        <polygon points="35,60 165,60 100,26" fill="#991B1B" opacity="0.2" />

        <rect x="91" y="88" width="18" height="42" fill={doorColor} rx="1" />
        <circle cx="104" cy="109" r="1.5" fill="#FCD34D" />
        
        <rect x="58" y="96" width="20" height="20" fill={windowColor} className="cabin-win" rx="2" stroke="#2D3748" strokeWidth="2" />
        <line x1="70" y1="96" x2="70" y2="116" stroke="#2D3748" strokeWidth="1" />
        <line x1="58" y1="106" x2="80" y2="106" stroke="#2D3748" strokeWidth="1" />
        
        <rect x="122" y="96" width="20" height="20" fill={windowColor} className="cabin-win" rx="2" stroke="#2D3748" strokeWidth="2" />
        <line x1="132" y1="96" x2="132" y2="116" stroke="#2D3748" strokeWidth="1" />
        <line x1="122" y1="106" x2="142" y2="106" stroke="#2D3748" strokeWidth="1" />
        
        <rect x="58" y="70" width="20" height="15" fill={windowColor} className="cabin-win" rx="2" stroke="#2D3748" strokeWidth="2" />
        <line x1="70" y1="70" x2="70" y2="85" stroke="#2D3748" strokeWidth="1" />
        
        <rect x="122" y="70" width="20" height="15" fill={windowColor} className="cabin-win" rx="2" stroke="#2D3748" strokeWidth="2" />
        <line x1="132" y1="70" x2="132" y2="85" stroke="#2D3748" strokeWidth="1" />
        
        <rect x="15" y="130" width="170" height="4" fill={groundColor} rx="2" />
      </svg>
    );
  }
}

export default function CabanaCard({ cabana }) {
  const navigate = useNavigate()
  const [mostrarModal, setMostrarModal] = useState(false)
  const [hovered, setHovered] = useState(false)

  const fallbackDetalles = {
    dormitorios: `Dormitorios adaptados para la capacidad de ${cabana.capacidad} personas`,
    banos: "1 baño",
    servicios: "Acceso a piscina y estacionamiento"
  }

  const detalles = DETALLES_POR_CAPACIDAD[cabana.capacidad] || fallbackDetalles

  return (
    <>
      <div 
        onClick={() => setMostrarModal(true)}
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(236, 232, 224, 0.7)',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(26, 46, 27, 0.02)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onMouseEnter={() => {
          setHovered(true)
        }}
        onMouseLeave={() => {
          setHovered(false)
        }}
      >
        {/* Animated cabin vector illustration container */}
        <div style={{
          height: '190px', 
          background: '#FAF8F5', 
          overflow: 'hidden', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          position: 'relative', 
          borderBottom: '1px solid rgba(236, 232, 224, 0.4)'
        }}>
          {renderAnimatedCabin(cabana.capacidad, hovered)}
        </div>
        
        <div style={{padding:'1.5rem'}}>
          <h3 style={{
            margin:'0 0 6px',
            fontFamily:'"Outfit", sans-serif',
            fontSize:'1.25rem',
            fontWeight:'600',
            color:'#182535'
          }}>
            {cabana.nombre}
          </h3>
          <p style={{
            fontSize:'0.85rem',
            color:'#5A6A5C',
            margin:'0 0 1.25rem',
            lineHeight:'1.45'
          }}>
            {cabana.descripcion}
          </p>
          
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem'}}>
            <span style={{fontSize:'0.8rem',color:'#3D4C5E',fontWeight:'500'}}>
              👥 Capacidad: {cabana.capacidad} personas
            </span>
            <span style={{
              fontSize:'0.8rem',
              color:'#C01C1C',
              fontWeight:'600',
              textDecoration:'underline',
              textUnderlineOffset:'3px'
            }}>
              Ver detalles
            </span>
          </div>

          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',borderTop:'1px solid #FAF6F0',paddingTop:'1rem'}}>
            <span style={{fontSize:'1.25rem',fontWeight:'600',color:'#204C72',fontFamily:'"Outfit", sans-serif'}}>
              ${cabana.precio.toLocaleString('es-CL')}
              <small style={{fontSize:'0.8rem',color:'#7A8E7B',fontWeight:'400'}}>/noche</small>
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/reservar/${cabana.capacidad}`)
              }}
              style={{
                background:'#C01C1C',
                color:'#fff',
                border:'none',
                padding:'8px 20px',
                borderRadius:'50px',
                cursor:'pointer',
                fontWeight:'600',
                fontSize:'0.85rem',
                boxShadow:'0 2px 8px rgba(192,28,28,0.1)',
                transition:'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#9A1313'
                e.currentTarget.style.transform = 'scale(1.03)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#C01C1C'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              Reservar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Equipamiento */}
      {mostrarModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(24, 37, 53, 0.65)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
          onClick={() => setMostrarModal(false)}
        >
          <div 
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(24,37,53,0.15)',
              position: 'relative',
              border: '1px solid rgba(236, 232, 224, 0.7)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Cabin Illustration header */}
            <div style={{
              height: '240px', 
              position: 'relative', 
              background: '#FAF8F5', 
              overflow: 'hidden', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              borderBottom: '1px solid rgba(236,232,224,0.4)'
            }}>
              {renderAnimatedCabin(cabana.capacidad, true)}
              
              {/* Close Button */}
              <button
                onClick={() => setMostrarModal(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: '#1A2E1B',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  zIndex: 10,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#ffffff'
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.9)'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div style={{padding:'2rem', textAlign:'left'}}>
              <span style={{
                background: '#FAF6F0',
                color: '#C01C1C',
                padding: '4px 12px',
                borderRadius: '50px',
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                border: '1px solid rgba(192,28,28,0.1)'
              }}>
                Equipamiento Detallado
              </span>
              <h2 style={{
                fontFamily:'"Outfit", sans-serif',
                color:'#182535',
                fontSize:'1.8rem',
                fontWeight:'600',
                margin:'16px 0 8px'
              }}>
                {cabana.nombre}
              </h2>
              <p style={{
                fontSize:'0.95rem',
                color:'#5A6A5C',
                lineHeight:'1.55',
                margin:'0 0 2rem'
              }}>
                {cabana.descripcion}
              </p>

              {/* Detailed features list */}
              <div style={{display:'flex', flexDirection:'column', gap:'1.5rem', borderTop:'1px solid #ECE8E0', paddingTop:'1.5rem'}}>
                <div style={{display:'flex', gap:'16px', alignItems:'flex-start'}}>
                  <span style={{fontSize:'1.5rem', lineHeight:'1'}}>🛏️</span>
                  <div>
                    <h4 style={{margin:'0 0 4px', color:'#182535', fontSize:'0.95rem', fontWeight:'600', fontFamily:'"Outfit", sans-serif'}}>Dormitorios</h4>
                    <p style={{margin:0, fontSize:'0.85rem', color:'#5A6A5C', lineHeight:'1.45'}}>{detalles.dormitorios}</p>
                  </div>
                </div>

                <div style={{display:'flex', gap:'16px', alignItems:'flex-start'}}>
                  <span style={{fontSize:'1.5rem', lineHeight:'1'}}>🚿</span>
                  <div>
                    <h4 style={{margin:'0 0 4px', color:'#1A2E1B', fontSize:'0.95rem', fontWeight:'600', fontFamily:'"Outfit", sans-serif'}}>Baños</h4>
                    <p style={{margin:0, fontSize:'0.85rem', color:'#5A6A5C', lineHeight:'1.45'}}>{detalles.banos}</p>
                  </div>
                </div>

                <div style={{display:'flex', gap:'16px', alignItems:'flex-start'}}>
                  <span style={{fontSize:'1.5rem', lineHeight:'1'}}>✨</span>
                  <div>
                    <h4 style={{margin:'0 0 4px', color:'#1A2E1B', fontSize:'0.95rem', fontWeight:'600', fontFamily:'"Outfit", sans-serif'}}>Servicios Incluidos</h4>
                    <p style={{margin:0, fontSize:'0.85rem', color:'#5A6A5C', lineHeight:'1.45'}}>{detalles.servicios}</p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  background: '#FFF5F5',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(192, 28, 28, 0.15)',
                  marginTop: '0.5rem'
                }}>
                  <span style={{fontSize:'1.3rem', lineHeight:'1'}}>⚠️</span>
                  <div>
                    <h4 style={{margin:'0 0 2px', color:'#991B1B', fontSize:'0.9rem', fontWeight:'600', fontFamily:'"Outfit", sans-serif'}}>Ropa de Cama</h4>
                    <p style={{margin:0, fontSize:'0.82rem', color:'#991B1B', lineHeight:'1.4'}}>Cada pasajero debe traer sus propias sábanas y toallas (no están incluidas en la cabaña).</p>
                  </div>
                </div>
              </div>

              {/* Footer info & CTA */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid #ECE8E0',
                marginTop: '2rem',
                paddingTop: '1.5rem'
              }}>
                <div>
                  <span style={{fontSize:'0.8rem', color:'#7A8E7B', display:'block', fontWeight:'500'}}>Precio por Noche</span>
                  <span style={{fontSize:'1.5rem', fontWeight:'600', color:'#204C72', fontFamily:'"Outfit", sans-serif'}}>${cabana.precio.toLocaleString('es-CL')}</span>
                </div>
                <div style={{display:'flex', gap:'0.75rem'}}>
                  <button
                    onClick={() => setMostrarModal(false)}
                    style={{
                      background: '#FAF6F0',
                      color: '#4A5E4C',
                      border: '1px solid rgba(192,28,28,0.1)',
                      padding: '10px 20px',
                      borderRadius: '50px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#FAF2E6'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#FAF6F0'
                    }}
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => {
                      setMostrarModal(false)
                      navigate(`/reservar/${cabana.capacidad}`)
                    }}
                    style={{
                      background: '#C01C1C',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 24px',
                      borderRadius: '50px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      boxShadow: '0 4px 12px rgba(192,28,28,0.15)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#9A1313'
                      e.currentTarget.style.transform = 'scale(1.02)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#C01C1C'
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                  >
                    Reservar Ahora
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}