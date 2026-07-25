import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DisponibilidadCalendario from './DisponibilidadCalendario'
import styles from './CabanaCard.module.css'

const DETALLES_POR_CAPACIDAD = {
  2: {
    tituloDormitorios: "1 dormitorio",
    lineasCamas: [
      "1 Cama matrimonial"
    ],
    banos: "1 baño",
    servicios: "Cabaña equipada, calefacción a leña, TV por cable, acceso a piscina, tobogán y estacionamiento"
  },
  4: {
    tituloDormitorios: "2 dormitorios",
    lineasCamas: [
      "1 Cama matrimonial",
      "2 Camas bajas"
    ],
    banos: "1 baño",
    servicios: "Cabaña equipada, calefacción a leña, TV por cable, acceso a piscina, tobogán y estacionamiento"
  },
  6: {
    tituloDormitorios: "2 dormitorios",
    lineasCamas: [
      "1 Cama matrimonial",
      "2 Camarotes"
    ],
    banos: "1 baño",
    servicios: "Cabaña equipada, calefacción a leña, TV por cable, acceso a piscina, tobogán y estacionamiento"
  },
  8: {
    tituloDormitorios: "3 dormitorios",
    lineasCamas: [
      "1 Cama matrimonial",
      "2 Camarotes",
      "2 Camas bajas"
    ],
    banos: "1 baño",
    servicios: "Cabaña equipada, calefacción a leña, TV por cable, acceso a piscina, tobogán y estacionamiento"
  },
  10: {
    tituloDormitorios: "3 dormitorios",
    lineasCamas: [
      "1 Cama matrimonial en una habitación",
      "2 Camarotes en la segunda habitación",
      "2 Camarotes en la tercera habitación"
    ],
    banos: "1 baño",
    servicios: "Cabaña equipada, calefacción a leña, TV por cable, acceso a piscina, tobogán y estacionamiento"
  }
}

// Genera un vector SVG minimalista y animado de cabaña rectangular según la capacidad
const renderAnimatedCabin = (capacidad, forceWindowOn = false) => {
  // Palette matching the brand red and nature theme
  const roofColor = '#C01C1C' // Brand red
  const wallColor = '#9A7E65' // Warm clean wood tone
  const wallColorLight = '#B59C85' // Wood line highlights
  const groundColor = '#8A7865' // Deep soil
  const doorColor = '#533B27' // Dark wood door
  const treeColor = '#416347' // Forest green pine trees
  const treeColorLight = '#537A5A' // Highlight tree
  const hillColor = '#E3DFD5' // Warm sand hills in background
  
  const windowClass = `${styles.cabinWin} ${forceWindowOn ? styles.windowOn : ''}`

  if (capacidad === 2) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.cabinSvg}>
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
        <circle cx="140" cy="65" r="4" fill="#B8B2A7" className={styles.smokeP1} style={{transformOrigin: '140px 65px'}} />
        <circle cx="140" cy="65" r="5" fill="#B8B2A7" className={styles.smokeP2} style={{transformOrigin: '140px 65px'}} />
        
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
        <circle cx="112" cy="106" r="10" className={windowClass} stroke="#2D3748" strokeWidth="2" />
        <line x1="102" y1="106" x2="122" y2="106" stroke="#2D3748" strokeWidth="1" />
        <line x1="112" y1="96" x2="112" y2="116" stroke="#2D3748" strokeWidth="1" />
        
        {/* Ground */}
        <rect x="15" y="130" width="170" height="4" fill={groundColor} rx="2" />
      </svg>
    );
  } else if (capacidad === 4) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.cabinSvg}>
        <rect width="200" height="150" fill="#FAF8F5" />
        
        <path d="M-10,130 C40,105 80,110 130,130 T210,130" fill={hillColor} opacity="0.6" />
        <path d="M30,130 C90,115 120,115 180,130" fill="#EBE7DE" opacity="0.8" />

        <polygon points="20,130 42,130 31,75" fill={treeColor} />
        <polygon points="150,130 172,130 161,72" fill={treeColor} />
        <polygon points="160,130 182,130 171,82" fill={treeColorLight} opacity="0.9" />

        <circle cx="140" cy="60" r="4" fill="#B8B2A7" className={styles.smokeP1} style={{transformOrigin: '140px 60px'}} />
        <circle cx="140" cy="60" r="5" fill="#B8B2A7" className={styles.smokeP2} style={{transformOrigin: '140px 60px'}} />
        <rect x="136" y="64" width="8" height="20" fill="#2D3748" rx="1" />
        
        <rect x="55" y="80" width="90" height="50" fill={wallColor} rx="3" />
        <line x1="55" y1="90" x2="145" y2="90" stroke={wallColorLight} strokeWidth="2" />
        <line x1="55" y1="102" x2="145" y2="102" stroke={wallColorLight} strokeWidth="2" />
        <line x1="55" y1="114" x2="145" y2="114" stroke={wallColorLight} strokeWidth="2" />
        
        <polygon points="45,80 155,80 100,45" fill={roofColor} />
        <polygon points="45,80 155,80 100,49" fill="#991B1B" opacity="0.2" />

        <rect x="68" y="93" width="18" height="37" fill={doorColor} rx="1" />
        <circle cx="81" cy="111" r="1.5" fill="#FCD34D" />
        
        <rect x="102" y="93" width="22" height="22" className={windowClass} rx="2" stroke="#2D3748" strokeWidth="2" />
        <line x1="113" y1="93" x2="113" y2="115" stroke="#2D3748" strokeWidth="1" />
        <line x1="102" y1="104" x2="124" y2="104" stroke="#2D3748" strokeWidth="1" />
        
        <rect x="15" y="130" width="170" height="4" fill={groundColor} rx="2" />
      </svg>
    );
  } else if (capacidad === 6) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.cabinSvg}>
        <rect width="200" height="150" fill="#FAF8F5" />
        
        <path d="M-10,130 C40,105 80,110 130,130 T210,130" fill={hillColor} opacity="0.6" />
        <path d="M30,130 C90,115 120,115 180,130" fill="#EBE7DE" opacity="0.8" />

        <polygon points="15,130 38,130 26.5,70" fill={treeColor} />
        <polygon points="160,130 182,130 171,70" fill={treeColor} />
        <polygon points="170,130 192,130 181,80" fill={treeColorLight} opacity="0.9" />

        <circle cx="150" cy="55" r="4" fill="#B8B2A7" className={styles.smokeP1} style={{transformOrigin: '150px 55px'}} />
        <circle cx="150" cy="55" r="5" fill="#B8B2A7" className={styles.smokeP2} style={{transformOrigin: '150px 55px'}} />
        <rect x="146" y="59" width="8" height="20" fill="#2D3748" rx="1" />
        
        <rect x="45" y="75" width="110" height="55" fill={wallColor} rx="3" />
        <line x1="45" y1="85" x2="155" y2="85" stroke={wallColorLight} strokeWidth="2" />
        <line x1="45" y1="97" x2="155" y2="97" stroke={wallColorLight} strokeWidth="2" />
        <line x1="45" y1="109" x2="155" y2="109" stroke={wallColorLight} strokeWidth="2" />
        
        <polygon points="35,75 165,75 100,40" fill={roofColor} />
        <polygon points="35,75 165,75 100,44" fill="#991B1B" opacity="0.2" />

        <rect x="91" y="88" width="18" height="42" fill={doorColor} rx="1" />
        <circle cx="104" cy="109" r="1.5" fill="#FCD34D" />
        
        <rect x="58" y="92" width="20" height="20" className={windowClass} rx="2" stroke="#2D3748" strokeWidth="2" />
        <line x1="68" y1="92" x2="68" y2="112" stroke="#2D3748" strokeWidth="1" />
        <line x1="58" y1="102" x2="78" y2="102" stroke="#2D3748" strokeWidth="1" />
        
        <rect x="122" y="92" width="20" height="20" className={windowClass} rx="2" stroke="#2D3748" strokeWidth="2" />
        <line x1="132" y1="92" x2="132" y2="112" stroke="#2D3748" strokeWidth="1" />
        <line x1="122" y1="102" x2="142" y2="102" stroke="#2D3748" strokeWidth="1" />
        
        <rect x="15" y="130" width="170" height="4" fill={groundColor} rx="2" />
      </svg>
    );
  } else if (capacidad === 8) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.cabinSvg}>
        <rect width="200" height="150" fill="#FAF8F5" />
        
        <path d="M-10,130 C40,105 80,110 130,130 T210,130" fill={hillColor} opacity="0.6" />
        <path d="M30,130 C90,115 120,115 180,130" fill="#EBE7DE" opacity="0.8" />

        <polygon points="18,130 40,130 29,68" fill={treeColor} />
        <polygon points="152,130 174,130 163,65" fill={treeColor} />
        <polygon points="162,130 184,130 173,78" fill={treeColorLight} opacity="0.9" />

        <circle cx="140" cy="45" r="4" fill="#B8B2A7" className={styles.smokeP1} style={{transformOrigin: '140px 45px'}} />
        <circle cx="140" cy="45" r="5" fill="#B8B2A7" className={styles.smokeP2} style={{transformOrigin: '140px 45px'}} />
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
        
        <rect x="102" y="98" width="22" height="22" className={windowClass} rx="2" stroke="#2D3748" strokeWidth="2" />
        <line x1="113" y1="98" x2="113" y2="120" stroke="#2D3748" strokeWidth="1" />
        <line x1="102" y1="109" x2="124" y2="109" stroke="#2D3748" strokeWidth="1" />
        
        <rect x="89" y="72" width="22" height="15" className={windowClass} rx="2" stroke="#2D3748" strokeWidth="2" />
        <line x1="100" y1="72" x2="100" y2="87" stroke="#2D3748" strokeWidth="1" />
        
        <rect x="15" y="130" width="170" height="4" fill={groundColor} rx="2" />
      </svg>
    );
  } else {
    // 10 personas
    return (
      <svg width="100%" height="100%" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.cabinSvg}>
        <rect width="200" height="150" fill="#FAF8F5" />
        
        <path d="M-10,130 C40,105 80,110 130,130 T210,130" fill={hillColor} opacity="0.6" />
        <path d="M30,130 C90,115 120,115 180,130" fill="#EBE7DE" opacity="0.8" />

        <polygon points="12,130 35,130 23.5,62" fill={treeColor} />
        <polygon points="160,130 182,130 171,60" fill={treeColor} />
        <polygon points="170,130 192,130 181,72" fill={treeColorLight} opacity="0.9" />

        <circle cx="150" cy="40" r="4" fill="#B8B2A7" className={styles.smokeP1} style={{transformOrigin: '150px 40px'}} />
        <circle cx="150" cy="40" r="5" fill="#B8B2A7" className={styles.smokeP2} style={{transformOrigin: '150px 40px'}} />
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
        
        <rect x="58" y="96" width="20" height="20" className={windowClass} rx="2" stroke="#2D3748" strokeWidth="2" />
        <line x1="70" y1="96" x2="70" y2="116" stroke="#2D3748" strokeWidth="1" />
        <line x1="58" y1="106" x2="80" y2="106" stroke="#2D3748" strokeWidth="1" />
        
        <rect x="122" y="96" width="20" height="20" className={windowClass} rx="2" stroke="#2D3748" strokeWidth="2" />
        <line x1="132" y1="96" x2="132" y2="116" stroke="#2D3748" strokeWidth="1" />
        <line x1="122" y1="106" x2="142" y2="106" stroke="#2D3748" strokeWidth="1" />
        
        <rect x="58" y="70" width="20" height="15" className={windowClass} rx="2" stroke="#2D3748" strokeWidth="2" />
        <line x1="70" y1="70" x2="70" y2="85" stroke="#2D3748" strokeWidth="1" />
        
        <rect x="122" y="70" width="20" height="15" className={windowClass} rx="2" stroke="#2D3748" strokeWidth="2" />
        <line x1="132" y1="70" x2="132" y2="85" stroke="#2D3748" strokeWidth="1" />
        
        <rect x="15" y="130" width="170" height="4" fill={groundColor} rx="2" />
      </svg>
    );
  }
}

