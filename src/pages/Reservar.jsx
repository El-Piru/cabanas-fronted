import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import SEO from '../components/SEO'
import styles from './Reservar.module.css'

export default function Reservar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cabana, setCabana] = useState(null)
  const [form, setForm] = useState({ llegada: '', salida: '' })
  const [noches, setNoches] = useState(0)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [fechasOcupadas, setFechasOcupadas] = useState([])
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const { estaAutenticado, logout } = useAuth()

  useEffect(() => {
    if (!estaAutenticado) { navigate('/login'); return }
    
    api.getCabanaPorCapacidad(parseInt(id))
      .then(res => {
        if (res.ok && res.data) {
          setCabana(res.data)
        } else {
          if (res.mensaje === 'Token requerido' || res.mensaje === 'Token inválido') {
            logout()
            navigate('/login')
          } else {
            setError(res.mensaje || 'La capacidad especificada no existe o no está disponible.')
          }
        }
      })
      .catch(err => {
        console.error(err)
        setError('Error de comunicación con el servidor')
      })

    api.getFechasOcupadas(parseInt(id))
      .then(res => {
        if (res.ok) setFechasOcupadas(res.data)
      })
    // Cargar borrador guardado de fechas si existe y es válido
    const borradorGuardado = localStorage.getItem(`borrador_reserva_${id}`)
    if (borradorGuardado) {
      try {
        const datos = JSON.parse(borradorGuardado)
        if (datos.llegada && datos.salida) {
          const dLlegada = new Date(datos.llegada + 'T12:00:00')
          const hoy = new Date()
          hoy.setHours(0, 0, 0, 0)
          if (dLlegada >= hoy) {
            setForm({ llegada: datos.llegada, salida: datos.salida })
          } else {
            localStorage.removeItem(`borrador_reserva_${id}`)
          }
        }
      } catch (e) {
        console.error('Error al cargar borrador:', e)
      }
    }
  }, [id, navigate])

  const verificarSolapamiento = (llegada, salida) => {
    if (!llegada || !salida) return false
    const d1 = new Date(llegada + 'T12:00:00')
    const d2 = new Date(salida + 'T12:00:00')

    return fechasOcupadas.some(reserva => {
      const inicio = new Date(reserva.llegada.split('T')[0] + 'T12:00:00')
      const fin = new Date(reserva.salida.split('T')[0] + 'T12:00:00')
      // Lógica estricta de solapamiento de días enteros
      return d1 <= fin && d2 >= inicio
    })
  }

  useEffect(() => {
    if (form.llegada && form.salida) {
      const d1 = new Date(form.llegada + 'T12:00:00')
      const d2 = new Date(form.salida + 'T12:00:00')
      const n = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24))
      
      if (n <= 0) {
        setNoches(0)
        setTotal(0)
        setError('La fecha de salida debe ser posterior a la de llegada')
      } else if (verificarSolapamiento(form.llegada, form.salida)) {
        setNoches(0)
        setTotal(0)
        setError('La cabaña ya está reservada en esas fechas. Por favor elige otra.')
      } else {
        setNoches(n)
        setTotal(n * cabana.precio)
        setError('')
        if (n > 0 && !verificarSolapamiento(form.llegada, form.salida)) {
          localStorage.setItem(`borrador_reserva_${id}`, JSON.stringify(form))
        }
      }
    }
  }, [form, cabana, fechasOcupadas, id])

  const limpiarBorrador = () => {
    setForm({ llegada: '', salida: '' })
    setNoches(0)
    setTotal(0)
    setError('')
    localStorage.removeItem(`borrador_reserva_${id}`)
  }

  // Obtiene fechas incluyendo el día final (checkout)
  const obtenerFechasExcluidas = () => {
    const excluidas = []
    fechasOcupadas.forEach(reserva => {
      const llegadaStr = reserva.llegada.split('T')[0]
      const salidaStr = reserva.salida.split('T')[0]
      
      let actual = new Date(llegadaStr + 'T12:00:00')
      const fin = new Date(salidaStr + 'T12:00:00')
      
      // actual <= fin para incluir también el día de salida en los bloqueados
      while (actual <= fin) {
        excluidas.push(new Date(actual))
        actual.setDate(actual.getDate() + 1)
      }
    })
    return excluidas
  }

  const formatFecha = (fecha) => {
    if (!fecha) return ''
    return new Date(fecha + 'T12:00:00').toLocaleDateString('es-CL', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!aceptaTerminos) {
      setError('Debes aceptar los Términos y Condiciones y las Políticas de Cancelación para continuar.')
      return
    }
    if (verificarSolapamiento(form.llegada, form.salida)) {
      setError('La cabaña ya está reservada en esas fechas.')
      return
    }
    setCargando(true)
    setError('')
    try {
      const res = await api.crearReserva({
        capacidad: parseInt(id),
        llegada: form.llegada,
        salida: form.salida
      })
      if (res.ok) {
        localStorage.removeItem(`borrador_reserva_${id}`)
        if (res.initPoint) {
          window.location.href = res.initPoint
        } else {
          setError(res.mensaje || 'Se creó la reserva pero no se pudo generar el enlace de pago.')
        }
      } else {
        setError(res.mensaje)
      }
    } catch (err) {
      console.error('Error al crear reserva:', err)
      setError('Error de comunicación con el servidor. Por favor, intenta más tarde.')
    } finally {
      setCargando(false)
    }
  }

  if (error && !cabana) return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>⚠️</div>
      <h3 className={styles.errorTitle}>No pudimos cargar la cabaña</h3>
      <p className={styles.errorText}>{error}</p>
      <button onClick={() => navigate('/')} className={styles.errorButton}>
        Volver al inicio
      </button>
    </div>
  )

  if (!cabana) return <div className={styles.loadingContainer}>Cargando...</div>

  if (exito) return (
    <div className={styles.successContainer}>
      <div className={styles.successIcon}>✅</div>
      <h2 className={styles.successTitle}>¡Reserva confirmada!</h2>
      <p className={styles.successText}>Te enviaremos un correo con todos los detalles.</p>
      <p className={styles.successPhone}>Para consultas: 📞 9 8669 8970</p>
      <div className={styles.detailsCard}>
        <p className={styles.detailsTitle}><strong>Detalles de tu estadía:</strong></p>
        <p className={styles.detailsItem}><strong>🏕️ Cabaña:</strong> {cabana.nombre}</p>
        <p className={styles.detailsItem}><strong>📅 Entrada:</strong> {formatFecha(form.llegada)} desde las 10:00 am</p>
        <p className={styles.detailsItem}><strong>📅 Salida:</strong> {formatFecha(form.salida)} hasta las 7:00 pm</p>
        <p className={styles.detailsItem}><strong>🌙 Noches:</strong> {noches}</p>
        <div className={styles.detailsTotalRow}>
          <span className={styles.detailsTotalLabel}>Total</span>
          <span className={styles.detailsTotalValue}>${total.toLocaleString('es-CL')}</span>
        </div>
      </div>
      <button onClick={() => navigate('/mis-reservas')} className={styles.successButton}>
        Ver mis reservas
      </button>
    </div>
  )

  return (
    <div className={styles.mainContainer}>
      <SEO titulo="Reservar Cabaña" descripcion="Selecciona fechas y reserva tu cabaña a orillas del Lago Rapel." />
      <h1 className={styles.mainTitle}>Reservar</h1>
      <p className={styles.subtitle}>{cabana.nombre} — ${cabana.precio.toLocaleString('es-CL')}/noche · {cabana.capacidad} personas</p>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.formCard}>
        <div className={styles.formGroup}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Fecha de llegada</label>
            {(form.llegada || form.salida) && (
              <button
                type="button"
                onClick={limpiarBorrador}
                className={styles.clearButton}
              >
                Limpiar fechas
              </button>
            )}
          </div>
          <DatePicker
            selected={form.llegada ? new Date(form.llegada + 'T12:00:00') : null}
            onChange={date => setForm({...form, llegada: date ? date.toISOString().split('T')[0] : '', salida: ''})}
            selectsStart
            startDate={form.llegada ? new Date(form.llegada + 'T12:00:00') : null}
            endDate={form.salida ? new Date(form.salida + 'T12:00:00') : null}
            minDate={new Date()}
            excludeDates={obtenerFechasExcluidas()}
            placeholderText="Selecciona fecha de llegada"
            dateFormat="dd/MM/yyyy"
            className={styles.datePickerInput}
            required
          />
          {form.llegada && <p className={styles.helpText}>Entrada desde las 10:00 am</p>}
        </div>
        <div className={styles.formGroupExtra}>
          <label className={styles.label}>Fecha de salida</label>
          <DatePicker
            selected={form.salida ? new Date(form.salida + 'T12:00:00') : null}
            onChange={date => setForm({...form, salida: date ? date.toISOString().split('T')[0] : ''})}
            selectsEnd
            startDate={form.llegada ? new Date(form.llegada + 'T12:00:00') : null}
            endDate={form.salida ? new Date(form.salida + 'T12:00:00') : null}
            minDate={form.llegada ? new Date(form.llegada + 'T12:00:00') : new Date()}
            excludeDates={obtenerFechasExcluidas()}
            placeholderText="Selecciona fecha de salida"
            dateFormat="dd/MM/yyyy"
            className={styles.datePickerInput}
            required
            disabled={!form.llegada}
          />
          {form.salida && <p className={styles.helpText}>Salida hasta las 7:00 pm</p>}
        </div>

        {noches > 0 && (
          <div className={styles.summaryCard}>
            <h4 className={styles.summaryTitle}>Resumen de tu reserva</h4>
            <p className={styles.summaryItem}>🏕️ {cabana.nombre}</p>
            <p className={styles.summaryItem}>📅 {formatFecha(form.llegada)} → {formatFecha(form.salida)}</p>
            <p className={styles.summaryNights}>🌙 {noches} {noches === 1 ? 'noche' : 'noches'}</p>
            <div className={styles.summaryCalcRow}>
              <span>{noches} noches × ${cabana.precio.toLocaleString('es-CL')}</span>
              <span>${total.toLocaleString('es-CL')}</span>
            </div>
            <div className={styles.summaryTotalRow}>
              <span>Total</span>
              <span className={styles.summaryTotalValue}>${total.toLocaleString('es-CL')}</span>
            </div>
          </div>
        )}

        {noches > 0 && (
          <div className={styles.termsRow}>
            <input 
              type="checkbox" 
              id="terminos" 
              checked={aceptaTerminos} 
              onChange={(e) => setAceptaTerminos(e.target.checked)} 
              className={styles.termsCheckbox}
            />
            <label htmlFor="terminos" className={styles.termsLabel}>
              Acepto los <a href="/terminos" target="_blank" rel="noopener noreferrer" className={styles.termsLink}>Términos y Condiciones</a> y las <a href="/terminos#politica-cancelacion" target="_blank" rel="noopener noreferrer" className={styles.termsLink}>Políticas de Cancelación</a> de Cabañas La Higuera.
            </label>
          </div>
        )}

        <button onClick={handleSubmit} disabled={cargando || noches === 0 || !aceptaTerminos} className={`${styles.submitButton} ${(noches > 0 && aceptaTerminos) ? styles.submitButtonEnabled : styles.submitButtonDisabled}`}>
          {cargando ? 'Confirmando...' : 'Confirmar reserva'}
        </button>
      </div>
    </div>
  )
}
