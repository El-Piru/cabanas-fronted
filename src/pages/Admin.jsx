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
  const [nuevaCabana, setNuevaCabana] = useState({ nombre: '', descripcion: '', precio: '', capacidad: '' })
  const [msg, setMsg] = useState('')

  const headers = { 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' }

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null')
    if (!usuario) { navigate('/login'); return }
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    const [r1, r2, r3] = await Promise.all([
      fetch(`${BASE_URL}/admin/reservas`, { headers }).then(r => r.json()),
      fetch(`${BASE_URL}/admin/cabanas`, { headers }).then(r => r.json()),
      fetch(`${BASE_URL}/admin/usuarios`, { headers }).then(r => r.json()),
    ])
    if (r1.ok) setReservas(r1.data)
    if (r2.ok) setCabanas(r2.data)
    if (r3.ok) setUsuarios(r3.data)
  }

  const cancelarReserva = async (id) => {
    await fetch(`${BASE_URL}/admin/reservas/${id}/cancelar`, { method: 'PUT', headers })
    cargarDatos()
  }

  const crearCabana = async () => {
    const res = await fetch(`${BASE_URL}/admin/cabanas`, { method: 'POST', headers, body: JSON.stringify(nuevaCabana) }).then(r => r.json())
    if (res.ok) { setMsg('Cabana creada'); cargarDatos(); setNuevaCabana({ nombre: '', descripcion: '', precio: '', capacidad: '' }) }
    else setMsg(res.mensaje)
  }

  const eliminarCabana = async (id) => {
    if (!confirm('Eliminar esta cabana?')) return
    await fetch(`${BASE_URL}/admin/cabanas/${id}`, { method: 'DELETE', headers })
    cargarDatos()
  }

  const s = { page: { maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }, tabs: { display: 'flex', gap: '8px', marginBottom: '2rem' }, tab: (active) => ({ background: active ? '#2C4A2E' : '#fff', color: active ? '#fff' : '#2C4A2E', border: '1.5px solid #2C4A2E', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }), card: { background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #ECE8E0', marginBottom: '1rem' }, badge: (estado) => ({ background: estado === 'confirmada' ? '#D1FAE5' : estado === 'cancelada' ? '#FEE2E2' : '#FEF3C7', color: estado === 'confirmada' ? '#065F46' : estado === 'cancelada' ? '#991B1B' : '#92400E', padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '500' }) }

  return (
    <div style={s.page}>
      <h1 style={{ fontFamily: 'Georgia,serif', color: '#1A2E1B', marginBottom: '0.5rem' }}>Panel de Administrador</h1>
      <p style={{ color: '#7A8E7B', marginBottom: '2rem' }}>Gestiona reservas, cabanas y usuarios</p>

      <div style={s.tabs}>
        {['reservas', 'cabanas', 'usuarios'].map(t => (
          <button key={t} style={s.tab(tab === t)} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)} {tab === t && `(${t === 'reservas' ? reservas.length : t === 'cabanas' ? cabanas.length : usuarios.length})`}
          </button>
        ))}
      </div>

      {tab === 'reservas' && (
        <div>
          {reservas.map(r => (
            <div key={r.id} style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <strong>{r.cabana?.nombre}</strong> — {r.usuario?.nombre} ({r.usuario?.email})
                  <div style={{ fontSize: '0.85rem', color: '#7A8E7B', marginTop: '4px' }}>
                    {new Date(r.llegada).toLocaleDateString('es-CL')} → {new Date(r.salida).toLocaleDateString('es-CL')}
                  </div>
                  <div style={{ marginTop: '6px' }}>
                    <span style={s.badge(r.estado)}>{r.estado}</span>
                    <span style={{ marginLeft: '1rem', fontWeight: '500', color: '#2C4A2E' }}>${r.total?.toLocaleString('es-CL')}</span>
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
          {reservas.length === 0 && <p style={{ color: '#7A8E7B' }}>No hay reservas aun.</p>}
        </div>
      )}

      {tab === 'cabanas' && (
        <div>
          <div style={{ ...s.card, background: '#F5ECD7' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#1A2E1B' }}>Agregar nueva cabana</h3>
            {msg && <p style={{ color: '#2C4A2E', marginBottom: '1rem' }}>{msg}</p>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input placeholder="Nombre" value={nuevaCabana.nombre} onChange={e => setNuevaCabana({ ...nuevaCabana, nombre: e.target.value })} style={{ padding: '8px', border: '1.5px solid #E8E4DC', borderRadius: '8px' }} />
              <input placeholder="Descripcion" value={nuevaCabana.descripcion} onChange={e => setNuevaCabana({ ...nuevaCabana, descripcion: e.target.value })} style={{ padding: '8px', border: '1.5px solid #E8E4DC', borderRadius: '8px' }} />
              <input placeholder="Precio por noche" type="number" value={nuevaCabana.precio} onChange={e => setNuevaCabana({ ...nuevaCabana, precio: e.target.value })} style={{ padding: '8px', border: '1.5px solid #E8E4DC', borderRadius: '8px' }} />
              <input placeholder="Capacidad" type="number" value={nuevaCabana.capacidad} onChange={e => setNuevaCabana({ ...nuevaCabana, capacidad: e.target.value })} style={{ padding: '8px', border: '1.5px solid #E8E4DC', borderRadius: '8px' }} />
            </div>
            <button onClick={crearCabana} style={{ marginTop: '1rem', background: '#2C4A2E', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer' }}>
              Agregar cabana
            </button>
          </div>
          {cabanas.map(c => (
            <div key={c.id} style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{c.nombre}</strong> — ${c.precio?.toLocaleString('es-CL')}/noche — {c.capacidad} personas
                  <div style={{ fontSize: '0.85rem', color: '#7A8E7B' }}>{c.descripcion}</div>
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