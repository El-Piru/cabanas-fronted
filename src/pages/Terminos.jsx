export default function Terminos() {
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
        Términos y Condiciones
      </h1>
      <p style={{ color: '#7A8E7B', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
        Última actualización: Junio 2026 · Cabañas La Higuera Rapel
      </p>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1A2E1B', fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.75rem' }}>
          1. Introducción y Aceptación
        </h2>
        <p style={{ margin: 0 }}>
          Al realizar una reserva en nuestro sitio web o utilizar nuestras instalaciones, aceptas regirte por los siguientes Términos y Condiciones. Te solicitamos leerlos atentamente antes de planificar tu estadía.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1A2E1B', fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.75rem' }}>
          2. Horarios de Entrada y Salida (Check-in / Check-out)
        </h2>
        <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
          <li><strong>Check-in (Entrada):</strong> A partir de las <strong>10:00 am</strong> del día de reserva.</li>
          <li><strong>Check-out (Salida):</strong> Hasta las <strong>7:00 pm (19:00 hrs)</strong> del día de salida.</li>
        </ul>
        <p style={{ margin: 0 }}>
          Respetar estos horarios nos permite mantener las instalaciones limpias, sanitizadas y preparadas de manera óptima para el próximo huésped.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1A2E1B', fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.75rem' }}>
          3. Políticas de Pago y Reserva
        </h2>
        <p style={{ margin: '0 0 0.5rem' }}>
          Para garantizar y confirmar al 100% tu reserva, el pago total de la estadía debe ser procesado de manera exitosa a través de nuestro portal seguro de Mercado Pago integrado en el sitio.
        </p>
        <p style={{ margin: 0 }}>
          Las tarifas se expresan en Pesos Chilenos (CLP) e incluyen el acceso a la cabaña asignada y el uso de las instalaciones comunes permitidas según el tipo de reserva.
        </p>
      </section>

      <section style={{ marginBottom: '2rem', background: '#FAF6F0', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(44, 74, 46, 0.1)' }}>
        <h2 style={{ color: '#1A2E1B', fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.75rem' }}>
          4. Políticas de Cancelación y Reembolsos
        </h2>
        <p style={{ margin: '0 0 1rem' }}>
          Entendemos que los imprevistos ocurren. Nuestras políticas de anulación son las siguientes:
        </p>
        <ul style={{ paddingLeft: '1.5rem', margin: '0 0 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li><strong>Anulaciones con más de 7 días de anticipación:</strong> Devolución del <strong>90%</strong> de la tarifa pagada (el 10% restante cubre costos de pasarelas de pago y gestiones operacionales).</li>
          <li><strong>Anulaciones entre 3 y 7 días de anticipación:</strong> Derecho a reprogramar tu estadía sujeto a disponibilidad, o devolución del <strong>50%</strong> del pago total.</li>
          <li><strong>Anulaciones con menos de 72 horas de anticipación:</strong> No se realizan reembolsos ni reprogramaciones de fecha, considerándose el total como indemnización por la reserva bloqueada.</li>
        </ul>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#7A8E7B' }}>
          * Las solicitudes de cancelación o reprogramación deben ser enviadas vía WhatsApp o correo electrónico para mantener un registro formal.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1A2E1B', fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.75rem' }}>
          5. Normas de Convivencia y Seguridad en el Lago
        </h2>
        <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li><strong>Uso de Kayaks y Botes:</strong> El uso de chaleco salvavidas es de carácter <strong>estrictamente obligatorio</strong>. Cabañas La Higuera no se hace responsable por accidentes derivados del no cumplimiento de esta regla.</li>
          <li><strong>Paseos en Lancha:</strong> Se coordinan previamente con el administrador y están sujetos a condiciones meteorológicas óptimas.</li>
          <li><strong>Respeto al Entorno:</strong> Queda prohibido arrojar basura o residuos al Lago Rapel o a las áreas verdes del recinto. Usa los contenedores habilitados.</li>
          <li><strong>Ruidos Molestos:</strong> Por respeto al descanso de los demás huéspedes, se solicita mantener silencio y música a volumen moderado después de las <strong>11:00 pm</strong>.</li>
        </ul>
      </section>

      <section>
        <h2 style={{ color: '#1A2E1B', fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.75rem' }}>
          6. Responsabilidades
        </h2>
        <p style={{ margin: 0 }}>
          El cliente se compromete a entregar la cabaña en las mismas condiciones higiénicas y de conservación en que la recibió. Cualquier daño estructural o pérdida de equipamiento del recinto será responsabilidad del titular de la reserva y deberá ser compensado antes de su salida.
        </p>
      </section>
    </div>
  )
}
