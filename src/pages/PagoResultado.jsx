import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

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
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '4.5rem', marginBottom: '1.5rem' }}>✅</div>
            <h1 style={{ fontFamily: 'Georgia,serif', color: '#1A2E1B', marginBottom: '1rem', fontSize: '2rem' }}>
              ¡Pago procesado con éxito!
            </h1>
            <p style={{ color: '#4A5E4C', fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: '1.6' }}>
              Tu reserva ha sido confirmada correctamente.
            </p>
            <p style={{ color: '#7A8E7B', fontSize: '0.95rem', marginBottom: '2rem' }}>
              Te hemos enviado un correo electrónico con el comprobante y todos los detalles.
            </p>
            
            {paymentId && (
              <div style={{ background: '#FAF7F2', border: '1px solid #ECE8E0', borderRadius: '12px', padding: '1rem 1.5rem', display: 'inline-block', marginBottom: '2rem', textAlign: 'left' }}>
                <div style={{ fontSize: '0.85rem', color: '#7A8E7B', marginBottom: '4px' }}>Código de Transacción</div>
                <div style={{ fontWeight: '600', color: '#2C4A2E', fontFamily: 'monospace', fontSize: '1rem' }}>{paymentId}</div>
              </div>
            )}
            
            <div>
              <button
                onClick={() => navigate('/mis-reservas')}
                style={{ background: '#2C4A2E', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }}
              >
                Ver mis reservas
              </button>
            </div>
          </div>
        )
      case 'pending':
        return (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '4.5rem', marginBottom: '1.5rem' }}>⏳</div>
            <h1 style={{ fontFamily: 'Georgia,serif', color: '#C8860A', marginBottom: '1rem', fontSize: '2rem' }}>
              Pago en proceso de confirmación
            </h1>
            <p style={{ color: '#4A5E4C', fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: '1.6' }}>
              Tu transacción está siendo verificada por Mercado Pago (por ejemplo, si elegiste transferencia).
            </p>
            <p style={{ color: '#7A8E7B', fontSize: '0.95rem', marginBottom: '2rem' }}>
              Una vez acreditado el pago, tu reserva cambiará automáticamente a "confirmada" y recibirás el correo.
            </p>
            
            <div>
              <button
                onClick={() => navigate('/mis-reservas')}
                style={{ background: '#C8860A', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }}
              >
                Ver mis reservas pendientes
              </button>
            </div>
          </div>
        )
      case 'failure':
      default:
        return (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '4.5rem', marginBottom: '1.5rem' }}>❌</div>
            <h1 style={{ fontFamily: 'Georgia,serif', color: '#991B1B', marginBottom: '1rem', fontSize: '2rem' }}>
              No pudimos procesar tu pago
            </h1>
            <p style={{ color: '#4A5E4C', fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: '1.6' }}>
              La transacción fue rechazada, cancelada o no se pudo completar.
            </p>
            <p style={{ color: '#7A8E7B', fontSize: '0.95rem', marginBottom: '2rem' }}>
              No te preocupes, puedes intentar realizar el pago nuevamente desde la sección de reservas.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/')}
                style={{ background: '#fff', color: '#2C4A2E', border: '1.5px solid #2C4A2E', padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '500' }}
              >
                Ver cabañas
              </button>
              <button
                onClick={() => navigate('/mis-reservas')}
                style={{ background: '#2C4A2E', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '500' }}
              >
                Reintentar pago
              </button>
            </div>
          </div>
        )
    }
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF7F2', padding: '1rem' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '3rem', width: '100%', maxWidth: '550px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1px solid #ECE8E0' }}>
        {renderContenido()}
      </div>
    </div>
  )
}
