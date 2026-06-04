import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DETALLES_POR_CAPACIDAD = {
  2: {
    dormitorios: "1 dormitorio (1 Cama matrimonial Queen)",
    banos: "1 baño completo en suite con hidromasaje",
    cocina: "Kitchenette equipada (frigobar, microondas, cafetera, vajilla básica para 2)",
    exterior: "Balcón/terraza privada con parrilla pequeña y hermosa vista al entorno arbolado",
    servicios: "Sábanas y toallas premium, calefacción eléctrica, TV Smart (Netflix), acceso a piscina, estacionamiento"
  },
  4: {
    dormitorios: "2 dormitorios (1 Cama matrimonial, 2 Camas individuales)",
    banos: "1 baño completo con ducha de agua caliente",
    cocina: "Cocina americana equipada (refrigerador, encimera, vajilla completa, hervidor eléctrico)",
    exterior: "Terraza privada con parrilla para asados y vista al bosque de higueras",
    servicios: "Sábanas y toallas (cambio c/3 días), TV por cable, calefacción, acceso a piscina, kayaks, estacionamiento"
  },
  6: {
    dormitorios: "3 dormitorios (1 Cama matrimonial, 4 Camas individuales/camarotes)",
    banos: "1 baño completo + 1 medio baño de visitas",
    cocina: "Cocina independiente equipada (refrigerador grande, cocina con horno, microondas, vajilla completa)",
    exterior: "Gran terraza techada con parrilla para asados y vista al jardín principal",
    servicios: "Sábanas y toallas premium, calefacción a leña (bosca), TV satelital, acceso a piscina, botes de remo, estacionamiento para 2 vehículos"
  },
  8: {
    dormitorios: "3 o 4 dormitorios (2 Camas matrimoniales, 4 Camas individuales)",
    banos: "2 baños completos con tina/ducha",
    cocina: "Cocina amplia equipada (refrigerador de doble puerta, horno eléctrico, cafetera, vajilla completa)",
    exterior: "Terraza panorámica con parrilla familiar grande frente a áreas verdes/cercanas al lago",
    servicios: "Sábanas de alta calidad, toallas de baño, chimenea de leña, Smart TV de 50\", acceso preferencial a lanchas, kayaks, estacionamiento"
  },
  10: {
    dormitorios: "4 o 5 dormitorios (2 Camas matrimoniales, 6 Camas individuales/camarotes)",
    banos: "2 baños completos con tina + 1 baño social de visitas",
    cocina: "Cocina familiar full equipada (refrigerador industrial, microondas, vajilla para 12 personas, cafetera espresso)",
    exterior: "Amplia terraza frente al lago con parrilla grande, hamacas de descanso y mesa familiar exterior",
    servicios: "Sábanas y toallas deluxe, calefacción por pellet, Smart TV, acceso completo a paseos en lancha, kayaks, piscina y muelle privado, estacionamiento para 3 vehículos"
  }
}

