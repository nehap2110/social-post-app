// src/components/Navbar.jsx
import React, { useState } from 'react'
import {
  AppBar, Toolbar, Typography, Box, Avatar, IconButton,
  Menu, MenuItem, Divider, Tooltip, useScrollTrigger, Slide,
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import BoltIcon from '@mui/icons-material/Bolt'
import { useAuth } from '../context/AuthContext'

const HideOnScroll = ({ children }) => {
  const trigger = useScrollTrigger()
  return <Slide appear={false} direction="down" in={!trigger}>{children}</Slide>
}

const Navbar = () => {
  const { user, logout } = useAuth()
  const [anchor, setAnchor] = useState(null)

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '??'

  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'rgba(10,10,10,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(245,166,35,0.1)',
        }}
      >
        <Toolbar sx={{ maxWidth: 680, width: '100%', mx: 'auto', px: { xs: 2, sm: 3 } }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexGrow: 1 }}>
            <BoltIcon sx={{ color: '#F5A623', fontSize: 26 }} />
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Syne", sans-serif',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(90deg, #F5A623, #FFD166)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Pulse
            </Typography>
          </Box>

          {/* User Avatar */}
          {user && (
            <>
              <Tooltip title={user.username}>
                <IconButton onClick={(e) => setAnchor(e.currentTarget)} sx={{ p: 0.5 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      fontSize: '0.75rem',
                      fontFamily: '"Syne", sans-serif',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #F5A623, #E8445A)',
                    }}
                  >
                    {initials}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={() => setAnchor(null)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 180,
                    background: '#1A1A1A',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle1" sx={{ color: '#F0EDE8', fontWeight: 600 }}>
                    {user.username}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#8A8580' }}>
                    {user.email}
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
                <MenuItem
                  onClick={() => { logout(); setAnchor(null) }}
                  sx={{
                    gap: 1.5,
                    color: '#E8445A',
                    borderRadius: '8px',
                    mx: 0.5,
                    my: 0.5,
                    '&:hover': { background: 'rgba(232,68,90,0.1)' },
                  }}
                >
                  <LogoutIcon fontSize="small" />
                  <Typography variant="body2" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 600 }}>
                    Sign Out
                  </Typography>
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  )
}

export default Navbar