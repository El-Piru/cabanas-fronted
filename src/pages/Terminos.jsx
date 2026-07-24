import SEO from '../components/SEO'
import styles from './Terminos.module.css'

export default function Terminos() {
  return (
    <div className={styles.container}>
      <SEO titulo="Términos y Condiciones" descripcion="Términos y condiciones de uso de Cabañas La Higuera Rapel." />
      <h1 className={styles.title}>
        Términos y Condiciones
      </h1>
      <p className={styles.subtitle}>
        Última actualización: Junio 2026 · Cabañas La Higuera Rapel
      </p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          1. Introducción y Aceptación
        </h2>
        <p className={styles.text}>
          Al realizar una reserva en nuestro sitio web o utilizar nuestras instalaciones, aceptas regirte por los siguientes Términos y Condiciones. Te solicitamos leerlos atentamente antes de planificar tu estadía.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          2. Horarios de Entrada y Salida (Check-in / Check-out)
        </h2>
        <ul className={styles.list}>
          <li><strong>Check-in (Entrada):</strong> A partir de las <strong>10:00 am</strong> del día de reserva.</li>
          <li><strong>Check-out (Salida):</strong> Hasta las <strong>7:00 pm (19:00 hrs)</strong> del día de salida.</li>
        </ul>
        <p className={styles.text}>
          Respetar estos horarios nos permite mantener las instalaciones limpias, sanitizadas y preparadas de manera óptima para el próximo huésped.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          3. Políticas de Pago y Reserva
        </h2>
        <p className={styles.textSpacing}>
          Para garantizar y confirmar al 100% tu reserva, el pago total de la estadía debe ser procesado de manera exitosa a través de nuestro portal seguro de Mercado Pago integrado en el sitio.
        </p>
        <p className={styles.text}>
          Las tarifas se expresan en Pesos Chilenos (CLP) e incluyen el acceso a la cabaña asignada y el uso de las instalaciones comunes permitidas según el tipo de reserva.
        </p>
      </section>

      <section id="politica-cancelacion" className={styles.sectionHighlighted}>
        <h2 className={styles.sectionTitle}>
          4. Políticas de Cancelación y Reembolsos
        </h2>
        <p className={styles.textSpacingLarge}>
          Entendemos que los imprevistos ocurren. Nuestras políticas de anulación son las siguientes:
        </p>
        <ul className={styles.listFlexLarge}>
          <li><strong>Anulaciones con más de 7 días de anticipación:</strong> Devolución del <strong>90%</strong> de la tarifa pagada (el 10% restante cubre costos de pasarelas de pago y gestiones operacionales).</li>
          <li><strong>Anulaciones entre 3 y 7 días de anticipación:</strong> Derecho a reprogramar tu estadía sujeto a disponibilidad, o devolución del <strong>50%</strong> del pago total.</li>
          <li><strong>Anulaciones con menos de 72 horas de anticipación:</strong> No se realizan reembolsos ni reprogramaciones de fecha, considerándose el total como indemnización por la reserva bloqueada.</li>
        </ul>
        <p className={styles.textSmall}>
          * Las solicitudes de cancelación o reprogramación deben ser enviadas vía WhatsApp o correo electrónico para mantener un registro formal.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          5. Normas de Convivencia y Seguridad en el Lago
        </h2>
        <ul className={styles.listFlex}>
          <li><strong>Uso de Kayaks y Botes:</strong> El uso de chaleco salvavidas es de carácter <strong>estrictamente obligatorio</strong>. Cabañas La Higuera no se hace responsable por accidentes derivados del no cumplimiento de esta regla.</li>
          <li><strong>Paseos en Lancha:</strong> Se coordinan previamente con el administrador y están sujetos a condiciones meteorológicas óptimas.</li>
          <li><strong>Respeto al Entorno:</strong> Queda prohibido arrojar basura o residuos al Lago Rapel o a las áreas verdes del recinto. Usa los contenedores habilitados.</li>
          <li><strong>Ruidos Molestos:</strong> Por respeto al descanso de los demás huéspedes, se solicita mantener silencio y música a volumen moderado después de las <strong>11:00 pm</strong>.</li>
        </ul>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>
          6. Responsabilidades
        </h2>
        <p className={styles.text}>
          El cliente se compromete a entregar la cabaña en las mismas condiciones higiénicas y de conservación en que la recibió. Cualquier daño estructural o pérdida de equipamiento del recinto será responsabilidad del titular de la reserva y deberá ser compensado antes de su salida.
        </p>
      </section>
    </div>
  )
}
