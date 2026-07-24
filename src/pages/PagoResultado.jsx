import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import styles from './PagoResultado.module.css'

export default function PagoResultado() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const status = searchParams.get('status')
  const paymentId = searchParams.get('payment_id')
  const externalReference = searchParams.get('external_reference')

  useEffect(() => {
    // Si no hay status, volvemos a la vista principal
    if (!status) {
      navigate('/')
    }
  }, [status, navigate])

  const renderContenido = () => {
    switch (status) {
      case 'success':
        return (
          <div className={styles.contentWrapper}>
            <div className={styles.icon}>✅</div>
            <h1 className={styles.titleSuccess}>
              ¡Pago procesado con éxito!
            </h1>
            <p className={styles.primaryText}>
              Tu reserva ha sido confirmada correctamente.
            </p>
            <p className={styles.secondaryText}>
              Te hemos enviado un correo electrónico con el comprobante y todos los detalles.
            </p>
            
            {paymentId && (
              <div className={styles.transactionBox}>
                <div className={styles.transactionLabel}>Código de Transacción</div>
                <div className={styles.transactionCode}>{paymentId}</div>
              </div>
            )}
            
            <div>
              <button
                onClick={() => navigate('/mis-reservas')}
                className={styles.btnPrimary}
              >
                Ver mis reservas
              </button>
            </div>
          </div>
        )
      case 'pending':
        return (
          <div className={styles.contentWrapper}>
            <div className={styles.icon}>⏳</div>
            <h1 className={styles.titlePending}>
              Pago en proceso de confirmación
            </h1>
            <p className={styles.primaryText}>
              Tu transacción está siendo verificada por Mercado Pago (por ejemplo, si elegiste transferencia).
            </p>
            <p className={styles.secondaryText}>
              Una vez acreditado el pago, tu reserva cambiará automáticamente a "confirmada" y recibirás el correo.
            </p>
            
            <div>
              <button
                onClick={() => navigate('/mis-reservas')}
                className={styles.btnPending}
              >
                Ver mis reservas pendientes
              </button>
            </div>
          </div>
        )
      case 'failure':
      default:
        return (
          <div className={styles.contentWrapper}>
            <div className={styles.icon}>❌</div>
            <h1 className={styles.titleFailure}>
              No pudimos procesar tu pago
            </h1>
            <p className={styles.primaryText}>
              La transacción fue rechazada, cancelada o no se pudo completar.
            </p>
            <p className={styles.secondaryText}>
              No te preocupes, puedes intentar realizar el pago nuevamente desde la sección de reservas.
            </p>
            
            <div className={styles.actionGroup}>
              <button
                onClick={() => navigate('/')}
                className={styles.btnOutline}
              >
                Ver cabañas
              </button>
              <button
                onClick={() => navigate('/mis-reservas')}
                className={styles.btnRetry}
              >
                Reintentar pago
              </button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className={styles.container}>
      <SEO titulo="Resultado del Pago" descripcion="Estado de tu pago en Cabañas La Higuera Rapel." />
      <div className={styles.card}>
        {renderContenido()}
      </div>
    </div>
  )
}
