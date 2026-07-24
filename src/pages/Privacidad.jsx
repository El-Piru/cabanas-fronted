import SEO from '../components/SEO'
import styles from './Privacidad.module.css'

export default function Privacidad() {
  return (
    <div className={styles.container}>
      <SEO titulo="Política de Privacidad" descripcion="Política de privacidad y protección de datos de Cabañas La Higuera Rapel." />
      <h1 className={styles.title}>
        Política de Privacidad
      </h1>
      <p className={styles.subtitle}>
        Última actualización: Junio 2026 · Cabañas La Higuera Rapel
      </p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          1. Información que Recolectamos
        </h2>
        <p className={styles.text}>
          Para la prestación de nuestros servicios de hospedaje y reservas en línea, solicitamos y procesamos los siguientes datos personales de nuestros usuarios:
        </p>
        <ul className={styles.list}>
          <li><strong>Nombre Completo:</strong> Para identificar al titular de la reserva.</li>
          <li><strong>Correo Electrónico:</strong> Para enviar comprobantes de pago, confirmaciones de reserva y notificaciones importantes del servicio.</li>
          <li><strong>Número de Teléfono:</strong> Para mantener comunicación directa en caso de dudas o urgencias durante tu traslado o estadía.</li>
          <li><strong>Datos de Sesión:</strong> Usamos tokens locales y cookies seguras indispensables para mantener abierta tu sesión en la web.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          2. Finalidad del Uso de Datos
        </h2>
        <p className={styles.text}>
          Tus datos se recogen exclusivamente para:
        </p>
        <ul className={styles.listFlex}>
          <li>Procesar, agendar y confirmar de forma segura tus reservas en nuestras cabañas.</li>
          <li>Generar transacciones válidas mediante nuestro canal oficial integrado con Mercado Pago.</li>
          <li>Enviar correos informativos automáticos relativos a confirmaciones o anulaciones de tu estadía.</li>
          <li>Brindar soporte al cliente y resolver dudas rápidamente.</li>
        </ul>
      </section>

      <section className={styles.sectionHighlighted}>
        <h2 className={styles.sectionTitle}>
          3. Pasarela de Pago Seguro (Mercado Pago)
        </h2>
        <p className={styles.text}>
          El procesamiento y cobro de tarjetas de crédito, débito o transferencias bancarias se realiza de manera 100% externa y encriptada a través de **Mercado Pago**.
        </p>
        <p className={styles.textNoMargin}>
          Cabañas La Higuera **nunca almacena, procesa ni tiene acceso a tus datos financieros** (tales como números de tarjetas de crédito o contraseñas bancarias). Tu información de pago está blindada bajo los estándares internacionales PCI-DSS manejados por Mercado Pago.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          4. Seguridad y Confidencialidad
        </h2>
        <p className={styles.textNoMargin}>
          Tus datos personales no son compartidos, vendidos ni transferidos a terceras empresas bajo ningún concepto. Tu información se almacena con medidas de encriptación de datos administradas por el servicio en la nube seguro de **Supabase**, protegiéndolos contra accesos no autorizados, pérdidas o adulteraciones.
        </p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>
          5. Tus Derechos
        </h2>
        <p className={styles.textNoMargin}>
          Como titular de los datos, tienes derecho en todo momento a solicitar la rectificación, actualización o eliminación completa de tu información de nuestra base de datos. Para ejercer este derecho, puedes contactar al administrador del recinto vía WhatsApp o enviando un correo con tu solicitud.
        </p>
      </section>
    </div>
  )
}
