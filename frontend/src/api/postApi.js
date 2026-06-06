// src/api/postApi.js
// ─────────────────────────────────────────────
//  Post API Service Layer
// ─────────────────────────────────────────────

import axiosInstance from './axiosInstance'

export const postApi = {
  // GET /api/posts?page=1&limit=10
  getFeed: (page = 1, limit = 10) =>
    axiosInstance.get('/posts', { params: { page, limit } }),

  // POST /api/posts  (multipart/form-data)
  createPost: (formData) =>
    axiosInstance.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // PUT /api/posts/:id/like
  likePost: (id) => axiosInstance.put(`/posts/${id}/like`),

  // POST /api/posts/:id/comment
  commentPost: (id, text) => axiosInstance.post(`/posts/${id}/comment`, { text }),
}