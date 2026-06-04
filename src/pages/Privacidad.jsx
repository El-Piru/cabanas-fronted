export default function Privacidad() {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '3rem auto',
      padding: '0 1.5rem 4rem',
      fontFamily: '"Outfit", sans-serif',
      color: '#4A5E4C',
      lineHeight: '1.6'
    }}>
      <h1 style={{
        fontFamily: '"Outfit", sans-serif',
        fontSize: 'clamp(2rem, 5vw, 2.5rem)',
        color: '#1A2E1B',
        marginBottom: '0.5rem',
        fontWeight: '600'
      }}>
        Política de Privacidad
      </h1>
      <p style={{ color: '#7A8E7B', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
        Última actualización: Junio 2026 · Cabañas La Higuera Rapel
      </p>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1A2E1B', fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.75rem' }}>
          1. Información que Recolectamos
        </h2>
        <p style={{ margin: '0 0 0.5rem' }}>
          Para la prestación de nuestros servicios de hospedaje y reservas en línea, solicitamos y procesamos los siguientes datos personales de nuestros usuarios:
        </p>
        <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
          <li><strong>Nombre Completo:</strong> Para identificar al titular de la reserva.</li>
          <li><strong>Correo Electrónico:</strong> Para enviar comprobantes de pago, confirmaciones de reserva y notificaciones importantes del servicio.</li>
          <li><strong>Número de Teléfono:</strong> Para mantener comunicación directa en caso de dudas o urgencias durante tu traslado o estadía.</li>
          <li><strong>Datos de Sesión:</strong> Usamos tokens locales y cookies seguras indispensables para mantener abierta tu sesión en la web.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1A2E1B', fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.75rem' }}>
          2. Finalidad del Uso de Datos
        </h2>
        <p style={{ margin: '0 0 0.5rem' }}>
          Tus datos se recogen exclusivamente para:
        </p>
        <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li>Procesar, agendar y confirmar de forma segura tus reservas en nuestras cabañas.</li>
          <li>Generar transacciones válidas mediante nuestro canal oficial integrado con Mercado Pago.</li>
          <li>Enviar correos informativos automáticos relativos a confirmaciones o anulaciones de tu estadía.</li>
          <li>Brindar soporte al cliente y resolver dudas rápidamente.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem', background: '#FAF6F0', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(44, 74, 46, 0.1)' }}>
        <h2 style={{ color: '#1A2E1B', fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.75rem' }}>
          3. Pasarela de Pago Seguro (Mercado Pago)
        </h2>
        <p style={{ margin: '0 0 0.5rem' }}>
          El procesamiento y cobro de tarjetas de crédito, débito o transferencias bancarias se realiza de manera 100% externa y encriptada a través de **Mercado Pago**.
        </p>
        <p style={{ margin: 0 }}>
          Cabañas La Higuera **nunca almacena, procesa ni tiene acceso a tus datos financieros** (tales como números de tarjetas de crédito o contraseñas bancarias). Tu información de pago está blindada bajo los estándares internacionales PCI-DSS manejados por Mercado Pago.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1A2E1B', fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.75rem' }}>
          4. Seguridad y Confidencialidad
        </h2>
        <p style={{ margin: 0 }}>
          Tus datos personales no son compartidos, vendidos ni transferidos a terceras empresas bajo ningún concepto. Tu información se almacena con medidas de encriptación de datos administradas por el servicio en la nube seguro de **Supabase**, protegiéndolos contra accesos no autorizados, pérdidas o adulteraciones.
        </p>
      </section>

      <section>
        <h2 style={{ color: '#1A2E1B', fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.75rem' }}>
          5. Tus Derechos
        </h2>
        <p style={{ margin: 0 }}>
          Como titular de los datos, tienes derecho en todo momento a solicitar la rectificación, actualización o eliminación completa de tu información de nuestra base de datos. Para ejercer este derecho, puedes contactar al administrador del recinto vía WhatsApp o enviando un correo con tu solicitud.
        </p>
      </section>
    </div>
  )
}
