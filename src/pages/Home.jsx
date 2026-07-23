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

  const [modalGaleria, setModalGaleria] = useState(false)
  const [categoriaSel, setCategoriaSel] = useState('todas')
  const [fotoIndex, setFotoIndex] = useState(0)

  const fotosActividades = [
    {
      id: 'piscina',
      categoria: 'piscina',
      titulo: 'Piscina del Complejo',
      descripcion: 'Piscina principal con vista al Lago Rapel, zona de descanso y quincho rodeado de palmeras.',
      src: '/images/piscina_real.jpg'
    },
    {
      id: 'toboggan',
      categoria: 'piscina',
      titulo: 'Tobogán Acuático y Muelle',
      descripcion: 'Gran tobogán acuático gigante y muelle de embarque directo al lago.',
      src: '/images/toboggan_pier.jpg'
    },
    {
      id: 'lancha',
      categoria: 'lancha',
      titulo: 'Paseos en Lancha y Deportes',
      descripcion: 'Zonas de embarque y paseos por el embalse Rapel.',
      src: '/images/toboggan_pier.jpg'
    },
    {
      id: 'kayak',
      categoria: 'kayak',
      titulo: 'Kayak y Botes',
      descripcion: 'Explora la tranquilidad del lago a tu propio ritmo en nuestros kayak y botes de remo.',
      src: '/images/quincho_lago.jpg'
    },
    {
      id: 'moto',
      categoria: 'moto',
      titulo: 'Moto de Agua',
      descripcion: 'Emoción y velocidad sobre las cristalinas aguas del embalse Rapel.',
      src: '/images/moto_agua.jpg'
    },
    {
      id: 'quincho',
      categoria: 'resort',
      titulo: 'Vista al Lago y Quinchos',
      descripcion: 'Áreas de mesas con sombrillas de paja, quincho e iluminación frente al agua.',
      src: '/images/quincho_lago.jpg'
    },
    {
      id: 'eventos',
      categoria: 'resort',
      titulo: 'Eventos y Shows Folclóricos',
      descripcion: 'Presentaciones culturales, bailes tradicionales y entretenimiento a orillas del lago.',
      src: '/images/eventos.jpg'
    }
  ]

  const abrirGaleria = (cat = 'todas') => {
    setCategoriaSel(cat)
    setFotoIndex(0)
    setModalGaleria(true)
  }

  const fotosFiltradas = categoriaSel === 'todas'
    ? fotosActividades
    : fotosActividades.filter(f => f.categoria === categoriaSel)

  const fotoActual = fotosFiltradas[fotoIndex] || fotosActividades[0]

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

        {/* Interactive Feature Pills */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.6rem',
          flexWrap: 'wrap',
          fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
          fontWeight: '500',
          maxWidth: '850px',
          margin: '0 auto',
          padding: '8px'
        }}>
          {[
            { cat: 'lancha', label: 'Paseos en lancha' },
            { cat: 'kayak', label: 'Kayak y botes' },
            { cat: 'piscina', label: 'Piscina y Tobogán' },
            { cat: 'moto', label: 'Moto de agua' }
          ].map((item, idx) => (
            <button
              key={item.cat}
              onClick={() => abrirGaleria(item.cat)}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '500',
                fontSize: '0.9rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.28)'
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.25)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)'
              }}
            >
              <span>{item.label}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85 }}>
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => abrirGaleria('todas')}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#182535',
              padding: '11px 26px',
              borderRadius: '50px',
              border: 'none',
              fontWeight: '600',
              fontSize: '0.9rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.background = '#ffffff'
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            Ver fotos
          </button>

          <a href="https://www.google.com/maps/dir/?api=1&destination=Caba%C3%B1as+La+Higuera+El+Manzano+Las+Cabras" target="_blank" rel="noopener noreferrer" style={{
            background: '#C01C1C',
            color: '#fff',
            padding: '11px 26px',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.9rem',
            boxShadow: '0 4px 15px rgba(192, 28, 28, 0.3)',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
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

      {/* Lightbox Gallery Modal */}
      {modalGaleria && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(10, 18, 26, 0.85)',
          backdropFilter: 'blur(16px)',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          animation: 'fadeIn 0.25s ease'
        }}>
          {/* Header & Close Button */}
          <div style={{
            width: '100%',
            maxWidth: '1000px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            color: '#fff'
          }}>
            <h3 style={{ fontFamily: '"Outfit", sans-serif', fontSize: '1.4rem', fontWeight: '600', margin: 0 }}>
              Galería de Actividades y Complejo
            </h3>
            <button
              onClick={() => setModalGaleria(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                color: '#fff',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              ✕
            </button>
          </div>

          {/* Category Tabs */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            maxWidth: '1000px'
          }}>
            {[
              { id: 'todas', label: 'Todas las fotos' },
              { id: 'lancha', label: 'Paseos en lancha' },
              { id: 'kayak', label: 'Kayak y botes' },
              { id: 'piscina', label: 'Piscina y Tobogán' },
              { id: 'moto', label: 'Moto de agua' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategoriaSel(cat.id)
                  setFotoIndex(0)
                }}
                style={{
                  background: categoriaSel === cat.id ? '#C01C1C' : 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '7px 18px',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: categoriaSel === cat.id ? '600' : '400',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Active Image Container */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '900px',
            maxHeight: '65vh',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            background: '#0d1520',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img
              src={fotoActual.src}
              alt={fotoActual.titulo}
              style={{
                width: '100%',
                maxHeight: '52vh',
                objectFit: 'cover'
              }}
            />

            {/* Navigation Buttons */}
            {fotosFiltradas.length > 1 && (
              <>
                <button
                  onClick={() => setFotoIndex(prev => (prev === 0 ? fotosFiltradas.length - 1 : prev - 1))}
                  style={{
                    position: 'absolute',
                    left: '15px',
                    top: '40%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  ❮
                </button>
                <button
                  onClick={() => setFotoIndex(prev => (prev === fotosFiltradas.length - 1 ? 0 : prev + 1))}
                  style={{
                    position: 'absolute',
                    right: '15px',
                    top: '40%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  ❯
                </button>
              </>
            )}

            {/* Caption & Counter */}
            <div style={{
              width: '100%',
              padding: '1rem 1.5rem',
              background: 'rgba(15, 25, 36, 0.95)',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#fff'
            }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontFamily: '"Outfit", sans-serif', fontWeight: '600', color: '#fff' }}>
                  {fotoActual.titulo}
                </h4>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontWeight: '300' }}>
                  {fotoActual.descripcion}
                </p>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: '500', whitespace: 'nowrap' }}>
                {fotoIndex + 1} / {fotosFiltradas.length}
              </span>
            </div>
          </div>
        </div>
      )}

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
                width: '32px',
                height: '32px',
                animation: 'spin 0.8s linear infinite',
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
