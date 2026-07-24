import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  const anio = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.gridContainer}>
        {/* Columna 1: Marca */}
        <div>
          <h3 className={styles.brandTitle}>
            🏕️ Cabañas La Higuera
          </h3>
          <p className={styles.brandDescription}>
            Tu refugio perfecto a orillas del Lago Rapel. Disfruta de la tranquilidad de la naturaleza con el máximo confort y actividades náuticas.
          </p>
        </div>

        {/* Columna 2: Enlaces Rápidos */}
        <div>
          <h4 className={styles.columnTitle}>Navegación</h4>
          <ul className={styles.navList}>
            <li><Link to="/" className={styles.navLink}>Inicio</Link></li>
            <li><Link to="/mis-reservas" className={styles.navLink}>Mis Reservas</Link></li>
            <li><a href="https://wa.me/56986698970" target="_blank" rel="noopener noreferrer" className={styles.navLink}>Contacto Directo</a></li>
          </ul>
        </div>
 
        {/* Columna 3: Información Legal */}
        <div>
          <h4 className={styles.columnTitle}>Legal</h4>
          <ul className={styles.navList}>
            <li><Link to="/terminos-y-condiciones" className={styles.navLink}>Términos y Condiciones</Link></li>
            <li><Link to="/politica-de-privacidad" className={styles.navLink}>Política de Privacidad</Link></li>
          </ul>
        </div>
 
        {/* Columna 4: Contacto */}
        <div>
          <h4 className={styles.columnTitle}>Ubicación</h4>
          <a href="https://www.google.com/maps/dir/?api=1&destination=Caba%C3%B1as+La+Higuera+El+Manzano+Las+Cabras" target="_blank" rel="noopener noreferrer" className={styles.locationLink}>
            📍 Camino Punta Arenas s/n, El Manzano, Las Cabras
          </a>
          <p className={styles.contactText}>📞 +56 9 8669 8970</p>
          <p className={styles.emailText}>✉️ Bana_ju@hotmail.com</p>
        </div>
      </div>

      <div className={styles.bottomContainer}>
        <span>© {anio} Cabañas La Higuera Rapel. Todos los derechos reservados.</span>
      </div>
    </footer>
  )
}
