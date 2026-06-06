// src/routes/ProtectedRoute.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Box, CircularProgress } from '@mui/material'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0A0A0A' }}>
        <CircularProgress sx={{ color: '#F5A623' }} />
      </Box>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute