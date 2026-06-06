// src/api/axiosInstance.js
// ─────────────────────────────────────────────
//  Axios Instance
//   • Attaches JWT to every request automatically
//   • Handles 401 (expired/invalid token) globally
// ─────────────────────────────────────────────

import axios from 'axios'
import { getToken, clearSession } from '../utils/token'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request Interceptor ────────────────────────
// Inject the Bearer token before every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor ───────────────────────
// Catch 401 errors globally (expired / invalid token)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale session data and redirect to login
      clearSession()
      // Only redirect if not already on an auth page
      if (!window.location.pathname.startsWith('/login') &&
          !window.location.pathname.startsWith('/signup')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance