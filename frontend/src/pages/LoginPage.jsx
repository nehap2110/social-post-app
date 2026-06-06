// src/pages/LoginPage.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box, Card, CardContent, TextField, Button, Typography,
  CircularProgress, InputAdornment, IconButton, Alert,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import BoltIcon from '@mui/icons-material/Bolt'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const { login }    = useAuth()
  const navigate     = useNavigate()

  const [form, setForm]         = useState({ email: '', password: '' })
  const [errors, setErrors]     = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPwd, setShowPwd]   = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email.trim())    e.email    = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.password)        e.password = 'Password is required'
    return e
  }

  const handleChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }))
    if (apiError) setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/feed', { replace: true })
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-30%',
          left: '-20%',
          width: '60%',
          height: '60%',
          background: 'radial-gradient(circle, rgba(245,166,35,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '50%',
          height: '50%',
          background: 'radial-gradient(circle, rgba(232,68,90,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 420,
          background: 'rgba(20,20,20,0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(245,166,35,0.15)',
          borderRadius: '20px',
          animation: 'slideUp 0.4s ease both',
          '@keyframes slideUp': {
            from: { opacity: 0, transform: 'translateY(24px)' },
            to:   { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #F5A623, #E8445A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BoltIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Syne", sans-serif',
                fontWeight: 800,
                background: 'linear-gradient(90deg, #F5A623, #FFD166)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Pulse
            </Typography>
          </Box>

          <Typography variant="h5" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, mb: 0.5 }}>
            Welcome back
          </Typography>
          <Typography variant="body2" sx={{ color: '#6A6560', mb: 3 }}>
            Sign in to continue to your feed
          </Typography>

          {apiError && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: '10px' }}>
              {apiError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={form.email}
              onChange={handleChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              autoComplete="email"
              autoFocus
            />

            <TextField
              label="Password"
              type={showPwd ? 'text' : 'password'}
              fullWidth
              value={form.password}
              onChange={handleChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPwd((v) => !v)} edge="end" sx={{ color: '#6A6560' }}>
                      {showPwd ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 0.5, height: 48 }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: '#0D0D0D' }} /> : 'Sign In'}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: '#6A6560' }}>
            Don't have an account?{' '}
            <Typography
              component={Link}
              to="/signup"
              variant="body2"
              sx={{
                color: '#F5A623',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Create one
            </Typography>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default LoginPage