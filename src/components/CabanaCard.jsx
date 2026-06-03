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
          background:'#fff',
          borderRadius:'12px',
          overflow:'hidden',
          border:'1px solid #ECE8E0',
          cursor:'pointer',
          transition:'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform='translateY(-4px)'
          e.currentTarget.style.boxShadow='0 8px 20px rgba(44,74,46,0.15)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform='translateY(0)'
          e.currentTarget.style.boxShadow='none'
        }}
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
          
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem'}}>
            <span style={{fontSize:'0.8rem',color:'#4A5E4C',fontWeight:'500'}}>
              👥 Capacidad: {cabana.capacidad} personas
            </span>
            <span style={{fontSize:'0.8rem',color:'#1A6B8A',fontWeight:'600'}}>
              Ver detalles ➔
            </span>
          </div>

          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',borderTop:'1px solid #F0EBE2',paddingTop:'.75rem'}}>
            <span style={{fontSize:'1.2rem',fontWeight:'500',color:'#2C4A2E'}}>
              ${cabana.precio.toLocaleString('es-CL')}
              <small style={{fontSize:'0.8rem',color:'#7A8E7B'}}>/noche</small>
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/reservar/${cabana.capacidad}`)
              }}
              style={{background:'#2C4A2E',color:'#fff',border:'none',padding:'8px 16px',borderRadius:'6px',cursor:'pointer',fontWeight:'500'}}
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
            background: 'rgba(26, 46, 27, 0.75)',
            backdropFilter: 'blur(8px)',
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
              background: '#fff',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hero Image */}
            <div style={{height:'220px', position:'relative', background:'#FAF7F2', overflow:'hidden'}}>
              {cabana.imagen ? (
                <img src={cabana.imagen} alt={cabana.nombre} style={{width:'100%', height:'100%', objectFit:'cover'}} />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg,#3D6B40,#6B9E55)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '5rem'
                }}>🌲</div>
              )}
              {/* Close Button */}
              <button
                onClick={() => setMostrarModal(false)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  color: '#1A2E1B',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div style={{padding:'1.75rem'}}>
              <span style={{
                background: '#EAE6DF',
                color: '#4A5E4C',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Equipamiento Completo
              </span>
              <h2 style={{fontFamily:'Georgia,serif', color:'#1A2E1B', margin:'12px 0 6px'}}>{cabana.nombre}</h2>
              <p style={{fontSize:'0.95rem', color:'#666', lineHeight:'1.5', margin:'0 0 1.5rem'}}>{cabana.descripcion}</p>

              {/* Detailed features list */}
              <div style={{display:'flex', flexDirection:'column', gap:'1.25rem', borderTop:'1px solid #ECE8E0', paddingTop:'1.25rem'}}>
                <div style={{display:'flex', gap:'12px', alignItems:'flex-start'}}>
                  <span style={{fontSize:'1.4rem', lineHeight:'1'}}>🛏️</span>
                  <div>
                    <h4 style={{margin:'0 0 2px', color:'#1A2E1B', fontSize:'0.95rem', fontWeight:'600'}}>Dormitorios</h4>
                    <p style={{margin:0, fontSize:'0.85rem', color:'#555', lineHeight:'1.4'}}>{detalles.dormitorios}</p>
                  </div>
                </div>

                <div style={{display:'flex', gap:'12px', alignItems:'flex-start'}}>
                  <span style={{fontSize:'1.4rem', lineHeight:'1'}}>🚿</span>
                  <div>
                    <h4 style={{margin:'0 0 2px', color:'#1A2E1B', fontSize:'0.95rem', fontWeight:'600'}}>Baños</h4>
                    <p style={{margin:0, fontSize:'0.85rem', color:'#555', lineHeight:'1.4'}}>{detalles.banos}</p>
                  </div>
                </div>

                <div style={{display:'flex', gap:'12px', alignItems:'flex-start'}}>
                  <span style={{fontSize:'1.4rem', lineHeight:'1'}}>🍳</span>
                  <div>
                    <h4 style={{margin:'0 0 2px', color:'#1A2E1B', fontSize:'0.95rem', fontWeight:'600'}}>Cocina y Comedor</h4>
                    <p style={{margin:0, fontSize:'0.85rem', color:'#555', lineHeight:'1.4'}}>{detalles.cocina}</p>
                  </div>
                </div>

                <div style={{display:'flex', gap:'12px', alignItems:'flex-start'}}>
                  <span style={{fontSize:'1.4rem', lineHeight:'1'}}>🏡</span>
                  <div>
                    <h4 style={{margin:'0 0 2px', color:'#1A2E1B', fontSize:'0.95rem', fontWeight:'600'}}>Exterior y Terraza</h4>
                    <p style={{margin:0, fontSize:'0.85rem', color:'#555', lineHeight:'1.4'}}>{detalles.exterior}</p>
                  </div>
                </div>

                <div style={{display:'flex', gap:'12px', alignItems:'flex-start'}}>
                  <span style={{fontSize:'1.4rem', lineHeight:'1'}}>✨</span>
                  <div>
                    <h4 style={{margin:'0 0 2px', color:'#1A2E1B', fontSize:'0.95rem', fontWeight:'600'}}>Servicios Incluidos</h4>
                    <p style={{margin:0, fontSize:'0.85rem', color:'#555', lineHeight:'1.4'}}>{detalles.servicios}</p>
                  </div>
                </div>
              </div>

              {/* Footer info & CTA */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid #ECE8E0',
                marginTop: '1.75rem',
                paddingTop: '1.25rem'
              }}>
                <div>
                  <span style={{fontSize:'0.8rem', color:'#7A8E7B', display:'block'}}>Precio por Noche</span>
                  <span style={{fontSize:'1.4rem', fontWeight:'600', color:'#2C4A2E'}}>${cabana.precio.toLocaleString('es-CL')}</span>
                </div>
                <div style={{display:'flex', gap:'0.75rem'}}>
                  <button
                    onClick={() => setMostrarModal(false)}
                    style={{
                      background: '#F0EBE2',
                      color: '#4A5E4C',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '0.9rem'
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
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem'
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