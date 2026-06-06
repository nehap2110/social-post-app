// src/pages/SignupPage.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box, Card, CardContent, TextField, Button, Typography,
  CircularProgress, InputAdornment, IconButton, Alert, LinearProgress,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import BoltIcon from '@mui/icons-material/Bolt'
import { useAuth } from '../context/AuthContext'

const passwordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', color: 'transparent' }
  let s = 0
  if (pwd.length >= 8)  s++
  if (/[A-Z]/.test(pwd)) s++
  if (/[0-9]/.test(pwd)) s++
  if (/[^a-zA-Z0-9]/.test(pwd)) s++
  const map = [
    { label: 'Very weak', color: '#E8445A' },
    { label: 'Weak',      color: '#FF8C42' },
    { label: 'Fair',      color: '#FFD166' },
    { label: 'Strong',    color: '#06D6A0' },
    { label: 'Very strong', color: '#06D6A0' },
  ]
  return { score: (s / 4) * 100, ...map[s] }
}

const SignupPage = () => {
  const { signup }   = useAuth()
  const navigate     = useNavigate()

  const [form, setForm]         = useState({ username: '', email: '', password: '' })
  const [errors, setErrors]     = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPwd, setShowPwd]   = useState(false)

  const strength = passwordStrength(form.password)

  const validate = () => {
    const e = {}
    if (!form.username.trim())       e.username = 'Username is required'
    else if (form.username.length < 3) e.username = 'At least 3 characters'
    else if (form.username.length > 30) e.username = 'Max 30 characters'
    if (!form.email.trim())          e.email    = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.password)              e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'At least 6 characters'
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
      await signup(form.username, form.email, form.password)
      navigate('/feed', { replace: true })
    } catch (err) {
      setApiError(err.response?.data?.message || 'Signup failed. Please try again.')
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
          top: '-20%', right: '-15%',
          width: '55%', height: '55%',
          background: 'radial-gradient(circle, rgba(245,166,35,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-25%', left: '-10%',
          width: '50%', height: '50%',
          background: 'radial-gradient(circle, rgba(232,68,90,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 440,
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
                width: 40, height: 40,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #F5A623, #E8445A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <BoltIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Syne", sans-serif', fontWeight: 800,
                background: 'linear-gradient(90deg, #F5A623, #FFD166)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}
            >
              Pulse
            </Typography>
          </Box>

          <Typography variant="h5" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, mb: 0.5 }}>
            Create account
          </Typography>
          <Typography variant="body2" sx={{ color: '#6A6560', mb: 3 }}>
            Join Pulse and share your moments
          </Typography>

          {apiError && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: '10px' }}>{apiError}</Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Username"
              fullWidth
              value={form.username}
              onChange={handleChange('username')}
              error={!!errors.username}
              helperText={errors.username}
              autoComplete="username"
              autoFocus
              inputProps={{ maxLength: 30 }}
            />

            <TextField
              label="Email"
              type="email"
              fullWidth
              value={form.email}
              onChange={handleChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              autoComplete="email"
            />

            <Box>
              <TextField
                label="Password"
                type={showPwd ? 'text' : 'password'}
                fullWidth
                value={form.password}
                onChange={handleChange('password')}
                error={!!errors.password}
                helperText={errors.password}
                autoComplete="new-password"
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
              {form.password && (
                <Box sx={{ mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={strength.score}
                    sx={{
                      height: 3,
                      borderRadius: 2,
                      background: 'rgba(255,255,255,0.08)',
                      '& .MuiLinearProgress-bar': { background: strength.color, borderRadius: 2 },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: strength.color, mt: 0.5, display: 'block' }}>
                    {strength.label}
                  </Typography>
                </Box>
              )}
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 0.5, height: 48 }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: '#0D0D0D' }} /> : 'Create Account'}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: '#6A6560' }}>
            Already have an account?{' '}
            <Typography
              component={Link}
              to="/login"
              variant="body2"
              sx={{ color: '#F5A623', textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
            >
              Sign in
            </Typography>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default SignupPage