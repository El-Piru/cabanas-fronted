import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [token, setToken] = useState(null)
  const [cargandoAuth, setCargandoAuth] = useState(true)

  // Cargar sesión guardada al montar
  useEffect(() => {
    try {
      const tokenGuardado = localStorage.getItem('token')
      const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || 'null')
      if (tokenGuardado && usuarioGuardado) {
        setToken(tokenGuardado)
        setUsuario(usuarioGuardado)
      }
    } catch (e) {
      console.error('Error al leer sesión guardada:', e)
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
    }
    setCargandoAuth(false)
  }, [])

  const login = useCallback(async (datos) => {
    const res = await api.login(datos)
    if (res.ok) {
      localStorage.setItem('token', res.token)
      localStorage.setItem('usuario', JSON.stringify(res.usuario))
      setToken(res.token)
      setUsuario(res.usuario)
    }
    return res
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor:', error)
    }
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setToken(null)
    setUsuario(null)
  }, [])

  const eliminarCuenta = useCallback(async () => {
    const res = await api.eliminarCuenta()
    if (res.ok) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      setToken(null)
      setUsuario(null)
    }
    return res
  }, [])

  const value = {
    usuario,
    token,
    cargandoAuth,
    login,
    logout,
    eliminarCuenta,
    estaAutenticado: !!usuario,
    esAdmin: usuario?.rol?.toLowerCase() === 'admin' || ['admin@cabanas.cl', 'bana_ju@hotmail.com', 'juanpedro4385@gmail.com'].includes(usuario?.email?.toLowerCase())
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}

export default AuthContext
