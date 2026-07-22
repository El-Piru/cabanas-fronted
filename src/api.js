export const BASE_URL = import.meta.env.VITE_API_URL || 'https://cabanas-backend-95ey.onrender.com/api'

const getToken = () => localStorage.getItem('token')

export const api = {
  // Auth
  registro: (datos) => fetch(`${BASE_URL}/auth/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  }).then(r => r.json()),

  login: (datos) => fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(datos)
  }).then(r => r.json()),

  logout: () => fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  }).then(r => r.json()),

  eliminarCuenta: () => fetch(`${BASE_URL}/auth/eliminar-cuenta`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` },
    credentials: 'include'
  }).then(r => r.json()),

  recuperarPassword: (email) => fetch(`${BASE_URL}/auth/recuperar-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  }).then(r => r.json()),

  verificarTokenReset: (id, token) => fetch(`${BASE_URL}/auth/verificar-token-reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, token })
  }).then(r => r.json()),

  restablecerPassword: (id, token, password) => fetch(`${BASE_URL}/auth/restablecer-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, token, password })
  }).then(r => r.json()),

  // Cabanas
  getCabanas: () => fetch(`${BASE_URL}/cabanas/tipos`)
    .then(r => r.json()),

  getCabanaPorCapacidad: (capacidad) => fetch(`${BASE_URL}/cabanas/tipos`)
    .then(r => r.json())
    .then(res => {
      if (res.ok) {
        const tipo = res.data.find(c => c.capacidad === parseInt(capacidad))
        return { ok: true, data: tipo }
      }
      return res
    }),

  getCabana: (id) => fetch(`${BASE_URL}/cabanas/${id}`, {
    headers: { 'Authorization': `Bearer ${getToken()}` },
    credentials: 'include'
  }).then(r => r.json()),

  // Reservas
  crearReserva: (datos) => fetch(`${BASE_URL}/reservas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    credentials: 'include',
    body: JSON.stringify(datos)
  }).then(r => r.json()),

  pagarReserva: (id) => fetch(`${BASE_URL}/reservas/${id}/pagar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    credentials: 'include'
  }).then(r => r.json()),

  misReservas: () => fetch(`${BASE_URL}/reservas/mis-reservas`, {
    headers: { 'Authorization': `Bearer ${getToken()}` },
    credentials: 'include'
  }).then(r => r.json()),

  cancelarReserva: (id) => fetch(`${BASE_URL}/reservas/${id}/cancelar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    credentials: 'include'
  }).then(r => r.json()),

  getFechasOcupadas: (capacidad) => fetch(`${BASE_URL}/reservas/capacidad/${capacidad}/ocupadas`)
    .then(r => r.json())
}
