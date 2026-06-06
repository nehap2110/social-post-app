// src/components/CommentDialog.jsx
import React, { useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, Box, Avatar,
  Typography, TextField, Button, IconButton, Divider,
  CircularProgress, List, ListItem,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import CommentIcon from "@mui/icons-material/Comment";
import { postApi } from '../api/postApi'
import { useAuth } from '../context/AuthContext'

const formatDate = (d) => {
  const diff = (Date.now() - new Date(d)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const CommentDialog = ({ open, onClose, post, onCommentAdded }) => {
  const { user } = useAuth()
  const [text, setText]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [comments, setComments] = useState(post?.comments || [])

  // Sync when post changes
  React.useEffect(() => {
    setComments(post?.comments || [])
  }, [post])

  const handleSubmit = async () => {
    if (!text.trim()) return
    setError('')
    setLoading(true)
    try {
      const { data } = await postApi.commentPost(post._id, text.trim())
      const updated = [...comments, data.comment]
      setComments(updated)
      onCommentAdded(post._id, data.comment, data.commentCount)
      setText('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  if (!post) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { maxHeight: '80vh' } }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          fontFamily: '"Syne", sans-serif',
          fontWeight: 700,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CommentIcon  sx={{ color: '#F5A623', fontSize: 20 }} />
          Comments
          <Typography
            component="span"
            sx={{
              ml: 0.5,
              fontSize: '0.8rem',
              color: '#F5A623',
              background: 'rgba(245,166,35,0.12)',
              px: 1,
              py: 0.25,
              borderRadius: '20px',
              fontFamily: '"DM Sans", sans-serif',
            }}
          >
            {comments.length}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: '#8A8580' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

      <DialogContent sx={{ p: 0 }}>
        {/* Comments List */}
        <List disablePadding sx={{ maxHeight: 380, overflowY: 'auto' }}>
          {comments.length === 0 ? (
            <Box sx={{ py: 5, textAlign: 'center' }}>
              <CommentIcon sx={{ fontSize: 40, color: '#2A2A2A', mb: 1 }} />
              <Typography variant="body2" sx={{ color: '#8A8580' }}>
                No comments yet. Be the first!
              </Typography>
            </Box>
          ) : (
            comments.map((c, i) => (
              <ListItem
                key={c._id || i}
                alignItems="flex-start"
                sx={{
                  px: 2.5,
                  py: 1.5,
                  gap: 1.5,
                  '&:not(:last-child)': {
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: '0.7rem',
                    flexShrink: 0,
                    mt: 0.25,
                  }}
                >
                  {c.username?.slice(0, 2).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.4 }}>
                    <Typography
                      variant="caption"
                      sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, color: '#F0EDE8' }}
                    >
                      {c.username}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#4A4A4A', fontSize: '0.72rem' }}>
                      {formatDate(c.createdAt)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#C0BDB8', lineHeight: 1.55 }}>
                    {c.text}
                  </Typography>
                </Box>
              </ListItem>
            ))
          )}
        </List>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

        {/* Input Area */}
        {user ? (
          <Box sx={{ display: 'flex', gap: 1.5, p: 2, alignItems: 'flex-end' }}>
            <Avatar sx={{ width: 34, height: 34, fontSize: '0.72rem', flexShrink: 0 }}>
              {user.username?.slice(0, 2).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                size="small"
                placeholder="Write a comment…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                inputProps={{ maxLength: 500 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
              {error && (
                <Typography variant="caption" sx={{ color: '#E8445A', mt: 0.5, display: 'block' }}>
                  {error}
                </Typography>
              )}
            </Box>
            <IconButton
              onClick={handleSubmit}
              disabled={!text.trim() || loading}
              sx={{
                background: text.trim() ? 'linear-gradient(135deg, #F5A623, #FFD166)' : 'rgba(255,255,255,0.05)',
                color: text.trim() ? '#0D0D0D' : '#4A4A4A',
                width: 38,
                height: 38,
                flexShrink: 0,
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: text.trim() ? 'linear-gradient(135deg, #FFD166, #F5A623)' : undefined,
                },
              }}
            >
              {loading
                ? <CircularProgress size={16} sx={{ color: '#0D0D0D' }} />
                : <SendIcon sx={{ fontSize: 16 }} />}
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#8A8580' }}>
              Log in to comment.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CommentDialog