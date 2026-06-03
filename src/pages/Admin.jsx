import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const BASE_URL = 'https://sabanas-proyecto-production.up.railway.app/api'
const getToken = () => localStorage.getItem('token')

export default function Admin() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('reservas')
  const [reservas, setReservas] = useState([])
  const [cabanas, setCabanas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [nuevaCabana, setNuevaCabana] = useState({ nombre: '', descripcion: '', precio: '', capacidad: '', imagen: '' })
  const [msg, setMsg] = useState('')

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
    const [r1, r2, r3] = await Promise.all([
      fetch(`${BASE_URL}/admin/reservas`, { headers, credentials: 'include' }).then(r => r.json()),
      fetch(`${BASE_URL}/admin/cabanas`, { headers, credentials: 'include' }).then(r => r.json()),
      fetch(`${BASE_URL}/admin/usuarios`, { headers, credentials: 'include' }).then(r => r.json()),
    ])
    if (r1.ok) setReservas(r1.data)
    if (r2.ok) setCabanas(r2.data)
    if (r3.ok) setUsuarios(r3.data)
  }

  const cancelarReserva = async (id) => {
    await fetch(`${BASE_URL}/admin/reservas/${id}/cancelar`, { method: 'PUT', headers, credentials: 'include' })
    cargarDatos()
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

  const reservasConfirmadas = reservas.filter(r => r.estado === 'confirmada')
  const ingresoTotal = reservasConfirmadas.reduce((acc, r) => acc + (r.total || 0), 0)
  const reservasHoy = reservas.filter(r => {
    const hoy = new Date().toDateString()
    return new Date(r.createdAt).toDateString() === hoy
  }).length

  const s = {
    page: { maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' },
    tabs: { display: 'flex', gap: '8px', marginBottom: '2rem' },
    tab: (active) => ({ background: active ? '#2C4A2E' : '#fff', color: active ? '#fff' : '#2C4A2E', border: '1.5px solid #2C4A2E', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }),
    card: { background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #ECE8E0', marginBottom: '1rem' },
    badge: (estado) => ({ background: estado === 'confirmada' ? '#D1FAE5' : estado === 'cancelada' ? '#FEE2E2' : '#FEF3C7', color: estado === 'confirmada' ? '#065F46' : estado === 'cancelada' ? '#991B1B' : '#92400E', padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '500' })
  }

  return (
    <div style={s.page}>
      <h1 style={{ fontFamily: 'Georgia,serif', color: '#1A2E1B', marginBottom: '0.5rem' }}>Panel de Administrador</h1>
      <p style={{ color: '#7A8E7B', marginBottom: '2rem' }}>Gestiona reservas, cabañas y usuarios</p>

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

      <div style={s.tabs}>
        {[
          { key: 'reservas', label: 'Reservas', count: reservas.length },
          { key: 'cabanas', label: 'Cabañas', count: cabanas.length },
          { key: 'usuarios', label: 'Usuarios', count: usuarios.length }
        ].map(t => (
          <button key={t.key} style={s.tab(tab === t.key)} onClick={() => setTab(t.key)}>
            {t.label} ({t.count})
          </button>
        ))}
      </div>

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
    </div>
  )
}
