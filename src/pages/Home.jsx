import { useEffect, useState } from 'react'
import { api } from '../api'
import CabanaCard from '../components/CabanaCard'
import SEO from '../components/SEO'
import styles from './Home.module.css'

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
        },
        {
          id: 'moto2',
          titulo: 'Recorridos Náuticos por el Lago',
          descripcion: 'Navegación y recorridos por las tranquilas aguas del embalse Rapel.',
          src: '/images/lancha_tour_v2.jpg'
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
    eventos: {
      titulo: 'Eventos y Celebraciones',
      fotos: [
        {
          id: 'evento_brindis',
          titulo: 'Matrimonios y Brindis de Celebración',
          descripcion: 'Decoración especial y brindis de bodas y festejos frente al Lago Rapel.',
          src: '/images/evento_brindis_v1.jpg'
        },
        {
          id: 'evento_comida',
          titulo: 'Paseos de Curso, Grupos y Celebraciones',
          descripcion: 'Desayunos, almuerzos y eventos especiales para grupos y familias.',
          src: '/images/evento_comida_v1.jpg'
        },
        {
          id: 'evento_exterior',
          titulo: 'Montaje de Eventos a Orillas del Lago',
          descripcion: 'Mesas decoradas frente al embalse Rapel con vista panorámica y palmeras.',
          src: '/images/evento_exterior_v1.jpg'
        },
        {
          id: 'evento_danza',
          titulo: 'Shows Culturales y Danza Tradicional',
          descripcion: 'Presentaciones en vivo, bailes tradicionales y entretenimiento a orillas del agua.',
          src: '/images/evento_danza_v1.jpg'
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
          src: '/images/moto_seadoo_v2.jpg'
        },
        {
          id: 'lancha1',
          titulo: 'Paseo Guiado en Lancha por el Lago',
          descripcion: 'Recorridos turísticos en lancha con chalecos de seguridad para toda la familia.',
          src: '/images/lancha_tour_real_v3.jpg'
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
          id: 'evento_brindis',
          titulo: 'Matrimonios y Brindis de Celebración',
          descripcion: 'Decoración especial y brindis de bodas y festejos frente al Lago Rapel.',
          src: '/images/evento_brindis_v1.jpg'
        },
        {
          id: 'evento_comida',
          titulo: 'Paseos de Curso, Grupos y Celebraciones',
          descripcion: 'Desayunos, almuerzos y eventos especiales para grupos y familias.',
          src: '/images/evento_comida_v1.jpg'
        },
        {
          id: 'evento_exterior',
          titulo: 'Montaje de Eventos a Orillas del Lago',
          descripcion: 'Mesas decoradas frente al embalse Rapel con vista panorámica y palmeras.',
          src: '/images/evento_exterior_v1.jpg'
        },
        {
          id: 'evento_danza',
          titulo: 'Shows Culturales y Danza Tradicional',
          descripcion: 'Presentaciones en vivo, bailes tradicionales y entretenimiento a orillas del agua.',
          src: '/images/evento_danza_v1.jpg'
        }
      ]
    }
  }

  // Precargar imágenes de galería para carga instantánea
  useEffect(() => {
    const urlsUnicas = new Set()
    Object.values(galeriasPorActividad).forEach(galeria => {
      galeria.fotos.forEach(foto => urlsUnicas.add(foto.src))
    })
    urlsUnicas.forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [])

  // Cerrar galería con Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && modalGaleria) setModalGaleria(false)
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [modalGaleria])

  const abrirGaleria = (clave = 'todas') => {
    const galeria = galeriasPorActividad[clave] || galeriasPorActividad['todas']
    setFotosModalSel(galeria.fotos)
    setTituloModalSel(galeria.titulo)
    setFotoIndex(0)
    setModalGaleria(true)
  }

  const fotoActual = (fotosModalSel && fotosModalSel.length > 0) ? (fotosModalSel[fotoIndex] || fotosModalSel[0]) : null

  return (
    <div className={styles.container}>
      <SEO titulo="Inicio" descripcion="Cabañas a orillas del Lago Rapel con piscina, tobogán, paseos en lancha y moto de agua. Reserva online tu estadía." />
      {/* Hero Banner with Soft Radial Light */}
      <div className={styles.hero}>
        {/* Subtle decorative background pattern or overlay */}
        <div className={styles.heroOverlay} />

        <h1 className={styles.title}>
          Cabañas La Higuera Rapel<br />
          <span className={styles.subtitle}>El Manzano</span>
        </h1>
        <p className={styles.description}>
          Tu refugio perfecto a orillas del Lago Rapel
        </p>

        {/* Interactive Feature Pills */}
        <div className={styles.features}>
          {[
            { cat: 'lancha', label: 'Paseos en lancha' },
            { cat: 'eventos', label: 'Eventos' },
            { cat: 'piscina', label: 'Piscina y Tobogán' },
            { cat: 'moto', label: 'Moto de agua' }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => abrirGaleria(item.cat)}
              className={styles.featureButton}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <a href="https://www.google.com/maps/dir/?api=1&destination=Caba%C3%B1as+La+Higuera+El+Manzano+Las+Cabras" target="_blank" rel="noopener noreferrer" className={styles.directionsButton}>
            Cómo llegar
          </a>
        </div>
      </div>

      {/* Lightbox Gallery Modal */}
      {modalGaleria && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-label={tituloModalSel}>
          {/* Header & Close Button */}
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>
              {tituloModalSel}
            </h3>
            <button
              onClick={() => setModalGaleria(false)}
              className={styles.modalClose}
            >
              ✕
            </button>
          </div>

          {/* Active Image or Empty State Container */}
          <div className={styles.modalContent}>
            {fotoActual ? (
              <>
                <div className={styles.modalImageContainer}>
                  <img
                    src={fotoActual.src}
                    alt={fotoActual.titulo}
                    className={styles.modalImage}
                  />

                  {/* Navigation Buttons */}
                  {fotosModalSel.length > 1 && (
                    <>
                      <button
                        onClick={() => setFotoIndex(prev => (prev === 0 ? fotosModalSel.length - 1 : prev - 1))}
                        className={`${styles.navButton} ${styles.navButtonLeft}`}
                      >
                        ❮
                      </button>
                      <button
                        onClick={() => setFotoIndex(prev => (prev === fotosModalSel.length - 1 ? 0 : prev + 1))}
                        className={`${styles.navButton} ${styles.navButtonRight}`}
                      >
                        ❯
                      </button>
                    </>
                  )}
                </div>

                {/* Caption & Counter */}
                <div className={styles.modalCaption}>
                  <div className={styles.captionText}>
                    <h4 className={styles.captionTitle}>
                      {fotoActual.titulo}
                    </h4>
                    <p className={styles.captionDesc}>
                      {fotoActual.descripcion}
                    </p>
                  </div>
                  <span className={styles.captionCounter}>
                    {fotoIndex + 1} / {fotosModalSel.length}
                  </span>
                </div>
              </>
            ) : (
              <div className={styles.modalEmpty}>
                <div className={styles.modalEmptyIcon}>📷</div>
                <h4 className={styles.modalEmptyTitle}>
                  Próximamente fotografías
                </h4>
                <p className={styles.modalEmptyDesc}>
                  Pronto añadiremos fotos de esta actividad.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Container Overlapping Hero */}
      <div className={styles.mainContainer}>
        <div className={styles.contentBox}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Nuestras Cabañas
            </h2>
            <div className={styles.sectionDivider} />
            <p className={styles.sectionDesc}>
              Cabañas para 2, 4, 6, 8 y 10 personas — Piscina y tobogán incluidos en el precio
            </p>
          </div>

          {cargando ? (
            <div className={styles.loadingState}>
              <div className={`${styles.spinner} spinner`} />
              <span>Cargando cabañas...</span>
            </div>
          ) : cabanas.length === 0 ? (
            <div className={styles.emptyState}>
              No hay cabañas disponibles en este momento.
            </div>
          ) : (
            <div className={styles.cabanaGrid}>
              {cabanas.map(cabana => (
                <CabanaCard key={cabana.capacidad} cabana={cabana} />
              ))}
            </div>
          )}

          {/* Entorno / Galería Section */}
          <div className={styles.infoSection}>
            <div>
              <h3 className={styles.infoTitle}>
                Nuestras cabañas junto al lago
              </h3>
              <p className={styles.infoDesc}>
                El complejo cuenta con cabañas dispuestas a ambos lados de un sendero central que conduce directamente a la orilla del Lago Rapel, ofreciendo una vista despejada hacia el agua y los cerros que rodean el sector.
              </p>
            </div>
            <div className={styles.infoImageContainer}>
              <img 
                src="/images/entorno.png" 
                alt="Entorno Cabañas La Higuera" 
                className={styles.infoImage}
              />
            </div>
          </div>

          {/* Piscina / Tobogán Section */}
          <div className={styles.infoSectionAlt}>
            <div className={styles.infoImageContainerAlt}>
              <img 
                src="/images/piscina.png" 
                alt="Piscina y Tobogán Cabañas La Higuera" 
                className={styles.infoImage}
              />
            </div>
            <div className={styles.infoContentAlt}>
              <h3 className={styles.infoTitle}>
                Diversión garantizada con piscina y tobogán gigante
              </h3>
              <p className={styles.infoDescAlt}>
                Nuestra piscina al aire libre cuenta con un tobogán de agua gigante y áreas de descanso con quinchos rústicos de paja. Es el lugar preferido de grandes y chicos para refrescarse, tomar sol y pasar la tarde divirtiéndose en un ambiente seguro y familiar.
              </p>
              <ul className={styles.infoList}>
                <li>Tobogán de agua de gran altura para todas las edades</li>
                <li>Quinchos individuales con sombrillas rústicas de paja</li>
                <li>Entorno rodeado de palmeras y césped natural</li>
              </ul>
            </div>
          </div>

          {/* Elegant CTA Box */}
          <div className={styles.ctaBox}>
            <div className={styles.ctaOverlay} />
            <h3 className={styles.ctaTitle}>
              ¿Tienes dudas o buscas algo especial?
            </h3>
            <p className={styles.ctaDesc}>
              Contáctanos directamente y te ayudamos a elegir la cabaña perfecta para tu estadía a orillas del Lago Rapel.
            </p>
            <div className={styles.ctaActions}>
              <a href="https://wa.me/56986698970" target="_blank" rel="noopener noreferrer" className={styles.whatsappButton}>
                WhatsApp Directo
              </a>
              <a href="mailto:Bana_ju@hotmail.com" className={styles.emailButton}>
                ✉️ Escríbenos por Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
