import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BASE_URL } from '../api'
import SEO from '../components/SEO'
import styles from './Admin.module.css'

const formatDateSafe = (dateVal) => {
  if (!dateVal) return 'N/A'
  const d = new Date(dateVal)
  return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString('es-CL')
}

export default function Admin() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('calendario')
  const [reservas, setReservas] = useState([])
  const [cabanas, setCabanas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [nuevaCabana, setNuevaCabana] = useState({ nombre: '', descripcion: '', precio: '', capacidad: '', imagen: '' })
  
  // Estados para el Calendario
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedReserva, setSelectedReserva] = useState(null)
  
  // Estados para el Modal de Reserva Manual
  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState({
    cabanaId: '',
    llegada: '',
    salida: '',
    nombreCliente: '',
    emailCliente: '',
    telefonoCliente: '',
    esBloqueo: false
  })
  const { token, esAdmin, cargandoAuth, logout } = useAuth()

  const [msg, setMsg] = useState('')
  const [modalMsg, setModalMsg] = useState('')

  const getHeaders = () => ({
    'Authorization': `Bearer ${token || localStorage.getItem('token')}`, 
    'Content-Type': 'application/json' 
  })

  useEffect(() => {
    if (cargandoAuth) return
    if (!esAdmin) {
      navigate('/login')
      return
    }
    cargarDatos()

    // Polling automático cada 15 segundos para actualizar el calendario y lista en tiempo real
    const interval = setInterval(() => {
      cargarDatos()
    }, 15000)

    return () => clearInterval(interval)
  }, [esAdmin, cargandoAuth])

  const cargarDatos = async () => {
    try {
      const headers = getHeaders()
      const [resRes, resCab, resUsu] = await Promise.all([
        fetch(`${BASE_URL}/admin/reservas`, { headers, credentials: 'include' }),
        fetch(`${BASE_URL}/admin/cabanas`, { headers, credentials: 'include' }),
        fetch(`${BASE_URL}/admin/usuarios`, { headers, credentials: 'include' }),
      ])

      if (resRes.status === 401 || resCab.status === 401 || resUsu.status === 401) {
        console.warn('Sesión expirada o token inválido. Redirigiendo al login...');
        await logout()
        navigate('/login')
        return
      }

      const r1 = await resRes.json()
      const r2 = await resCab.json()
      const r3 = await resUsu.json()

      if (r1 && r1.ok && Array.isArray(r1.data)) setReservas(r1.data)
      if (r2 && r2.ok && Array.isArray(r2.data)) setCabanas(r2.data)
      if (r3 && r3.ok && Array.isArray(r3.data)) setUsuarios(r3.data)
    } catch (error) {
      console.error('Error al cargar datos del administrador:', error)
    }
  }
  const [editandoFechas, setEditandoFechas] = useState(false)
  const [nuevasFechas, setNuevasFechas] = useState({ llegada: '', salida: '' })
  const [mostrarCanceladas, setMostrarCanceladas] = useState(false)

  const cancelarReserva = async (id) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return
    const res = await fetch(`${BASE_URL}/admin/reservas/${id}/cancelar`, { method: 'PUT', headers: getHeaders(), credentials: 'include' }).then(r => r.json())
    if (res.ok) {
      setSelectedReserva(null)
      cargarDatos()
    }
  }

  const confirmarReservaManual = async (id) => {
    if (!confirm('¿Deseas confirmar manualmente esta reserva y marcarla como PAGADA?')) return
    try {
      const res = await fetch(`${BASE_URL}/admin/reservas/${id}/confirmar`, { method: 'PUT', headers: getHeaders(), credentials: 'include' }).then(r => r.json())
      if (res.ok) {
        alert('Reserva confirmada con éxito. Se envió el correo de confirmación al cliente.')
        setSelectedReserva(null)
        cargarDatos()
      } else {
        alert(res.mensaje || 'Error al confirmar la reserva.')
      }
    } catch (err) {
      console.error(err)
      alert('Error de conexión al confirmar la reserva.')
    }
  }

  const handleGuardarNuevasFechas = async () => {
    if (!nuevasFechas.llegada || !nuevasFechas.salida) {
      alert('Por favor selecciona ambas fechas (Entrada y Salida).')
      return
    }
    try {
      const res = await fetch(`${BASE_URL}/admin/reservas/${selectedReserva.id}/cambiar-fechas`, {
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(nuevasFechas)
      }).then(r => r.json())

      if (res.ok) {
        alert('Fechas de reserva actualizadas exitosamente.')
        setEditandoFechas(false)
        setSelectedReserva(null)
        cargarDatos()
      } else {
        alert(res.mensaje || 'Error al actualizar las fechas.')
      }
    } catch (err) {
      console.error(err)
      alert('Error de conexión al servidor.')
    }
  }

  const [enviandoEmailId, setEnviandoEmailId] = useState(null)

  const reenviarComprobanteAdmin = async (id) => {
    if (enviandoEmailId === id) return
    setEnviandoEmailId(id)
    try {
      const res = await fetch(`${BASE_URL}/admin/reservas/${id}/reenviar-email`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include'
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok && data.ok) {
        alert('✅ Confirmación enviada exitosamente por correo.')
      } else {
        alert(data.mensaje || 'No se pudo enviar la confirmación. Intenta en unos segundos.')
      }
    } catch (err) {
      console.error(err)
      alert('Error de red al conectar con el servidor.')
    } finally {
      setEnviandoEmailId(null)
    }
  }

  const crearCabana = async () => {
    const res = await fetch(`${BASE_URL}/admin/cabanas`, { method: 'POST', headers: getHeaders(), credentials: 'include', body: JSON.stringify(nuevaCabana) }).then(r => r.json())
    if (res.ok) { setMsg('Cabaña creada'); cargarDatos(); setNuevaCabana({ nombre: '', descripcion: '', precio: '', capacidad: '', imagen: '' }) }
    else setMsg(res.mensaje)
  }

  const eliminarCabana = async (id) => {
    if (!confirm('¿Eliminar esta cabaña?')) return
    await fetch(`${BASE_URL}/admin/cabanas/${id}`, { method: 'DELETE', headers: getHeaders(), credentials: 'include' })
    cargarDatos()
  }

  const handleCrearReservaManual = async (e) => {
    e.preventDefault()
    setModalMsg('')
    const { cabanaId, llegada, salida, nombreCliente, emailCliente, telefonoCliente, esBloqueo } = modalData
    
    if (!cabanaId || !llegada || !salida) {
      setModalMsg('Por favor llena los campos requeridos.')
      return
    }

    try {
      const res = await fetch(`${BASE_URL}/admin/reservas/manual`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          cabanaId: parseInt(cabanaId),
          llegada,
          salida,
          nombreCliente: esBloqueo ? 'Mantenimiento' : nombreCliente,
          emailCliente: esBloqueo ? 'mantenimiento@cabanaslahiguera.cl' : emailCliente,
          telefonoCliente: esBloqueo ? '' : telefonoCliente,
          esBloqueo
        })
      }).then(r => r.json())

      if (res.ok) {
        cargarDatos()
        setShowModal(false)
        setModalData({
          cabanaId: '',
          llegada: '',
          salida: '',
          nombreCliente: '',
          emailCliente: '',
          telefonoCliente: '',
          esBloqueo: false
        })
      } else {
        setModalMsg(res.mensaje || 'Error al guardar la reserva')
      }
    } catch (err) {
      console.error(err)
      setModalMsg('Error de red al conectar con el servidor.')
    }
  }

  const exportarExcel = () => {
    const columnas = ["ID Reserva", "Cabaña", "Cliente", "Email Cliente", "Fecha Entrada", "Fecha Salida", "Noches", "Total Tarifa", "Estado", "Fecha de Compra"]
    const filas = reservas.map(r => {
      const d1 = new Date(r.llegada)
      const d2 = new Date(r.salida)
      const noches = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24))
      const estadoFormateado = r.estado === 'confirmada' ? 'Pagada / Confirmada' : r.estado === 'pendiente' ? 'Pendiente de Pago' : r.estado === 'cancelada' ? 'Cancelada' : 'Mantenimiento'
      return [
        r.id,
        r.cabana?.nombre || 'N/A',
        r.usuario?.nombre || 'N/A',
        r.usuario?.email || 'N/A',
        d1.toLocaleDateString('es-CL'),
        d2.toLocaleDateString('es-CL'),
        noches,
        r.total,
        estadoFormateado,
        new Date(r.createdAt).toLocaleDateString('es-CL')
      ]
    })

    const contenidoCsv = [columnas, ...filas].map(fila => fila.join(";")).join("\n")
    const blob = new Blob(["\ufeff" + contenidoCsv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    const fechaActual = new Date().toISOString().split('T')[0]
    link.setAttribute("href", url)
    link.setAttribute("download", `reporte_reservas_${fechaActual}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Cálculos de Calendario
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const diasArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const mesesNombres = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

  const cambiarMes = (offset) => {
    setSelectedReserva(null)
    setCurrentDate(new Date(year, month + offset, 1))
  }

  const esFinDeSemana = (dia) => {
    const dayOfWeek = new Date(year, month, dia).getDay()
    return dayOfWeek === 0 || dayOfWeek === 6 // 0=Domingo, 6=Sábado
  }

  const getNombreDiaSemana = (dia) => {
    const dayOfWeek = new Date(year, month, dia).getDay()
    return ["D", "L", "M", "M", "J", "V", "S"][dayOfWeek]
  }

const parseLocalDate = (dateVal) => {
  if (!dateVal) return null
  if (typeof dateVal === 'string' && dateVal.includes('T')) {
    const parts = dateVal.split('T')[0].split('-')
    if (parts.length === 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 0, 0, 0, 0)
    }
  }
  const d = new Date(dateVal)
  if (isNaN(d.getTime())) return null
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
}

  const getReservaDelDia = (cabanaId, dia) => {
    const checkDate = new Date(year, month, dia, 0, 0, 0, 0)
    
    return (reservas || []).find(r => {
      if (!r || r.estado?.toLowerCase() === 'cancelada') return false
      
      const rCabId = r.cabanaId || r.cabana?.id
      if (String(rCabId) !== String(cabanaId)) return false
      
      const llegada = parseLocalDate(r.llegada)
      const salida = parseLocalDate(r.salida)
      if (!llegada || !salida) return false
      
      return checkDate >= llegada && checkDate < salida
    })
  }

  const openModalParaCrear = (cabanaId = '', dia = null) => {
    setModalMsg('')
    let llegadaStr = ''
    let salidaStr = ''
    
    if (dia) {
      const d1 = new Date(year, month, dia)
      const d2 = new Date(year, month, dia + 1)
      llegadaStr = d1.toISOString().split('T')[0]
      salidaStr = d2.toISOString().split('T')[0]
    }

    setModalData({
      cabanaId: String(cabanaId),
      llegada: llegadaStr,
      salida: salidaStr,
      nombreCliente: '',
      emailCliente: '',
      telefonoCliente: '',
      esBloqueo: false
    })
    setShowModal(true)
  }

  // Estadísticas rápidas
  const reservasArray = Array.isArray(reservas) ? reservas : []
  const cabanasArray = Array.isArray(cabanas) ? cabanas : []
  const usuariosArray = Array.isArray(usuarios) ? usuarios : []

  const reservasConfirmadas = reservasArray.filter(r => r && r.estado === 'confirmada')
  const ingresoTotal = reservasConfirmadas.reduce((acc, r) => acc + (r.total || 0), 0)
  const reservasHoy = reservasConfirmadas.filter(r => {
    if (!r || !r.createdAt) return false
    const hoy = new Date().toDateString()
    return new Date(r.createdAt).toDateString() === hoy
  })

  const getBadgeStyle = (estado) => ({
    background: estado === 'confirmada' ? '#D1FAE5' : estado === 'mantenimiento' ? '#E5E7EB' : estado === 'cancelada' ? '#FEE2E2' : '#FEF3C7',
    color: estado === 'confirmada' ? '#065F46' : estado === 'mantenimiento' ? '#374151' : estado === 'cancelada' ? '#991B1B' : '#92400E'
  })

  const getThDayStyle = (isWeekend) => ({
    background: isWeekend ? '#E8E4DC' : '#FAF8F5'
  })

  const getTdDayStyle = (isWeekend, cellStyle) => ({
    background: cellStyle.background || (isWeekend ? '#FCFAF7' : '#fff'),
    ...(cellStyle.opacity ? { opacity: cellStyle.opacity } : {}),
    ...(cellStyle.cursor ? { cursor: cellStyle.cursor } : {})
  })

  if (cargandoAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <SEO titulo="Panel de Administración" descripcion="Panel de administración de Cabañas La Higuera Rapel." />
      <h1 className={styles.pageTitle}>Panel de Administrador</h1>
      <p className={styles.pageSubtitle}>Gestiona reservas, cabañas y bloqueos de fechas</p>

      {/* Tarjetas de Estadísticas */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard} style={{ background: '#2C4A2E' }}>
          <div className={styles.statLabel}>Total reservas</div>
          <div className={styles.statValue}>{reservasConfirmadas.length}</div>
        </div>
        <div className={styles.statCard} style={{ background: '#C8860A' }}>
          <div className={styles.statLabel}>Ingresos totales</div>
          <div className={styles.statValue}>${ingresoTotal.toLocaleString('es-CL')}</div>
        </div>
        <div className={styles.statCard} style={{ background: '#1A6B8A' }}>
          <div className={styles.statLabel}>Cabañas activas</div>
          <div className={styles.statValue}>{cabanasArray.length}</div>
        </div>
        <div className={styles.statCard} style={{ background: '#5A3E28' }}>
          <div className={styles.statLabel}>Reservas hoy</div>
          <div className={styles.statValue}>{reservasHoy.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {[
          { key: 'calendario', label: '📅 Calendario de Ocupación', count: null },
          { key: 'reservas', label: '📋 Lista de Reservas', count: reservas.length },
          { key: 'cabanas', label: '🏕️ Cabañas', count: cabanas.length },
          { key: 'usuarios', label: '👥 Usuarios', count: usuarios.length }
        ].map(t => (
          <button key={t.key} className={tab === t.key ? styles.tabActive : styles.tab} onClick={() => setTab(t.key)}>
            {t.label} {t.count !== null ? `(${t.count})` : ''}
          </button>
        ))}
      </div>

      {/* CONTENIDO TAB: CALENDARIO */}
      {tab === 'calendario' && (
        <div>
          {/* Controles de fecha y mes */}
          <div className={styles.monthControls}>
            <div className={styles.monthNav}>
              <button onClick={() => cambiarMes(-1)} className={styles.monthBtn}>◀ Ant</button>
              <h2 className={styles.monthName}>
                {mesesNombres[month]} {year}
              </h2>
              <button onClick={() => cambiarMes(1)} className={styles.monthBtn}>Sig ▶</button>
            </div>
            <button 
              onClick={() => openModalParaCrear()} 
              className={styles.actionBtn}
            >
              ➕ Crear Reserva / Bloquear Fechas
            </button>
          </div>

          {/* Contenedor del Timeline del Calendario */}
          <div className={styles.calendarWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.thSticky}>Cabaña</th>
                  {diasArray.map(d => (
                    <th key={d} className={styles.thDay} style={getThDayStyle(esFinDeSemana(d))}>
                      <div>{d}</div>
                      <div style={{ fontSize: '0.65rem', opacity: 0.6, marginTop: '2px' }}>{getNombreDiaSemana(d)}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cabanas.map(c => (
                  <tr key={c.id}>
                    <td className={styles.tdSticky}>{c.nombre}</td>
                    {diasArray.map(d => {
                      const res = getReservaDelDia(c.id, d)
                      
                      let cellStyle = {}
                      let titleStr = `Hacer clic para registrar reserva en ${c.nombre} (Entrada: ${d} de ${mesesNombres[month]})`
                      
                      if (res) {
                        const isMaint = res.estado === 'mantenimiento'
                        const isPend = res.estado === 'pendiente'
                        
                        cellStyle = {
                          background: isMaint ? '#9CA3AF' : isPend ? '#FCD34D' : '#10B981',
                          opacity: 0.85,
                          cursor: 'pointer'
                        }
                        
                        if (isMaint) {
                          titleStr = `BLOQUEADO POR MANTENIMIENTO\nDesde: ${formatDateSafe(res.llegada)}\nHasta: ${formatDateSafe(res.salida)}`
                        } else {
                          titleStr = `Reserva #${res.id}\nCliente: ${res.usuario?.nombre || 'Desconocido'}\nEmail: ${res.usuario?.email || 'N/A'}\nTel: ${res.usuario?.telefono || 'Sin tel.'}\nDesde: ${formatDateSafe(res.llegada)}\nHasta: ${formatDateSafe(res.salida)}\nTotal: $${(res.total || 0).toLocaleString('es-CL')}`
                        }
                      }
                      
                      return (
                        <td 
                          key={d} 
                          title={titleStr}
                          onClick={() => {
                            if (res) {
                              setSelectedReserva(res)
                            } else {
                              setSelectedReserva(null)
                              openModalParaCrear(c.id, d)
                            }
                          }}
                          className={styles.tdDay}
                          style={getTdDayStyle(esFinDeSemana(d), cellStyle)}
                        />
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Leyenda de Colores */}
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <div className={styles.legendBox} style={{ background: '#10B981' }}></div>
              <span>Confirmada / Pago Aprobado</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendBox} style={{ background: '#FCD34D' }}></div>
              <span>Pendiente de Pago (Mercado Pago)</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendBox} style={{ background: '#9CA3AF' }}></div>
              <span>Bloqueado por Mantenimiento</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendBox} style={{ background: '#fff', border: '1px solid #ECE8E0' }}></div>
              <span>Disponible</span>
            </div>
          </div>

          {/* MODAL: DETALLE DE RESERVA */}
          {selectedReserva && (
            <div className={styles.overlay}>
              <div className={styles.modal}>
                <div className={styles.modalHeader}>
                  <h3 className={styles.modalTitle}>
                    {selectedReserva.estado === 'mantenimiento' ? '🔧 Bloqueo por Mantenimiento' : '📋 Detalle de Reserva'}
                  </h3>
                  <button 
                    onClick={() => setSelectedReserva(null)}
                    className={styles.closeBtn}
                  >
                    ✕
                  </button>
                </div>

                <div className={styles.modalContent}>
                  <div><strong>ID Reserva:</strong> #{selectedReserva.id}</div>
                  <div><strong>Cabaña:</strong> {selectedReserva.cabana?.nombre}</div>
                  <div>
                    <strong>Estado:</strong>{' '}
                    <span className={styles.badge} style={getBadgeStyle(selectedReserva.estado)}>
                      {selectedReserva.estado === 'confirmada' ? 'Confirmada / Aprobada' : selectedReserva.estado === 'mantenimiento' ? 'Mantenimiento' : 'Pendiente de Pago'}
                    </span>
                  </div>
                  <div><strong>Fecha Entrada:</strong> {formatDateSafe(selectedReserva.llegada)}</div>
                  <div><strong>Fecha Salida:</strong> {formatDateSafe(selectedReserva.salida)}</div>
                  {editandoFechas && (
                    <div style={{ background: '#FAF8F5', padding: '14px', borderRadius: '10px', border: '1.5px solid #204C72', margin: '12px 0' }}>
                      <div style={{ fontWeight: '600', marginBottom: '8px', color: '#1A2E1B', fontSize: '0.9rem' }}>Modificar Cabaña y Fechas de Reserva:</div>
                      
                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#4A5E4C', marginBottom: '4px' }}>Cabaña Asignada</label>
                        <select 
                          value={nuevasFechas.cabanaId} 
                          onChange={e => setNuevasFechas({ ...nuevasFechas, cabanaId: e.target.value })}
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontFamily: 'inherit', fontWeight: '600' }}
                        >
                          {cabanasArray.map(c => (
                            <option key={c.id} value={c.id}>
                              {c.nombre} ({c.capacidad} personas) — ${c.precio?.toLocaleString('es-CL')}/noche
                            </option>
                          ))}
                        </select>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#4A5E4C', marginBottom: '4px' }}>Nueva Entrada</label>
                          <input 
                            type="date" 
                            value={nuevasFechas.llegada} 
                            onChange={e => setNuevasFechas({ ...nuevasFechas, llegada: e.target.value })} 
                            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ccc', fontFamily: 'inherit' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#4A5E4C', marginBottom: '4px' }}>Nueva Salida</label>
                          <input 
                            type="date" 
                            value={nuevasFechas.salida} 
                            onChange={e => setNuevasFechas({ ...nuevasFechas, salida: e.target.value })} 
                            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ccc', fontFamily: 'inherit' }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={handleGuardarNuevasFechas} 
                          style={{ background: '#2C4A2E', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
                        >
                          💾 Guardar Cambios
                        </button>
                        <button 
                          onClick={() => setEditandoFechas(false)} 
                          style={{ background: '#E5E7EB', color: '#374151', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                  {selectedReserva.estado !== 'mantenimiento' && (
                    <>
                      <div><strong>Total Tarifa:</strong> ${selectedReserva.total?.toLocaleString('es-CL')}</div>
                      <hr className={styles.divider} />
                      <div><strong>Huésped:</strong> {selectedReserva.usuario?.nombre}</div>
                      <div><strong>Email:</strong> {selectedReserva.usuario?.email}</div>
                      <div><strong>Teléfono:</strong> {selectedReserva.usuario?.telefono || 'N/A'}</div>
                    </>
                  )}
                </div>

                <div className={styles.modalActions}>
                  {selectedReserva.estado !== 'cancelada' && !editandoFechas && (
                    <button 
                      onClick={() => {
                        const lleg = new Date(selectedReserva.llegada).toISOString().split('T')[0]
                        const sal = new Date(selectedReserva.salida).toISOString().split('T')[0]
                        setNuevasFechas({ 
                          llegada: lleg, 
                          salida: sal, 
                          cabanaId: String(selectedReserva.cabanaId || selectedReserva.cabana?.id || '') 
                        })
                        setEditandoFechas(true)
                      }} 
                      style={{ background: '#204C72', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                    >
                      ✏️ Cambiar Cabaña / Fechas
                    </button>
                  )}
                  {selectedReserva.estado !== 'confirmada' && selectedReserva.estado !== 'mantenimiento' && (
                    <button 
                      onClick={() => confirmarReservaManual(selectedReserva.id)} 
                      className={styles.successBtn || styles.secondaryBtn}
                      style={{ background: '#065F46', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                    >
                      ✅ Marcar como Pagada / Confirmar
                    </button>
                  )}
                  {selectedReserva.estado !== 'mantenimiento' && (
                    <button 
                      type="button"
                      disabled={enviandoEmailId === selectedReserva.id}
                      onClick={() => reenviarComprobanteAdmin(selectedReserva.id)} 
                      style={{ 
                        background: enviandoEmailId === selectedReserva.id ? '#9CA3AF' : '#1A6B8A', 
                        color: '#fff', 
                        border: 'none', 
                        padding: '10px 18px', 
                        borderRadius: '8px', 
                        cursor: enviandoEmailId === selectedReserva.id ? 'wait' : 'pointer', 
                        fontWeight: '600' 
                      }}
                    >
                      {enviandoEmailId === selectedReserva.id ? '⏳ Enviando correo...' : '📩 Enviar Confirmación'}
                    </button>
                  )}
                  {selectedReserva.estado !== 'cancelada' && (
                    <button 
                      onClick={() => cancelarReserva(selectedReserva.id)} 
                      className={styles.dangerBtn}
                    >
                      🚫 Liberar Fechas / Cancelar
                    </button>
                  )}
                  <button 
                    onClick={() => setSelectedReserva(null)}
                    className={styles.secondaryBtn}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CONTENIDO TAB: RESERVAS */}
      {tab === 'reservas' && (() => {
        const reservasFiltradas = reservasArray.filter(r => {
          if (!mostrarCanceladas && r.estado === 'cancelada') return false
          return true
        })

        return (
          <div>
            <div className={styles.exportWrapper} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <button 
                onClick={exportarExcel} 
                disabled={reservasFiltradas.length === 0}
                className={styles.exportBtn}
              >
                📥 Exportar a Excel (.csv)
              </button>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer', color: '#4A5E4C', fontWeight: '600' }}>
                <input 
                  type="checkbox" 
                  checked={mostrarCanceladas} 
                  onChange={e => setMostrarCanceladas(e.target.checked)} 
                  style={{ accentColor: '#2C4A2E', width: '16px', height: '16px' }}
                />
                Mostrar también reservas canceladas
              </label>
            </div>

            {reservasFiltradas.length === 0 && <p className={styles.emptyText}>No hay reservas pendientes ni pagadas activas.</p>}
            {reservasFiltradas.map(r => (
              <div key={r.id} className={styles.card}>
                <div className={styles.flexBetween}>
                  <div>
                    <strong>{r.cabana?.nombre}</strong> — {r.usuario?.nombre} ({r.usuario?.email})
                    <div className={styles.subText}>
                      Llegada: {formatDateSafe(r.llegada)} → Salida: {formatDateSafe(r.salida)}
                    </div>
                    <div className={styles.subText2}>
                      Reservado el: {formatDateSafe(r.createdAt)}
                    </div>
                    {r.usuario?.telefono && (
                      <div className={styles.subText2}>
                        Teléfono: {r.usuario?.telefono}
                      </div>
                    )}
                    <div className={styles.badgeRow}>
                      <span className={styles.badge} style={getBadgeStyle(r.estado)}>
                        {r.estado === 'confirmada' ? 'Pagada / Confirmada' : r.estado === 'pendiente' ? 'Pendiente de Pago' : r.estado === 'cancelada' ? 'Cancelada' : 'Mantenimiento'}
                      </span>
                      <span className={styles.priceValue}>${r.total?.toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {r.estado !== 'confirmada' && r.estado !== 'mantenimiento' && (
                      <button 
                        onClick={() => confirmarReservaManual(r.id)} 
                        style={{ background: '#065F46', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}
                      >
                        ✅ Aprobar / Confirmar Pago
                      </button>
                    )}
                    <button 
                      type="button"
                      disabled={enviandoEmailId === r.id}
                      onClick={() => reenviarComprobanteAdmin(r.id)} 
                      style={{ 
                        background: enviandoEmailId === r.id ? '#9CA3AF' : '#1A6B8A', 
                        color: '#fff', 
                        border: 'none', 
                        padding: '6px 12px', 
                        borderRadius: '6px', 
                        cursor: enviandoEmailId === r.id ? 'wait' : 'pointer', 
                        fontSize: '0.8rem', 
                        fontWeight: '600' 
                      }}
                    >
                      {enviandoEmailId === r.id ? '⏳ Enviando...' : '📩 Enviar Confirmación'}
                    </button>
                    {r.estado !== 'cancelada' && (
                      <button onClick={() => cancelarReserva(r.id)} className={styles.smallDangerBtn}>
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      })()}

      {/* CONTENIDO TAB: CABAÑAS */}
      {tab === 'cabanas' && (
        <div>
          <div className={styles.cabanaFormCard}>
            <h3 className={styles.formTitle}>Agregar nueva cabaña</h3>
            {msg && <p className={styles.successMsg}>{msg}</p>}
            <div className={styles.formGrid}>
              <input placeholder="Nombre" value={nuevaCabana.nombre} onChange={e => setNuevaCabana({ ...nuevaCabana, nombre: e.target.value })} className={styles.inputField} />
              <input placeholder="Descripción" value={nuevaCabana.descripcion} onChange={e => setNuevaCabana({ ...nuevaCabana, descripcion: e.target.value })} className={styles.inputField} />
              <input placeholder="Precio por noche" type="number" value={nuevaCabana.precio} onChange={e => setNuevaCabana({ ...nuevaCabana, precio: e.target.value })} className={styles.inputField} />
              <input placeholder="Capacidad" type="number" value={nuevaCabana.capacidad} onChange={e => setNuevaCabana({ ...nuevaCabana, capacidad: e.target.value })} className={styles.inputField} />
              <input placeholder="Ruta de imagen (Ej: /images/cabana1.jpg)" value={nuevaCabana.imagen} onChange={e => setNuevaCabana({ ...nuevaCabana, imagen: e.target.value })} className={styles.inputFieldWide} />
            </div>
            <button onClick={crearCabana} className={styles.submitBtn}>
              Agregar cabaña
            </button>
          </div>
          {cabanas.map(c => (
            <div key={c.id} className={styles.card}>
              <div className={styles.flexBetween} style={{ alignItems: 'center' }}>
                <div>
                  <strong>{c.nombre}</strong> — ${c.precio?.toLocaleString('es-CL')}/noche — {c.capacidad} personas
                  <div className={styles.subText2}>{c.descripcion}</div>
                  <span className={styles.badge} style={getBadgeStyle(c.disponible ? 'confirmada' : 'cancelada')}>{c.disponible ? 'Disponible' : 'No disponible'}</span>
                </div>
                <button onClick={() => eliminarCabana(c.id)} className={styles.smallDangerBtn}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONTENIDO TAB: USUARIOS */}
      {tab === 'usuarios' && (
        <div>
          {usuarios.map(u => (
            <div key={u.id} className={styles.card}>
              <div className={styles.flexBetween}>
                <div>
                  <strong>{u.nombre}</strong> — {u.email}
                  <div className={styles.subText}>Registrado: {new Date(u.createdAt).toLocaleDateString('es-CL')}</div>
                </div>
                <span className={styles.badge} style={getBadgeStyle(u.rol === 'admin' ? 'confirmada' : 'pendiente')}>{u.rol}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: REGISTRO MANUAL / BLOQUEO POR MANTENIMIENTO */}
      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {modalData.esBloqueo ? '🔧 Bloquear por Mantenimiento' : '📅 Crear Reserva Manual'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className={styles.closeBtn}
              >
                ✕
              </button>
            </div>
            
            {modalMsg && <div className={styles.errorMsg}>{modalMsg}</div>}
            
            <form onSubmit={handleCrearReservaManual}>
              {/* Tipo de Bloqueo */}
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="esBloqueo" 
                    checked={!modalData.esBloqueo} 
                    onChange={() => setModalData({ ...modalData, esBloqueo: false })} 
                  />
                  Reserva de Cliente
                </label>
                <label className={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="esBloqueo" 
                    checked={modalData.esBloqueo} 
                    onChange={() => setModalData({ ...modalData, esBloqueo: true })} 
                  />
                  Bloqueo Mantenimiento
                </label>
              </div>

              {/* Selección Cabaña */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Cabaña *</label>
                <select 
                  value={modalData.cabanaId} 
                  required
                  onChange={e => setModalData({ ...modalData, cabanaId: e.target.value })} 
                  className={styles.selectField}
                >
                  <option value="">Selecciona una cabaña...</option>
                  {cabanas.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre} (Cap: {c.capacidad})</option>
                  ))}
                </select>
              </div>

              {/* Fechas Entrada / Salida */}
              <div className={styles.dateGrid}>
                <div>
                  <label className={styles.formLabel}>Llegada *</label>
                  <input 
                    type="date" 
                    required
                    value={modalData.llegada} 
                    onChange={e => setModalData({ ...modalData, llegada: e.target.value })} 
                    className={styles.inputField} 
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Salida *</label>
                  <input 
                    type="date" 
                    required
                    value={modalData.salida} 
                    onChange={e => setModalData({ ...modalData, salida: e.target.value })} 
                    className={styles.inputField} 
                  />
                </div>
              </div>

              {/* Campos Cliente (Ocultos si es bloqueo por mantenimiento) */}
              {!modalData.esBloqueo && (
                <div className={styles.clientSection}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Nombre Cliente *</label>
                    <input 
                      type="text" 
                      required={!modalData.esBloqueo}
                      placeholder="Nombre completo" 
                      value={modalData.nombreCliente} 
                      onChange={e => setModalData({ ...modalData, nombreCliente: e.target.value })} 
                      className={styles.inputField} 
                    />
                  </div>
                  <div className={styles.dateGrid}>
                    <div>
                      <label className={styles.formLabel}>Correo Cliente *</label>
                      <input 
                        type="email" 
                        required={!modalData.esBloqueo}
                        placeholder="email@correo.com" 
                        value={modalData.emailCliente} 
                        onChange={e => setModalData({ ...modalData, emailCliente: e.target.value })} 
                        className={styles.inputField} 
                      />
                    </div>
                    <div>
                      <label className={styles.formLabel}>Teléfono Cliente</label>
                      <input 
                        type="tel" 
                        placeholder="+569..." 
                        value={modalData.telefonoCliente} 
                        onChange={e => setModalData({ ...modalData, telefonoCliente: e.target.value })} 
                        className={styles.inputField} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Botones */}
              <div className={styles.modalFormActions}>
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={styles.secondaryBtn}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className={styles.modalSubmitBtn}
                >
                  {modalData.esBloqueo ? '🔧 Bloquear Fechas' : '💾 Crear Reserva'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
