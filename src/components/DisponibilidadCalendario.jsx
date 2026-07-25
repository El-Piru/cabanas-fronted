import { useState, useEffect } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
import 'react-datepicker/dist/react-datepicker.css'
import { api } from '../api'
import styles from './DisponibilidadCalendario.module.css'

registerLocale('es', es)

export default function DisponibilidadCalendario({ capacidad }) {
  const [fechasOcupadas, setFechasOcupadas] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    setCargando(true)
    api.getFechasOcupadas(capacidad)
      .then(res => {
        if (res.ok && res.data) {
          setFechasOcupadas(res.data)
        }
        setCargando(false)
      })
      .catch(err => {
        console.error('Error cargando fechas:', err)
        setCargando(false)
      })
  }, [capacidad])

  const verificarOcupada = (date) => {
    // Normalizar la fecha del calendario a medianoche local
    const d1 = new Date(date)
    d1.setHours(12, 0, 0, 0)

    return fechasOcupadas.some(reserva => {
      const inicio = new Date(reserva.llegada.split('T')[0] + 'T12:00:00')
      const fin = new Date(reserva.salida.split('T')[0] + 'T12:00:00')
      return d1 >= inicio && d1 < fin
    })
  }

  return (
    <div className={styles.calendarContainer}>
      {cargando ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando disponibilidad...</p>
        </div>
      ) : (
        <div className={styles.calendarWrapper}>
          <DatePicker
            locale="es"
            inline
            monthsShown={window.innerWidth > 768 ? 2 : 1}
            minDate={new Date()}
            filterDate={(date) => !verificarOcupada(date)}
            readOnly
            dayClassName={(date) => 
              verificarOcupada(date) ? styles.diaOcupado : styles.diaLibre
            }
          />
          <div className={styles.leyenda}>
            <div className={styles.leyendaItem}>
              <div className={`${styles.leyendaBox} ${styles.leyendaLibre}`}></div>
              <span>Disponible</span>
            </div>
            <div className={styles.leyendaItem}>
              <div className={`${styles.leyendaBox} ${styles.leyendaOcupada}`}></div>
              <span>Agotado</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
