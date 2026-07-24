import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import SEO from '../components/SEO'
import styles from './Reservas.module.css'

export default function Reservas() {
  const navigate = useNavigate()
  const { estaAutenticado } = useAuth()
  const [reservas, setReservas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [procesandoPago, setProcesandoPago] = useState(null)

  useEffect(() => {
    if (!estaAutenticado) { navigate('/login'); return }
    api.misReservas().then(res => {
      if (res.ok) setReservas(res.data)
      setCargando(false)
    })
  }, [navigate, estaAutenticado])

  const handlePagar = async (id) => {
    setProcesandoPago(id)
    try {
      const res = await api.pagarReserva(id)
      if (res.ok && res.initPoint) {
        window.location.href = res.initPoint
      } else {
        alert(res.mensaje || 'Error al generar el portal de pago de Mercado Pago')
      }
    } catch (err) {
      console.error(err)
      alert('Error de conexión con el servidor')
    } finally {
      setProcesandoPago(null)
    }
  }

  const handleCancelar = async (id) => {
    if (!confirm('¿Seguro que deseas cancelar esta reserva?')) return
    try {
      const res = await api.cancelarReserva(id)
      if (res.ok) {
        alert('Reserva cancelada con éxito')
        setReservas(prev => prev.map(r => r.id === id ? { ...r, estado: 'cancelada' } : r))
      } else {
        alert(res.mensaje || 'Error al cancelar la reserva')
      }
    } catch (err) {
      console.error(err)
      alert('Error de conexión al intentar cancelar')
    }
  }

  const getInsigniaEstado = (estado) => {
    let background = '#FEF3C7', color = '#92400E' // Pendiente (Amarillo)
    if (estado === 'confirmada') {
      background = '#D1FAE5'; color = '#065F46' // Confirmado (Verde)
    } else if (estado === 'cancelada') {
      background = '#FEE2E2'; color = '#991B1B' // Cancelado (Rojo)
    }
    return (
      <span className={styles.statusBadge} style={{background, color}}>
        {estado}
      </span>
    )
  }

  return (
    <div className={styles.container}>
      <SEO titulo="Mis Reservas" descripcion="Consulta y gestiona tus reservas en Cabañas La Higuera Rapel." />
      <h1 className={styles.title}>
        Mis Reservas
      </h1>

      {cargando ? (
        <p className={styles.loadingText}>Cargando...</p>
      ) : reservas.length === 0 ? (
        <div className={styles.noDataCard}>
          <p className={styles.noDataText}>No tienes reservas aun</p>
          <button
            onClick={() => navigate('/')}
            className={styles.primaryBtn}
          >
            Ver cabañas
          </button>
        </div>
      ) : (
        <div className={styles.listContainer}>
          {reservas.map(r => (
            <div key={r.id} className={styles.reservaCard}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cabanaTitle}>
                    Cabaña para {r.cabana.capacidad} personas
                  </h3>
                  <p className={styles.datesText}>
                    {new Date(r.llegada).toLocaleDateString('es-CL')} → {new Date(r.salida).toLocaleDateString('es-CL')}
                  </p>
                </div>
                {getInsigniaEstado(r.estado)}
              </div>
              <div className={styles.cardFooter}>
                <div>
                  <span className={styles.footerLabel}>
                    {r.estado === 'confirmada' ? 'Total pagado' : r.estado === 'cancelada' ? 'Total tarifa' : 'Total a pagar'}
                  </span>
                  <span className={styles.footerTotal}>${r.total.toLocaleString('es-CL')}</span>
                </div>
                
                <div className={styles.actionButtons}>
                  {r.estado === 'pendiente' && (
                    <button
                      onClick={() => handlePagar(r.id)}
                      disabled={procesandoPago === r.id}
                      className={styles.payBtn}
                    >
                      {procesandoPago === r.id ? 'Cargando pago...' : 'Pagar ahora 💳'}
                    </button>
                  )}
                  
                  {r.estado !== 'cancelada' && (
                    <button
                      onClick={() => handleCancelar(r.id)}
                      className={styles.cancelBtn}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
