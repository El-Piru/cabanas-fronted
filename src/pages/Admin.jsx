import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { BASE_URL } from '../api'

const getToken = () => localStorage.getItem('token')

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
  
  const [msg, setMsg] = useState('')
  const [modalMsg, setModalMsg] = useState('')

  const headers = { 
    'Authorization': `Bearer ${getToken()}`, 
    'Content-Type': 'application/json' 
  }

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null')
    if (!usuario || usuario.rol !== 'admin') { navigate('/login'); return }
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const [resRes, resCab, resUsu] = await Promise.all([
        fetch(`${BASE_URL}/admin/reservas`, { headers, credentials: 'include' }),
        fetch(`${BASE_URL}/admin/cabanas`, { headers, credentials: 'include' }),
        fetch(`${BASE_URL}/admin/usuarios`, { headers, credentials: 'include' }),
      ])

      if (resRes.status === 401 || resCab.status === 401 || resUsu.status === 401) {
        console.warn('Sesión expirada o token inválido. Redirigiendo al login...');
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
        navigate('/login')
        return
      }

      const r1 = await resRes.json()
      const r2 = await resCab.json()
      const r3 = await resUsu.json()

      if (r1.ok) setReservas(r1.data)
      if (r2.ok) setCabanas(r2.data)
      if (r3.ok) setUsuarios(r3.data)
    } catch (error) {
      console.error('Error al cargar datos del administrador:', error)
    }
  }

  const cancelarReserva = async (id) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return
    const res = await fetch(`${BASE_URL}/admin/reservas/${id}/cancelar`, { method: 'PUT', headers, credentials: 'include' }).then(r => r.json())
    if (res.ok) {
      setSelectedReserva(null)
      cargarDatos()
    }
  }

  const crearCabana = async () => {
    const res = await fetch(`${BASE_URL}/admin/cabanas`, { method: 'POST', headers, credentials: 'include', body: JSON.stringify(nuevaCabana) }).then(r => r.json())
    if (res.ok) { setMsg('Cabaña creada'); cargarDatos(); setNuevaCabana({ nombre: '', descripcion: '', precio: '', capacidad: '', imagen: '' }) }
    else setMsg(res.mensaje)
  }

  const eliminarCabana = async (id) => {
    if (!confirm('¿Eliminar esta cabaña?')) return
    await fetch(`${BASE_URL}/admin/cabanas/${id}`, { method: 'DELETE', headers, credentials: 'include' })
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
        headers,
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
      return [
        r.id,
        r.cabana?.nombre || 'N/A',
        r.usuario?.nombre || 'N/A',
        r.usuario?.email || 'N/A',
        d1.toLocaleDateString('es-CL'),
        d2.toLocaleDateString('es-CL'),
        noches,
        r.total,
        r.estado,
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

  const getReservaDelDia = (cabanaId, dia) => {
    const checkDate = new Date(year, month, dia)
    checkDate.setHours(0,0,0,0)
    
    return reservas.find(r => {
      if (r.cabanaId !== cabanaId || r.estado === 'cancelada') return false
      const llegada = new Date(r.llegada)
      llegada.setHours(0,0,0,0)
      const salida = new Date(r.salida)
      salida.setHours(0,0,0,0)
      
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
  const reservasConfirmadas = reservas.filter(r => r.estado === 'confirmada')
  const ingresoTotal = reservasConfirmadas.reduce((acc, r) => acc + (r.total || 0), 0)
  const reservasHoy = reservas.filter(r => {
    const hoy = new Date().toDateString()
    return new Date(r.createdAt).toDateString() === hoy
  }).length

  const s = {
    page: { maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' },
    tabs: { display: 'flex', gap: '8px', marginBottom: '2rem' },
    tab: (active) => ({ background: active ? '#2C4A2E' : '#fff', color: active ? '#fff' : '#2C4A2E', border: '1.5px solid #2C4A2E', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }),
    card: { background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #ECE8E0', marginBottom: '1rem' },
    badge: (estado) => ({ background: estado === 'confirmada' ? '#D1FAE5' : estado === 'mantenimiento' ? '#E5E7EB' : estado === 'cancelada' ? '#FEE2E2' : '#FEF3C7', color: estado === 'confirmada' ? '#065F46' : estado === 'mantenimiento' ? '#374151' : estado === 'cancelada' ? '#991B1B' : '#92400E', padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '500' }),
    
    // Calendar Timeline styles
    calendarWrapper: { overflowX: 'auto', background: '#fff', border: '1px solid #ECE8E0', borderRadius: '12px', marginBottom: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', minWidth: '900px' },
    thSticky: { position: 'sticky', left: 0, background: '#F5ECD7', borderRight: '2px solid #E8E4DC', borderBottom: '2px solid #E8E4DC', zIndex: 10, padding: '10px 12px', fontWeight: '600', color: '#1A2E1B', textAlign: 'left', minWidth: '110px', boxShadow: '2px 0 5px rgba(0,0,0,0.03)' },
    tdSticky: { position: 'sticky', left: 0, background: '#fff', borderRight: '2px solid #E8E4DC', borderBottom: '1px solid #ECE8E0', zIndex: 9, padding: '10px 12px', fontWeight: '600', color: '#1A2E1B', textAlign: 'left', boxShadow: '2px 0 5px rgba(0,0,0,0.02)' },
    thDay: (isWeekend) => ({ background: isWeekend ? '#E8E4DC' : '#FAF8F5', borderBottom: '2px solid #E8E4DC', borderRight: '1px solid #ECE8E0', padding: '6px 4px', textAlign: 'center', minWidth: '30px', color: '#1A2E1B' }),
    tdDay: (isWeekend) => ({ background: isWeekend ? '#FCFAF7' : '#fff', borderBottom: '1px solid #ECE8E0', borderRight: '1px solid #ECE8E0', width: '32px', height: '38px', padding: '0', textAlign: 'center', cursor: 'pointer', transition: 'background 0.1s' }),
    
    // Modal Overlay
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modal: { background: '#fff', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #ECE8E0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }
  }

  return (
    <div style={s.page}>
      <h1 style={{ fontFamily: 'Georgia,serif', color: '#1A2E1B', marginBottom: '0.5rem' }}>Panel de Administrador</h1>
      <p style={{ color: '#7A8E7B', marginBottom: '2rem' }}>Gestiona reservas, cabañas y bloqueos de fechas</p>

      {/* Tarjetas de Estadísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#2C4A2E', borderRadius: '12px', padding: '1.25rem', color: '#fff' }}>
          <div style={{ fontSize: '0.8rem', opacity: .7, marginBottom: '8px' }}>Total reservas</div>
          <div style={{ fontSize: '2rem', fontWeight: '600' }}>{reservas.length}</div>
        </div>
        <div style={{ background: '#C8860A', borderRadius: '12px', padding: '1.25rem', color: '#fff' }}>
          <div style={{ fontSize: '0.8rem', opacity: .7, marginBottom: '8px' }}>Ingresos totales</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>${ingresoTotal.toLocaleString('es-CL')}</div>
        </div>
        <div style={{ background: '#1A6B8A', borderRadius: '12px', padding: '1.25rem', color: '#fff' }}>
          <div style={{ fontSize: '0.8rem', opacity: .7, marginBottom: '8px' }}>Cabañas activas</div>
          <div style={{ fontSize: '2rem', fontWeight: '600' }}>{cabanas.filter(c => c.disponible).length}</div>
        </div>
        <div style={{ background: '#5A3E28', borderRadius: '12px', padding: '1.25rem', color: '#fff' }}>
          <div style={{ fontSize: '0.8rem', opacity: .7, marginBottom: '8px' }}>Reservas hoy</div>
          <div style={{ fontSize: '2rem', fontWeight: '600' }}>{reservasHoy}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        {[
          { key: 'calendario', label: '📅 Calendario de Ocupación', count: null },
          { key: 'reservas', label: '📋 Lista de Reservas', count: reservas.length },
          { key: 'cabanas', label: '🏕️ Cabañas', count: cabanas.length },
          { key: 'usuarios', label: '👥 Usuarios', count: usuarios.length }
        ].map(t => (
          <button key={t.key} style={s.tab(tab === t.key)} onClick={() => setTab(t.key)}>
            {t.label} {t.count !== null ? `(${t.count})` : ''}
          </button>
        ))}
      </div>

      {/* CONTENIDO TAB: CALENDARIO */}
      {tab === 'calendario' && (
        <div>
          {/* Controles de fecha y mes */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button onClick={() => cambiarMes(-1)} style={{ background: '#fff', border: '1px solid #2C4A2E', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', color: '#2C4A2E', fontWeight: '600' }}>◀ Ant</button>
              <h2 style={{ fontSize: '1.25rem', margin: 0, fontFamily: 'Georgia,serif', color: '#1A2E1B', minWidth: '150px', textAlign: 'center' }}>
                {mesesNombres[month]} {year}
              </h2>
              <button onClick={() => cambiarMes(1)} style={{ background: '#fff', border: '1px solid #2C4A2E', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', color: '#2C4A2E', fontWeight: '600' }}>Sig ▶</button>
            </div>
            <button 
              onClick={() => openModalParaCrear()} 
              style={{ background: '#2C4A2E', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
            >
              ➕ Crear Reserva / Bloquear Fechas
            </button>
          </div>

          {/* Contenedor del Timeline del Calendario */}
          <div style={s.calendarWrapper}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.thSticky}>Cabaña</th>
                  {diasArray.map(d => (
                    <th key={d} style={s.thDay(esFinDeSemana(d))}>
                      <div>{d}</div>
                      <div style={{ fontSize: '0.65rem', opacity: 0.6, marginTop: '2px' }}>{getNombreDiaSemana(d)}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cabanas.map(c => (
                  <tr key={c.id}>
                    <td style={s.tdSticky}>{c.nombre}</td>
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
                          titleStr = `BLOQUEADO POR MANTENIMIENTO\nDesde: ${new Date(res.llegada).toLocaleDateString('es-CL')}\nHasta: ${new Date(res.salida).toLocaleDateString('es-CL')}`
                        } else {
                          titleStr = `Reserva #${res.id}\nCliente: ${res.usuario?.nombre}\nEmail: ${res.usuario?.email}\nTel: ${res.usuario?.telefono || 'Sin tel.'}\nDesde: ${new Date(res.llegada).toLocaleDateString('es-CL')}\nHasta: ${new Date(res.salida).toLocaleDateString('es-CL')}\nTotal: $${res.total?.toLocaleString('es-CL')}`
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
                          style={{ ...s.tdDay(esFinDeSemana(d)), ...cellStyle }}
                        />
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Leyenda de Colores */}
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', fontSize: '0.85rem', color: '#7A8E7B', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '14px', background: '#10B981', borderRadius: '3px' }}></div>
              <span>Confirmada / Pago Aprobado</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '14px', background: '#FCD34D', borderRadius: '3px' }}></div>
              <span>Pendiente de Pago (Mercado Pago)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '14px', background: '#9CA3AF', borderRadius: '3px' }}></div>
              <span>Bloqueado por Mantenimiento</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '14px', background: '#fff', border: '1px solid #ECE8E0', borderRadius: '3px' }}></div>
              <span>Disponible</span>
            </div>
          </div>

          {/* MODAL: DETALLE DE RESERVA */}
          {selectedReserva && (
            <div style={s.overlay}>
              <div style={s.modal}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0, fontFamily: 'Georgia,serif', color: '#1A2E1B', fontSize: '1.25rem' }}>
                    {selectedReserva.estado === 'mantenimiento' ? '🔧 Bloqueo por Mantenimiento' : '📋 Detalle de Reserva'}
                  </h3>
                  <button 
                    onClick={() => setSelectedReserva(null)}
                    style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#7A8E7B' }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#374151', marginBottom: '1.5rem' }}>
                  <div><strong>ID Reserva:</strong> #{selectedReserva.id}</div>
                  <div><strong>Cabaña:</strong> {selectedReserva.cabana?.nombre}</div>
                  <div>
                    <strong>Estado:</strong>{' '}
                    <span style={s.badge(selectedReserva.estado)}>
                      {selectedReserva.estado === 'confirmada' ? 'Confirmada / Aprobada' : selectedReserva.estado === 'mantenimiento' ? 'Mantenimiento' : 'Pendiente de Pago'}
                    </span>
                  </div>
                  <div><strong>Fecha Entrada:</strong> {new Date(selectedReserva.llegada).toLocaleDateString('es-CL')}</div>
                  <div><strong>Fecha Salida:</strong> {new Date(selectedReserva.salida).toLocaleDateString('es-CL')}</div>
                  {selectedReserva.estado !== 'mantenimiento' && (
                    <>
                      <div><strong>Total Tarifa:</strong> ${selectedReserva.total?.toLocaleString('es-CL')}</div>
                      <hr style={{ border: 'none', borderTop: '1px solid #ECE8E0', margin: '0.5rem 0' }} />
                      <div><strong>Huésped:</strong> {selectedReserva.usuario?.nombre}</div>
                      <div><strong>Email:</strong> {selectedReserva.usuario?.email}</div>
                      <div><strong>Teléfono:</strong> {selectedReserva.usuario?.telefono || 'N/A'}</div>
                    </>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  {selectedReserva.estado !== 'cancelada' && (
                    <button 
                      onClick={() => cancelarReserva(selectedReserva.id)} 
                      style={{ background: '#FEE2E2', color: '#991B1B', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
                    >
                      🚫 Liberar Fechas / Cancelar
                    </button>
                  )}
                  <button 
                    onClick={() => setSelectedReserva(null)}
                    style={{ background: '#E5E7EB', color: '#374151', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
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
      {tab === 'reservas' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
            <button 
              onClick={exportarExcel} 
              disabled={reservas.length === 0}
              style={{ background: reservas.length === 0 ? '#ccc' : '#C8860A', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: reservas.length === 0 ? 'not-allowed' : 'pointer', fontWeight: '500', fontSize: '0.9rem' }}
            >
              📥 Exportar a Excel (.csv)
            </button>
          </div>

          {reservas.length === 0 && <p style={{ color: '#7A8E7B' }}>No hay reservas aún.</p>}
          {reservas.map(r => (
            <div key={r.id} style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <strong>{r.cabana?.nombre}</strong> — {r.usuario?.nombre} ({r.usuario?.email})
                  <div style={{ fontSize: '0.85rem', color: '#7A8E7B', marginTop: '4px' }}>
                    Llegada: {new Date(r.llegada).toLocaleDateString('es-CL')} → Salida: {new Date(r.salida).toLocaleDateString('es-CL')}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#7A8E7B' }}>
                    Reservado el: {new Date(r.createdAt).toLocaleDateString('es-CL')}
                  </div>
                  {r.usuario?.telefono && (
                    <div style={{ fontSize: '0.8rem', color: '#7A8E7B' }}>
                      Teléfono: {r.usuario.telefono}
                    </div>
                  )}
                  <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={s.badge(r.estado)}>{r.estado}</span>
                    <span style={{ fontWeight: '500', color: '#2C4A2E' }}>${r.total?.toLocaleString('es-CL')}</span>
                  </div>
                </div>
                {r.estado !== 'cancelada' && (
                  <button onClick={() => cancelarReserva(r.id)} style={{ background: '#FEE2E2', color: '#991B1B', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONTENIDO TAB: CABAÑAS */}
      {tab === 'cabanas' && (
        <div>
          <div style={{ ...s.card, background: '#F5ECD7' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#1A2E1B' }}>Agregar nueva cabaña</h3>
            {msg && <p style={{ color: '#2C4A2E', marginBottom: '1rem' }}>{msg}</p>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input placeholder="Nombre" value={nuevaCabana.nombre} onChange={e => setNuevaCabana({ ...nuevaCabana, nombre: e.target.value })} style={{ padding: '8px', border: '1.5px solid #E8E4DC', borderRadius: '8px' }} />
              <input placeholder="Descripción" value={nuevaCabana.descripcion} onChange={e => setNuevaCabana({ ...nuevaCabana, descripcion: e.target.value })} style={{ padding: '8px', border: '1.5px solid #E8E4DC', borderRadius: '8px' }} />
              <input placeholder="Precio por noche" type="number" value={nuevaCabana.precio} onChange={e => setNuevaCabana({ ...nuevaCabana, precio: e.target.value })} style={{ padding: '8px', border: '1.5px solid #E8E4DC', borderRadius: '8px' }} />
              <input placeholder="Capacidad" type="number" value={nuevaCabana.capacidad} onChange={e => setNuevaCabana({ ...nuevaCabana, capacidad: e.target.value })} style={{ padding: '8px', border: '1.5px solid #E8E4DC', borderRadius: '8px' }} />
              <input placeholder="Ruta de imagen (Ej: /images/cabana1.jpg)" value={nuevaCabana.imagen} onChange={e => setNuevaCabana({ ...nuevaCabana, imagen: e.target.value })} style={{ padding: '8px', border: '1.5px solid #E8E4DC', borderRadius: '8px', gridColumn: 'span 2' }} />
            </div>
            <button onClick={crearCabana} style={{ marginTop: '1rem', background: '#2C4A2E', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer' }}>
              Agregar cabaña
            </button>
          </div>
          {cabanas.map(c => (
            <div key={c.id} style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{c.nombre}</strong> — ${c.precio?.toLocaleString('es-CL')}/noche — {c.capacidad} personas
                  <div style={{ fontSize: '0.85rem', color: '#7A8E7B' }}>{c.descripcion}</div>
                  <span style={s.badge(c.disponible ? 'confirmada' : 'cancelada')}>{c.disponible ? 'Disponible' : 'No disponible'}</span>
                </div>
                <button onClick={() => eliminarCabana(c.id)} style={{ background: '#FEE2E2', color: '#991B1B', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>
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
            <div key={u.id} style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>{u.nombre}</strong> — {u.email}
                  <div style={{ fontSize: '0.85rem', color: '#7A8E7B' }}>Registrado: {new Date(u.createdAt).toLocaleDateString('es-CL')}</div>
                </div>
                <span style={s.badge(u.rol === 'admin' ? 'confirmada' : 'pendiente')}>{u.rol}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: REGISTRO MANUAL / BLOQUEO POR MANTENIMIENTO */}
      {showModal && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontFamily: 'Georgia,serif', color: '#1A2E1B', fontSize: '1.25rem' }}>
                {modalData.esBloqueo ? '🔧 Bloquear por Mantenimiento' : '📅 Crear Reserva Manual'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#7A8E7B' }}
              >
                ✕
              </button>
            </div>
            
            {modalMsg && <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>{modalMsg}</div>}
            
            <form onSubmit={handleCrearReservaManual}>
              {/* Tipo de Bloqueo */}
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#1A2E1B', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="esBloqueo" 
                    checked={!modalData.esBloqueo} 
                    onChange={() => setModalData({ ...modalData, esBloqueo: false })} 
                  />
                  Reserva de Cliente
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#1A2E1B', cursor: 'pointer' }}>
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
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#1A2E1B', marginBottom: '4px' }}>Cabaña *</label>
                <select 
                  value={modalData.cabanaId} 
                  required
                  onChange={e => setModalData({ ...modalData, cabanaId: e.target.value })} 
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #E8E4DC', borderRadius: '8px', background: '#fff' }}
                >
                  <option value="">Selecciona una cabaña...</option>
                  {cabanas.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre} (Cap: {c.capacidad})</option>
                  ))}
                </select>
              </div>

              {/* Fechas Entrada / Salida */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#1A2E1B', marginBottom: '4px' }}>Llegada *</label>
                  <input 
                    type="date" 
                    required
                    value={modalData.llegada} 
                    onChange={e => setModalData({ ...modalData, llegada: e.target.value })} 
                    style={{ width: '100%', padding: '8px', border: '1.5px solid #E8E4DC', borderRadius: '8px' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#1A2E1B', marginBottom: '4px' }}>Salida *</label>
                  <input 
                    type="date" 
                    required
                    value={modalData.salida} 
                    onChange={e => setModalData({ ...modalData, salida: e.target.value })} 
                    style={{ width: '100%', padding: '8px', border: '1.5px solid #E8E4DC', borderRadius: '8px' }} 
                  />
                </div>
              </div>

              {/* Campos Cliente (Ocultos si es bloqueo por mantenimiento) */}
              {!modalData.esBloqueo && (
                <div style={{ borderTop: '1px solid #ECE8E0', paddingTop: '1rem', marginTop: '1rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#1A2E1B', marginBottom: '4px' }}>Nombre Cliente *</label>
                    <input 
                      type="text" 
                      required={!modalData.esBloqueo}
                      placeholder="Nombre completo" 
                      value={modalData.nombreCliente} 
                      onChange={e => setModalData({ ...modalData, nombreCliente: e.target.value })} 
                      style={{ width: '100%', padding: '10px', border: '1.5px solid #E8E4DC', borderRadius: '8px' }} 
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#1A2E1B', marginBottom: '4px' }}>Correo Cliente *</label>
                      <input 
                        type="email" 
                        required={!modalData.esBloqueo}
                        placeholder="email@correo.com" 
                        value={modalData.emailCliente} 
                        onChange={e => setModalData({ ...modalData, emailCliente: e.target.value })} 
                        style={{ width: '100%', padding: '8px', border: '1.5px solid #E8E4DC', borderRadius: '8px' }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#1A2E1B', marginBottom: '4px' }}>Teléfono Cliente</label>
                      <input 
                        type="tel" 
                        placeholder="+569..." 
                        value={modalData.telefonoCliente} 
                        onChange={e => setModalData({ ...modalData, telefonoCliente: e.target.value })} 
                        style={{ width: '100%', padding: '8px', border: '1.5px solid #E8E4DC', borderRadius: '8px' }} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Botones */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '2rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ background: '#E5E7EB', color: '#374151', border: 'none', padding: '10px 22px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  style={{ background: '#2C4A2E', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
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
