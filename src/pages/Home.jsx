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
  const [fotosModalSel, setFotosModalSel] = useState([])
  const [fotoIndex, setFotoIndex] = useState(0)
  const [tituloModalSel, setTituloModalSel] = useState('Galería de Fotos')

  const galeriasPorActividad = {
    lancha: {
      titulo: 'Paseos en Lancha',
      fotos: [
        {
          id: 'lancha1',
          titulo: 'Paseo Guiado en Lancha por el Lago',
          descripcion: 'Recorridos turísticos en lancha con chalecos de seguridad para toda la familia.',
          src: '/images/lancha_tour_real_v3.jpg'
        }
      ]
    },
    moto: {
      titulo: 'Motos de Agua',
      fotos: [
        {
          id: 'moto1',
          titulo: 'Moto de Agua en el Complejo',
          descripcion: 'Motos de agua equipadas y listas para disfrutar en las cristalinas aguas del embalse Rapel.',
          src: '/images/moto_seadoo_v2.jpg'
        }
      ]
    },
    piscina: {
      titulo: 'Piscina y Tobogán',
      fotos: [
        {
          id: 'piscina1',
          titulo: 'Piscina del Complejo y Vista al Lago',
          descripcion: 'Piscina principal con zona de descanso, cercado de seguridad y quincho rodeado de palmeras.',
          src: '/images/piscina_real.jpg'
        },
        {
          id: 'toboggan1',
          titulo: 'Tobogán Acuático y Muelle de Embarque',
          descripcion: 'Gran tobogán acuático gigante y muelle con acceso directo al embalse Rapel.',
          src: '/images/toboggan_pier.jpg'
        }
      ]
    },
    kayak: {
      titulo: 'Kayak y Botes',
      fotos: [
        {
          id: 'kayak1',
          titulo: 'Vista al Lago y Quinchos',
          descripcion: 'Mesas con sombrillas de paja, quincho e iluminación nocturna a orillas del agua.',
          src: '/images/quincho_lago.jpg'
        }
      ]
    },
    todas: {
      titulo: 'Galería de Fotos del Complejo',
      fotos: [
        {
          id: 'moto1',
          titulo: 'Moto de Agua en el Complejo',
          descripcion: 'Motos de agua equipadas y listas para disfrutar en las cristalinas aguas del embalse Rapel.',
          src: '/images/moto_agua_real.jpg'
        },
        {
          id: 'lancha1',
          titulo: 'Paseo en Lancha por el Lago',
          descripcion: 'Recorridos turísticos guiados en lancha con chalecos de seguridad para toda la familia.',
          src: '/images/paseo_lancha_real.jpg'
        },
        {
          id: 'piscina1',
          titulo: 'Piscina del Complejo y Vista al Lago',
          descripcion: 'Piscina principal con zona de descanso, cercado de seguridad y quincho rodeado de palmeras.',
          src: '/images/piscina_real.jpg'
        },
        {
          id: 'toboggan1',
          titulo: 'Tobogán Acuático y Muelle de Embarque',
          descripcion: 'Gran tobogán acuático gigante y muelle con acceso directo al embalse Rapel.',
          src: '/images/toboggan_pier.jpg'
        },
        {
          id: 'eventos1',
          titulo: 'Eventos y Shows Folclóricos',
          descripcion: 'Presentaciones culturales, bailes tradicionales y entretenimiento a orillas del lago.',
          src: '/images/eventos.jpg'
        }
      ]
    }
  }

  const abrirGaleria = (clave = 'todas') => {
    const galeria = galeriasPorActividad[clave] || galeriasPorActividad['todas']
    setFotosModalSel(galeria.fotos)
    setTituloModalSel(galeria.titulo)
    setFotoIndex(0)
    setModalGaleria(true)
  }

  const fotoActual = (fotosModalSel && fotosModalSel.length > 0) ? (fotosModalSel[fotoIndex] || fotosModalSel[0]) : null

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
              key={idx}
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
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
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
            maxWidth: '850px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            color: '#fff'
          }}>
            <h3 style={{ fontFamily: '"Outfit", sans-serif', fontSize: '1.4rem', fontWeight: '600', margin: 0 }}>
              {tituloModalSel}
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

          {/* Active Image or Empty State Container */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '850px',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
            background: '#0d1520',
            display: 'flex',
            flexDirection: 'column',
            margin: '0 auto'
          }}>
            {fotoActual ? (
              <>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  maxHeight: '58vh',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#060a0f'
                }}>
                  <img
                    src={fotoActual.src}
                    alt={fotoActual.titulo}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '58vh',
                      objectFit: 'contain'
                    }}
                  />

                  {/* Navigation Buttons */}
                  {fotosModalSel.length > 1 && (
                    <>
                      <button
                        onClick={() => setFotoIndex(prev => (prev === 0 ? fotosModalSel.length - 1 : prev - 1))}
                        style={{
                          position: 'absolute',
                          left: '15px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'rgba(0, 0, 0, 0.6)',
                          border: '1px solid rgba(255,255,255,0.25)',
                          color: '#fff',
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          fontSize: '1.2rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backdropFilter: 'blur(6px)',
                          zIndex: 10
                        }}
                      >
                        ❮
                      </button>
                      <button
                        onClick={() => setFotoIndex(prev => (prev === fotosModalSel.length - 1 ? 0 : prev + 1))}
                        style={{
                          position: 'absolute',
                          right: '15px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'rgba(0, 0, 0, 0.6)',
                          border: '1px solid rgba(255,255,255,0.25)',
                          color: '#fff',
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          fontSize: '1.2rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backdropFilter: 'blur(6px)',
                          zIndex: 10
                        }}
                      >
                        ❯
                      </button>
                    </>
                  )}
                </div>

                {/* Caption & Counter */}
                <div style={{
                  width: '100%',
                  padding: '1.25rem 1.75rem',
                  background: '#121d2b',
                  borderTop: '1px solid rgba(255,255,255,0.12)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  boxSizing: 'border-box',
                  color: '#fff'
                }}>
                  <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                    <h4 style={{ margin: 0, fontSize: '1.15rem', fontFamily: '"Outfit", sans-serif', fontWeight: '600', color: '#ffffff' }}>
                      {fotoActual.titulo}
                    </h4>
                    <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', fontWeight: '300', lineHeight: '1.4' }}>
                      {fotoActual.descripcion}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.6)',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    background: 'rgba(255,255,255,0.08)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    flexShrink: 0
                  }}>
                    {fotoIndex + 1} / {fotosModalSel.length}
                  </span>
                </div>
              </>
            ) : (
              <div style={{
                padding: '3.5rem 2rem',
                textAlign: 'center',
                color: '#ffffff',
                fontFamily: '"Outfit", sans-serif'
              }}>
                <div style={{ fontSize: '2.8rem', marginBottom: '0.8rem', opacity: 0.8 }}>📷</div>
                <h4 style={{ color: '#ffffff', margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: '600' }}>
                  Próximamente fotografías
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.65)', fontWeight: '300' }}>
                  Pronto añadiremos fotos de esta actividad.
                </p>
              </div>
            )}
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
