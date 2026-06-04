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
    <div style={{ background: '#FAF8F5', minHeight: '100vh' }}>
      {/* Hero Banner with Soft Radial Light */}
      <div style={{
        background: 'radial-gradient(circle at 50% 120%, #3F6343 0%, #1A2E1B 100%)',
        padding: '5rem 1.5rem 8rem',
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
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
          fontWeight: '400',
          marginBottom: '1rem',
          lineHeight: '1.15',
          letterSpacing: '-0.5px',
          textShadow: '0 2px 10px rgba(0,0,0,0.2)',
          color: '#ffffff'
        }}>
          Cabañas La Higuera Rapel
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
          <span>🚤 Paseos en lancha</span>
          <span>🚣 Kayak y botes</span>
          <span>🏊 Piscina</span>
          <span>🏄 Moto de agua</span>
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
            <span style={{
              color: '#5A7A5E',
              fontSize: '0.8rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              Nuestras Alternativas
            </span>
            <h2 style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 'clamp(1.8rem, 4vw, 2.2rem)',
              color: '#1A2E1B',
              fontWeight: '400',
              marginBottom: '0.5rem'
            }}>
              Nuestras Cabañas
            </h2>
            <div style={{
              width: '50px',
              height: '2px',
              background: '#2C4A2E',
              margin: '0.75rem auto 1rem',
              borderRadius: '2px'
            }} />
            <p style={{ color: '#7A8E7B', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto' }}>
              Cabañas para 2, 4, 6 y 8 personas — todos los servicios incluidos
            </p>
          </div>

          {cargando ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#7A8E7B' }}>
              <div className="spinner" style={{
                border: '3px solid rgba(44, 74, 46, 0.1)',
                borderTop: '3px solid #2C4A2E',
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

          {/* Elegant CTA Box */}
          <div style={{
            marginTop: '4rem',
            background: 'linear-gradient(135deg, #2C4A2E 0%, #1A2E1B 100%)',
            borderRadius: '20px',
            padding: '3rem 2rem',
            textAlign: 'center',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(26, 46, 27, 0.15)'
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
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
              fontWeight: '400',
              marginBottom: '0.75rem'
            }}>
              ¿Tienes dudas o buscas algo especial?
            </h3>
            <p style={{ opacity: .85, marginBottom: '2rem', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Contáctanos directamente y te ayudamos a elegir la cabaña perfecta para tu estadía a orillas del Lago Rapel.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <a href="https://wa.me/56978996989" target="_blank" rel="noopener noreferrer" style={{
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
                💬 WhatsApp Directo
              </a>
              <a href="mailto:juinzhy@gmail.com" style={{
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
