// src/components/CreatePost.jsx
import React, { useState, useRef } from 'react'
import {
  Card, CardContent, Box, TextField, Button, Avatar,
  IconButton, Typography, CircularProgress, Collapse, Tooltip,
} from '@mui/material'
import ImageIcon from '@mui/icons-material/Image'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import { postApi } from '../api/postApi'
import { useAuth } from '../context/AuthContext'

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth()
  const [text, setText]           = useState('')
  const [image, setImage]         = useState(null)   // File object
  const [preview, setPreview]     = useState(null)   // Data URL for preview
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [focused, setFocused]     = useState(false)
  const fileRef = useRef(null)

  const initials = user?.username?.slice(0, 2).toUpperCase() || '?'

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const removeImage = () => { setImage(null); setPreview(null) }

  const handleSubmit = async () => {
    if (!text.trim() && !image) {
      setError('Add some text or an image.')
      return
    }
    setError('')
    setLoading(true)

    try {
      const fd = new FormData()
      if (text.trim()) fd.append('text', text.trim())
      if (image) fd.append('image', image)

      const { data } = await postApi.createPost(fd)
      onPostCreated(data.post)
      setText('')
      setImage(null)
      setPreview(null)
      setFocused(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post.')
    } finally {
      setLoading(false)
    }
  }

  const canPost = (text.trim().length > 0 || image) && !loading

  return (
    <Card
      sx={{
        mb: 3,
        border: focused
          ? '1px solid rgba(245,166,35,0.35)'
          : '1px solid rgba(255,255,255,0.06)',
        transition: 'border-color 0.2s ease',
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Avatar sx={{ width: 40, height: 40, fontSize: '0.8rem', flexShrink: 0 }}>
            {initials}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              multiline
              minRows={focused ? 3 : 1}
              maxRows={8}
              placeholder={`What's on your mind, ${user?.username}?`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setFocused(true)}
              variant="outlined"
              sx={{ mb: preview ? 1.5 : 0 }}
              inputProps={{ maxLength: 1000 }}
            />

            {/* Image Preview */}
            <Collapse in={!!preview}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 1.5 }}>
                <Box
                  component="img"
                  src={preview}
                  alt="preview"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: 280,
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'block',
                    objectFit: 'cover',
                  }}
                />
                <IconButton
                  size="small"
                  onClick={removeImage}
                  sx={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(4px)',
                    '&:hover': { background: 'rgba(232,68,90,0.8)' },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            </Collapse>

            {error && (
              <Typography variant="caption" sx={{ color: '#E8445A', display: 'block', mb: 1 }}>
                {error}
              </Typography>
            )}

            {/* Action Bar */}
            <Collapse in={focused || !!preview || text.length > 0}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <input
                    type="file"
                    ref={fileRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageSelect}
                  />
                  <Tooltip title="Attach image">
                    <IconButton
                      size="small"
                      onClick={() => fileRef.current.click()}
                      sx={{ color: '#8A8580', '&:hover': { color: '#F5A623' } }}
                    >
                      <ImageIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {text.length > 800 && (
                    <Typography
                      variant="caption"
                      sx={{ color: text.length > 950 ? '#E8445A' : '#8A8580', alignSelf: 'center', ml: 1 }}
                    >
                      {1000 - text.length}
                    </Typography>
                  )}
                </Box>

                <Button
                  variant="contained"
                  size="small"
                  endIcon={loading ? <CircularProgress size={14} sx={{ color: '#0D0D0D' }} /> : <SendIcon sx={{ fontSize: '14px !important' }} />}
                  onClick={handleSubmit}
                  disabled={!canPost}
                  sx={{ minWidth: 90, height: 36 }}
                >
                  {loading ? 'Posting…' : 'Post'}
                </Button>
              </Box>
            </Collapse>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CreatePost