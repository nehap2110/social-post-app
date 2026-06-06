// src/utils/theme.js
// ─────────────────────────────────────────────
//  MUI Theme — Dark editorial aesthetic
//  Fonts: Syne (display/headings) + DM Sans (body)
//  Palette: Deep charcoal base, electric amber accent
// ─────────────────────────────────────────────

import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#F5A623',       // electric amber
      light: '#FFD166',
      dark: '#C47F0A',
      contrastText: '#0D0D0D',
    },
    secondary: {
      main: '#E8445A',       // vivid coral-red for likes
      light: '#FF6B82',
      dark: '#B5293D',
    },
    background: {
      default: '#0A0A0A',
      paper: '#141414',
    },
    text: {
      primary: '#F0EDE8',
      secondary: '#8A8580',
    },
    divider: 'rgba(245,166,35,0.12)',
    action: {
      hover: 'rgba(245,166,35,0.06)',
      selected: 'rgba(245,166,35,0.12)',
    },
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: { fontFamily: '"Syne", sans-serif', fontWeight: 800 },
    h2: { fontFamily: '"Syne", sans-serif', fontWeight: 800 },
    h3: { fontFamily: '"Syne", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Syne", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Syne", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Syne", sans-serif', fontWeight: 600 },
    button: { fontFamily: '"Syne", sans-serif', fontWeight: 600, letterSpacing: '0.04em' },
    subtitle1: { fontFamily: '"DM Sans", sans-serif', fontWeight: 500 },
    body1: { fontFamily: '"DM Sans", sans-serif', fontSize: '0.95rem', lineHeight: 1.65 },
    body2: { fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem', lineHeight: 1.6 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box' },
        body: {
          background: '#0A0A0A',
          scrollbarWidth: 'thin',
          scrollbarColor: '#2a2a2a #0A0A0A',
        },
        '::-webkit-scrollbar': { width: '6px' },
        '::-webkit-scrollbar-track': { background: '#0A0A0A' },
        '::-webkit-scrollbar-thumb': { background: '#2a2a2a', borderRadius: '3px' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          padding: '10px 22px',
          transition: 'all 0.2s ease',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #F5A623 0%, #FFD166 100%)',
          color: '#0D0D0D',
          boxShadow: '0 4px 20px rgba(245,166,35,0.3)',
          '&:hover': {
            boxShadow: '0 6px 28px rgba(245,166,35,0.45)',
            transform: 'translateY(-1px)',
          },
        },
        outlinedPrimary: {
          borderColor: 'rgba(245,166,35,0.4)',
          '&:hover': { borderColor: '#F5A623', background: 'rgba(245,166,35,0.06)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#141414',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            borderColor: 'rgba(245,166,35,0.18)',
            boxShadow: '0 8px 36px rgba(0,0,0,0.5)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.03)',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
            '&:hover fieldset': { borderColor: 'rgba(245,166,35,0.4)' },
            '&.Mui-focused fieldset': { borderColor: '#F5A623' },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#F5A623' },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: '#141414',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: '6px', fontFamily: '"Syne", sans-serif', fontWeight: 600 },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontFamily: '"Syne", sans-serif',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #F5A623, #E8445A)',
        },
      },
    },
    MuiSnackbar: {
      defaultProps: { anchorOrigin: { vertical: 'bottom', horizontal: 'center' } },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: '10px', fontFamily: '"DM Sans", sans-serif' },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: '8px', transition: 'all 0.15s ease' },
      },
    },
  },
})

export default theme