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
    }).catch(err => {
      console.error('Error al cargar cabañas:', err)
      setCargando(false)
    })
  }, [])

  return (
    <div style={{ background: '#FAF8F5', minHeight: '100vh' }}>
      {/* Hero Banner with Soft Radial Light */}
      <div style={{
        background: 'linear-gradient(to bottom, rgba(24, 43, 62, 0.5) 0%, rgba(24, 43, 62, 0.8) 100%), url("/images/entorno.png") center/cover no-repeat',
        padding: '7rem 1.5rem 10rem',
        textAlign: 'center',
        color: '#fff',
        position: 'relative'
      }}>
        {/* Subtle decorative background pattern or overlay */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0, bottom: 0, left: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 80%)',
          pointerEvents: 'none'
        }} />

        <h1 style={{
          fontFamily: '"Outfit", sans-serif',
          fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
          fontWeight: '700',
          marginBottom: '1rem',
          lineHeight: '1.15',
          letterSpacing: '-0.5px',
          textShadow: '0 2px 10px rgba(0,0,0,0.2)',
          color: '#ffffff'
        }}>
          Cabañas La Higuera Rapel<br />
          <span style={{ fontSize: '0.85em', fontWeight: '500', opacity: 0.95, display: 'inline-block', marginTop: '4px' }}>El Manzano</span>
        </h1>
        <p style={{
          fontSize: 'clamp(1.05rem, 3vw, 1.25rem)',
          opacity: .9,
          fontWeight: '300',
          letterSpacing: '0.2px',
          marginBottom: '2.5rem',
          maxWidth: '650px',
          margin: '0 auto 2.5rem',
          fontFamily: '"Outfit", "Inter", sans-serif',
          textShadow: '0 1px 5px rgba(0,0,0,0.15)',
          color: '#ffffff'
        }}>
          Tu refugio perfecto a orillas del Lago Rapel
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1.25rem',
          flexWrap: 'wrap',
          fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
          fontWeight: '500',
          background: 'rgba(255, 255, 255, 0.08)',
          padding: '12px 24px',
          borderRadius: '50px',
          maxWidth: 'fit-content',
          margin: '0 auto',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <span>Paseos en lancha</span>
          <span>•</span>
          <span>Kayak y botes</span>
          <span>•</span>
          <span>Piscina y Tobogán</span>
          <span>•</span>
          <span>Moto de agua</span>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <a href="https://www.google.com/maps/dir/?api=1&destination=Caba%C3%B1as+La+Higuera+El+Manzano+Las+Cabras" target="_blank" rel="noopener noreferrer" style={{
            background: '#C01C1C',
            color: '#fff',
            padding: '10px 26px',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.85rem',
            boxShadow: '0 4px 15px rgba(192, 28, 28, 0.3)',
            transition: 'all 0.2s ease',
            display: 'inline-block'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform='translateY(-2px)'
            e.currentTarget.style.boxShadow='0 6px 20px rgba(192, 28, 28, 0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform='translateY(0)'
            e.currentTarget.style.boxShadow='0 4px 15px rgba(192, 28, 28, 0.3)'
          }}>
            Cómo llegar
          </a>
        </div>
      </div>

      {/* Main Container Overlapping Hero */}
      <div style={{
        maxWidth: '1100px',
        margin: '-4.5rem auto 0',
        position: 'relative',
        zIndex: 10,
        padding: '0 1rem 4rem'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 15px 35px rgba(26, 46, 27, 0.06), 0 5px 15px rgba(0, 0, 0, 0.02)',
          border: '1px solid rgba(236, 232, 224, 0.7)',
          padding: '3.5rem 2rem 3rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: 'clamp(1.8rem, 4vw, 2.2rem)',
              color: '#182535',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              Nuestras Cabañas
            </h2>
            <div style={{
              width: '50px',
              height: '2px',
              background: '#C01C1C',
              margin: '0.75rem auto 1rem',
              borderRadius: '2px'
            }} />
            <p style={{ color: '#7A8E7B', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
              Cabañas para 2, 4, 6, 8 y 10 personas — Piscina y tobogán incluidos en el precio
            </p>
          </div>

          {cargando ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#7A8E7B' }}>
              <div className="spinner" style={{
                border: '3px solid rgba(192, 28, 28, 0.1)',
                borderTop: '3px solid #C01C1C',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                margin: '0 auto 1rem'
              }} />
              <span>Cargando cabañas...</span>
            </div>
          ) : cabanas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#7A8E7B' }}>
              No hay cabañas disponibles en este momento.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '2rem'
            }}>
              {cabanas.map(cabana => (
                <CabanaCard key={cabana.capacidad} cabana={cabana} />
              ))}
            </div>
          )}

          {/* Entorno / Galería Section */}
          <div style={{
            marginTop: '5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
            paddingTop: '3rem',
            borderTop: '1px solid rgba(236, 232, 224, 0.7)'
          }}>
            <div>
              <h3 style={{
                fontFamily: '"Outfit", sans-serif',
                fontSize: '1.8rem',
                color: '#182535',
                fontWeight: '600',
                marginBottom: '1rem'
              }}>
                Nuestras cabañas junto al lago
              </h3>
              <p style={{ color: '#5C6E5E', lineHeight: '1.6', fontSize: '1.05rem', margin: 0 }}>
                El complejo cuenta con cabañas dispuestas a ambos lados de un sendero central que conduce directamente a la orilla del Lago Rapel, ofreciendo una vista despejada hacia el agua y los cerros que rodean el sector.
              </p>
            </div>
            <div style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              border: '1px solid rgba(236, 232, 224, 0.7)'
            }}>
              <img 
                src="/images/entorno.png" 
                alt="Entorno Cabañas La Higuera" 
                style={{ width: '100%', display: 'block', height: 'auto', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Piscina / Tobogán Section */}
          <div style={{
            marginTop: '5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
            paddingTop: '4rem',
            borderTop: '1px solid rgba(236, 232, 224, 0.7)'
          }}>
            <div style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              border: '1px solid rgba(236, 232, 224, 0.7)',
              order: 2
            }}>
              <img 
                src="/images/piscina.png" 
                alt="Piscina y Tobogán Cabañas La Higuera" 
                style={{ width: '100%', display: 'block', height: 'auto', objectFit: 'cover' }}
              />
            </div>
            <div style={{ order: 1 }}>
              <h3 style={{
                fontFamily: '"Outfit", sans-serif',
                fontSize: '1.8rem',
                color: '#182535',
                fontWeight: '600',
                marginBottom: '1rem'
              }}>
                Diversión garantizada con piscina y tobogán gigante
              </h3>
              <p style={{ color: '#5C6E5E', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Nuestra piscina al aire libre cuenta con un tobogán de agua gigante y áreas de descanso con quinchos rústicos de paja. Es el lugar preferido de grandes y chicos para refrescarse, tomar sol y pasar la tarde divirtiéndose en un ambiente seguro y familiar.
              </p>
              <ul style={{ paddingLeft: '20px', color: '#5C6E5E', lineHeight: '2' }}>
                <li>Tobogán de agua de gran altura para todas las edades</li>
                <li>Quinchos individuales con sombrillas rústicas de paja</li>
                <li>Entorno rodeado de palmeras y césped natural</li>
              </ul>
            </div>
          </div>

          {/* Elegant CTA Box */}
          <div style={{
            marginTop: '4rem',
            background: 'linear-gradient(135deg, #407DAF 0%, #204C72 100%)',
            borderRadius: '20px',
            padding: '3rem 2rem',
            textAlign: 'center',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(32, 76, 114, 0.15)'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50%', left: '-20%',
              width: '300px', height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />
            <h3 style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
              fontWeight: '600',
              marginBottom: '0.75rem'
            }}>
              ¿Tienes dudas o buscas algo especial?
            </h3>
            <p style={{ opacity: .85, marginBottom: '2rem', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Contáctanos directamente y te ayudamos a elegir la cabaña perfecta para tu estadía a orillas del Lago Rapel.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <a href="https://wa.me/56986698970" target="_blank" rel="noopener noreferrer" style={{
                background: '#25D366',
                color: '#fff',
                padding: '12px 28px',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.95rem',
                boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                display: 'inline-block'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform='translateY(-2px)'
                e.currentTarget.style.boxShadow='0 6px 20px rgba(37, 211, 102, 0.4)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform='translateY(0)'
                e.currentTarget.style.boxShadow='0 4px 15px rgba(37, 211, 102, 0.3)'
              }}>
                WhatsApp Directo
              </a>
              <a href="mailto:Bana_ju@hotmail.com" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                padding: '12px 28px',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.95rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.2s ease',
                display: 'inline-block'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform='translateY(-2px)'
                e.currentTarget.style.background='rgba(255, 255, 255, 0.18)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform='translateY(0)'
                e.currentTarget.style.background='rgba(255, 255, 255, 0.1)'
              }}>
                ✉️ Escríbenos por Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
