import { useEffect } from 'react'

/**
 * Componente SEO reutilizable para meta tags dinámicos por página.
 * Maneja title, description y Open Graph tags.
 */
export default function SEO({ titulo, descripcion, imagen, url }) {
  const siteName = 'Cabañas La Higuera Rapel'
  const tituloCompleto = titulo ? `${titulo} | ${siteName}` : siteName
  const desc = descripcion || 'Cabañas a orillas del Lago Rapel con piscina, tobogán, paseos en lancha y moto de agua. Reserva online tu estadía en El Manzano, Las Cabras.'
  const img = imagen || '/images/entorno.png'
  const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

  useEffect(() => {
    // Title
    document.title = tituloCompleto

    // Helper para crear/actualizar meta tags
    const setMeta = (attr, key, content) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    // Meta description
    setMeta('name', 'description', desc)

    // Open Graph
    setMeta('property', 'og:title', tituloCompleto)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:image', img)
    setMeta('property', 'og:url', pageUrl)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', siteName)

    // Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', tituloCompleto)
    setMeta('name', 'twitter:description', desc)
    setMeta('name', 'twitter:image', img)

  }, [tituloCompleto, desc, img, pageUrl])

  return null
}
