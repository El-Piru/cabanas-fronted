const BASE_URL = 'https://sabanas-proyecto-production.up.railway.app/api'

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

  // Cabanas
  getCabanas: () => fetch(`${BASE_URL}/cabanas`)
    .then(r => r.json()),

  getCabana: (id) => fetch(`${BASE_URL}/cabanas/${id}`, {
    credentials: 'include'
  }).then(r => r.json()),

  // Reservas
  crearReserva: (datos) => fetch(`${BASE_URL}/reservas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(datos)
  }).then(r => r.json()),

  misReservas: () => fetch(`${BASE_URL}/reservas/mis-reservas`, {
    credentials: 'include'
  }).then(r => r.json()),

  getFechasOcupadas: (cabanaId) => fetch(`${BASE_URL}/reservas/cabana/${cabanaId}/ocupadas`)
    .then(r => r.json())
}
