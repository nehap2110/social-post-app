// src/api/authApi.js
// ─────────────────────────────────────────────
//  Auth API Service Layer
// ─────────────────────────────────────────────

import axiosInstance from './axiosInstance'

export const authApi = {
  signup: (data) => axiosInstance.post('/auth/signup', data),
  login:  (data) => axiosInstance.post('/auth/login', data),
  getMe:  ()     => axiosInstance.get('/auth/me'),
}