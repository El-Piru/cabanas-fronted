import { Link } from 'react-router-dom'

export default function Footer() {
  const anio = new Date().getFullYear()

  return (
    <footer style={{
      background: '#2B5880',
      color: 'rgba(250, 247, 242, 0.75)',
      padding: '3rem 1.5rem 2rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      fontSize: '0.9rem',
      fontFamily: '"Outfit", sans-serif'
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Columna 1: Marca */}
        <div>
          <h3 style={{
            color: '#FAF7F2',
            fontFamily: '"Outfit", sans-serif',
            fontSize: '1.2rem',
            fontWeight: '600',
            margin: '0 0 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🏕️ Cabañas La Higuera
          </h3>
          <p style={{ lineHeight: '1.5', margin: 0, fontSize: '0.85rem', color: 'rgba(250, 247, 242, 0.6)' }}>
            Tu refugio perfecto a orillas del Lago Rapel. Disfruta de la tranquilidad de la naturaleza con el máximo confort y actividades náuticas.
          </p>
        </div>

        {/* Columna 2: Enlaces Rápidos */}
        <div>
          <h4 style={{ color: '#FAF7F2', fontSize: '0.95rem', fontWeight: '600', margin: '0 0 1rem' }}>Navegación</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Inicio</Link></li>
            <li><Link to="/mis-reservas" style={{ color: 'inherit', textDecoration: 'none' }}>Mis Reservas</Link></li>
            <li><a href="https://wa.me/56978996989" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Contacto Directo</a></li>
          </ul>
        </div>

        {/* Columna 3: Información Legal */}
        <div>
          <h4 style={{ color: '#FAF7F2', fontSize: '0.95rem', fontWeight: '600', margin: '0 0 1rem' }}>Legal</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><Link to="/terminos-y-condiciones" style={{ color: 'inherit', textDecoration: 'none' }}>Términos y Condiciones</Link></li>
            <li><Link to="/politica-de-privacidad" style={{ color: 'inherit', textDecoration: 'none' }}>Política de Privacidad</Link></li>
          </ul>
        </div>

        {/* Columna 4: Contacto */}
        <div>
          <h4 style={{ color: '#FAF7F2', fontSize: '0.95rem', fontWeight: '600', margin: '0 0 1rem' }}>Ubicación</h4>
          <a href="https://www.google.com/maps/dir/?api=1&destination=Caba%C3%B1as+La+Higuera+El+Manzano+Las+Cabras" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', display: 'block', margin: '0 0 0.5rem', fontSize: '0.85rem', transition: 'color 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'inherit'}>
            📍 Camino Punta Arenas s/n, El Manzano, Las Cabras
          </a>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem' }}>📞 +56 9 7899 6989</p>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>✉️ reservas@cabanaslahiguera.cl</p>
        </div>
      </div>

      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.8rem',
        color: 'rgba(250, 247, 242, 0.5)'
      }}>
        <span>© {anio} Cabañas La Higuera Rapel. Todos los derechos reservados.</span>
        <span>Desarrollado con ❤️ para Lago Rapel, Chile</span>
      </div>
    </footer>
  )
}