export default function CabanaCard({ cabana }) {
  const navigate = useNavigate()
  const [mostrarModal, setMostrarModal] = useState(false)

  const fallbackDetalles = {
    dormitorios: `Dormitorios adaptados para la capacidad de ${cabana.capacidad} personas`,
    banos: "Baño completo equipado",
    cocina: "Cocina equipada con vajilla y electrodomésticos esenciales",
    exterior: "Terraza exterior con parrilla para asados",
    servicios: "Sábanas, toallas, acceso a piscina y estacionamiento"
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
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-6px)'
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(26, 46, 27, 0.08)'
          e.currentTarget.style.borderColor = 'rgba(44, 74, 46, 0.2)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(26, 46, 27, 0.02)'
          e.currentTarget.style.borderColor = 'rgba(236, 232, 224, 0.7)'
        }}
      >
        <div style={{height:'190px', background:'#FAF8F5', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', borderBottom:'1px solid rgba(236, 232, 224, 0.4)'}}>
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
            background: '#FAF8F5',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'0.6rem'}}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7A8E7B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 10l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <path d="M9 22V12h6v10" />
              </svg>
              <span style={{fontSize:'0.65rem', color:'#7A8E7B', letterSpacing:'2px', textTransform:'uppercase', fontWeight:'600'}}>Cabaña</span>
            </div>
          </div>
        </div>
        <div style={{padding:'1.5rem'}}>
          <h3 style={{
            margin:'0 0 6px',
            fontFamily:'"Playfair Display", Georgia, serif',
            fontSize:'1.25rem',
            fontWeight:'400',
            color:'#1A2E1B'
          }}>
            {cabana.nombre}
          </h3>
          <p style={{
            fontSize:'0.85rem',
            color:'#6E8270',
            margin:'0 0 1.25rem',
            lineHeight:'1.45'
          }}>
            {cabana.descripcion}
          </p>
          
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem'}}>
            <span style={{fontSize:'0.8rem',color:'#4A5E4C',fontWeight:'500'}}>
              👥 Capacidad: {cabana.capacidad} personas
            </span>
            <span style={{
              fontSize:'0.8rem',
              color:'#2C4A2E',
              fontWeight:'600',
              textDecoration:'underline',
              textUnderlineOffset:'3px'
            }}>
              Ver detalles
            </span>
          </div>

          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',borderTop:'1px solid #FAF6F0',paddingTop:'1rem'}}>
            <span style={{fontSize:'1.25rem',fontWeight:'600',color:'#2C4A2E',fontFamily:'"Outfit", sans-serif'}}>
              ${cabana.precio.toLocaleString('es-CL')}
              <small style={{fontSize:'0.8rem',color:'#7A8E7B',fontWeight:'400'}}>/noche</small>
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/reservar/${cabana.capacidad}`)
              }}
              style={{
                background:'#2C4A2E',
                color:'#fff',
                border:'none',
                padding:'8px 20px',
                borderRadius:'50px',
                cursor:'pointer',
                fontWeight:'600',
                fontSize:'0.85rem',
                boxShadow:'0 2px 8px rgba(44,74,46,0.1)',
                transition:'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#1A2E1B'
                e.currentTarget.style.transform = 'scale(1.03)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#2C4A2E'
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
            background: 'rgba(26, 46, 27, 0.65)',
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
              boxShadow: '0 25px 50px rgba(26,46,27,0.15)',
              position: 'relative',
              border: '1px solid rgba(236, 232, 224, 0.7)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hero Image / Placeholder */}
            <div style={{height:'240px', position:'relative', background:'#FAF8F5', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', borderBottom:'1px solid rgba(236,232,224,0.4)'}}>
              {cabana.imagen ? (
                <img 
                  src={cabana.imagen} 
                  alt={cabana.nombre} 
                  style={{width:'100%', height:'100%', objectFit:'cover'}} 
                  onError={(e) => {
                    e.target.style.display = 'none'
                    const fallback = e.target.parentElement.querySelector('.modal-fallback')
                    if (fallback) fallback.style.display = 'flex'
                  }}
                />
              ) : null}
              <div className="modal-fallback" style={{
                display: cabana.imagen ? 'none' : 'flex',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: '#FAF8F5',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'0.75rem'}}>
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#7A8E7B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 10l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <path d="M9 22V12h6v10" />
                  </svg>
                  <span style={{fontSize:'0.75rem', color:'#7A8E7B', letterSpacing:'3px', textTransform:'uppercase', fontWeight:'600'}}>Cabaña La Higuera</span>
                </div>
              </div>
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
                color: '#5A7A5E',
                padding: '4px 12px',
                borderRadius: '50px',
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                border: '1px solid rgba(44,74,46,0.1)'
              }}>
                Equipamiento Detallado
              </span>
              <h2 style={{
                fontFamily:'"Playfair Display", Georgia, serif',
                color:'#1A2E1B',
                fontSize:'1.8rem',
                fontWeight:'400',
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
                    <h4 style={{margin:'0 0 4px', color:'#1A2E1B', fontSize:'0.95rem', fontWeight:'600', fontFamily:'"Outfit", sans-serif'}}>Dormitorios</h4>
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
                  <span style={{fontSize:'1.5rem', lineHeight:'1'}}>🍳</span>
                  <div>
                    <h4 style={{margin:'0 0 4px', color:'#1A2E1B', fontSize:'0.95rem', fontWeight:'600', fontFamily:'"Outfit", sans-serif'}}>Cocina y Comedor</h4>
                    <p style={{margin:0, fontSize:'0.85rem', color:'#5A6A5C', lineHeight:'1.45'}}>{detalles.cocina}</p>
                  </div>
                </div>

                <div style={{display:'flex', gap:'16px', alignItems:'flex-start'}}>
                  <span style={{fontSize:'1.5rem', lineHeight:'1'}}>🏡</span>
                  <div>
                    <h4 style={{margin:'0 0 4px', color:'#1A2E1B', fontSize:'0.95rem', fontWeight:'600', fontFamily:'"Outfit", sans-serif'}}>Exterior y Terraza</h4>
                    <p style={{margin:0, fontSize:'0.85rem', color:'#5A6A5C', lineHeight:'1.45'}}>{detalles.exterior}</p>
                  </div>
                </div>

                <div style={{display:'flex', gap:'16px', alignItems:'flex-start'}}>
                  <span style={{fontSize:'1.5rem', lineHeight:'1'}}>✨</span>
                  <div>
                    <h4 style={{margin:'0 0 4px', color:'#1A2E1B', fontSize:'0.95rem', fontWeight:'600', fontFamily:'"Outfit", sans-serif'}}>Servicios Incluidos</h4>
                    <p style={{margin:0, fontSize:'0.85rem', color:'#5A6A5C', lineHeight:'1.45'}}>{detalles.servicios}</p>
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
                  <span style={{fontSize:'1.5rem', fontWeight:'600', color:'#2C4A2E', fontFamily:'"Outfit", sans-serif'}}>${cabana.precio.toLocaleString('es-CL')}</span>
                </div>
                <div style={{display:'flex', gap:'0.75rem'}}>
                  <button
                    onClick={() => setMostrarModal(false)}
                    style={{
                      background: '#FAF6F0',
                      color: '#4A5E4C',
                      border: '1px solid rgba(44,74,46,0.1)',
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
                      background: '#2C4A2E',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 24px',
                      borderRadius: '50px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      boxShadow: '0 4px 12px rgba(44,74,46,0.15)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#1A2E1B'
                      e.currentTarget.style.transform = 'scale(1.02)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#2C4A2E'
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