export default function CabanaCard({ cabana }) {
  const navigate = useNavigate()
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mostrarCalendario, setMostrarCalendario] = useState(false)

  // Cerrar modal con Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && mostrarModal) setMostrarModal(false)
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [mostrarModal])

  const fallbackDetalles = {
    dormitorios: `Dormitorios adaptados para la capacidad de ${cabana.capacidad} personas`,
    banos: "1 baño",
    servicios: "Cabaña equipada, calefacción a leña, TV por cable, acceso a piscina, tobogán y estacionamiento"
  }

  const detalles = DETALLES_POR_CAPACIDAD[cabana.capacidad] || fallbackDetalles

  return (
    <>
      <div 
        onClick={() => setMostrarModal(true)}
        className={styles.card}
      >
        {/* Animated cabin vector illustration container */}
        <div className={styles.svgContainer}>
          {renderAnimatedCabin(cabana.capacidad)}
        </div>
        
        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>
            {cabana.nombre}
          </h3>
          <p className={styles.cardDescription}>
            {cabana.descripcion}
          </p>
          
          <div className={styles.capacityContainer}>
            <span className={styles.capacityText}>
              Capacidad: {cabana.capacidad} personas
            </span>
            <span className={styles.detailsLink}>
              Ver detalles
            </span>
          </div>

          <div className={styles.priceContainer}>
            <span className={styles.priceText}>
              ${cabana.precio.toLocaleString('es-CL')}
              <small className={styles.priceSmall}>/noche</small>
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/reservar/${cabana.capacidad}`)
              }}
              className={styles.bookBtn}
            >
              Reservar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Equipamiento */}
      {mostrarModal && (
        <div 
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label={`Equipamiento Cabaña ${cabana.capacidad} personas`}
          onClick={() => setMostrarModal(false)}
        >
          <div className={styles.modalLayoutWrapper} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalContainer}>
              {/* Modal Cabin Illustration header */}
              <div className={styles.modalSvgContainer}>
                {renderAnimatedCabin(cabana.capacidad, true)}
                
                {/* Close Button */}
                <button
                  onClick={() => {
                    setMostrarModal(false)
                    setMostrarCalendario(false)
                  }}
                  className={styles.modalCloseBtn}
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className={styles.modalContent}>
                <span className={styles.modalBadge}>
                  Equipamiento Detallado
                </span>
                <h2 className={styles.modalTitle}>
                  {cabana.nombre}
                </h2>
                <p className={styles.modalDescription}>
                  {cabana.descripcion}
                </p>

                {/* Detailed features list */}
                <div className={styles.featuresList}>
                  <div className={styles.featureItem}>
                    <div className={styles.featureIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C01C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 4v16M2 8h20v12M2 17h20M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
                      </svg>
                    </div>
                    <div>
                      <h4 className={styles.featureTitle}>
                        {detalles.tituloDormitorios || 'Dormitorios'}
                      </h4>
                      {detalles.lineasCamas ? (
                        <div>
                          {detalles.lineasCamas.map((linea, idx) => (
                            <p key={idx} className={styles.featureText}>
                              {linea}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className={styles.featureTextSingle}>{detalles.dormitorios}</p>
                      )}
                    </div>
                  </div>

                  <div className={styles.featureItem}>
                    <div className={styles.featureIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#204C72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z" />
                        <path d="M6 12V5a3 3 0 0 1 6 0v1" />
                      </svg>
                    </div>
                    <div>
                      <h4 className={styles.featureTitle}>Baños</h4>
                      <p className={styles.featureTextSingle}>{detalles.banos}</p>
                    </div>
                  </div>

                  <div className={styles.featureItem}>
                    <div className={styles.featureIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#204C72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h4 className={styles.featureTitle}>Servicios Incluidos</h4>
                      <p className={styles.featureTextSingle}>{detalles.servicios}</p>
                    </div>
                  </div>

                  <div className={styles.noteContainer}>
                    <h4 className={styles.noteTitle}>NOTA</h4>
                    <p className={styles.noteText}>No está incluido sábanas y toallas.</p>
                  </div>
                </div>

                {/* Footer info & CTA */}
                <div className={styles.modalFooter}>
                  <div className={styles.modalPriceContainer}>
                    <span className={styles.modalPriceLabel}>Precio por Noche</span>
                    <span className={styles.modalPriceValue}>${cabana.precio.toLocaleString('es-CL')}</span>
                  </div>

                  <div className={styles.modalButtons}>
                    <button
                      onClick={() => setMostrarCalendario(!mostrarCalendario)}
                      className={styles.modalCalendarBtn}
                    >
                      {mostrarCalendario ? 'Ocultar Disponibilidad' : '📅 Ver Disponibilidad'}
                    </button>
                    <button
                      onClick={() => {
                        setMostrarModal(false)
                        navigate(`/reservar/${cabana.capacidad}`)
                      }}
                      className={styles.modalBookBtn}
                    >
                      Reservar Ahora
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Side Panel */}
            {mostrarCalendario && (
              <div className={styles.calendarSidePanel}>
                <DisponibilidadCalendario capacidad={cabana.capacidad} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}