// src/components/PostCard.jsx
import React, { useState } from 'react'
import {
  Card, CardContent, CardMedia, CardActions, Box, Avatar,
  Typography, IconButton, Tooltip, Chip, Collapse,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import CommentIcon from "@mui/icons-material/Comment";
import { postApi } from '../api/postApi'
import { useAuth } from '../context/AuthContext'
import CommentDialog from './CommentDialog'

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api')
  .replace('/api', '')

const formatDate = (d) => {
  const diff = (Date.now() - new Date(d)) / 1000
  if (diff < 60)    return 'just now'
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const PostCard = ({ post: initialPost }) => {
  const { user } = useAuth()
  const [post, setPost]           = useState(initialPost)
  const [liking, setLiking]       = useState(false)
  const [commentOpen, setCommentOpen] = useState(false)
  const [imgExpanded, setImgExpanded] = useState(false)

  const isLiked = user
    ? post.likes.some((l) => l.user === user._id || l.user?._id === user._id)
    : false

  const handleLike = async () => {
    if (!user || liking) return
    setLiking(true)

    // Optimistic update
    const wasLiked = isLiked
    setPost((prev) => ({
      ...prev,
      likes: wasLiked
        ? prev.likes.filter((l) => (l.user._id || l.user) !== user._id)
        : [...prev.likes, { user: user._id, username: user.username }],
    }))

    try {
      const { data } = await postApi.likePost(post._id)
      setPost((prev) => ({ ...prev, likes: data.likes }))
    } catch {
      // Revert on failure
      setPost((prev) => ({
        ...prev,
        likes: wasLiked
          ? [...prev.likes, { user: user._id, username: user.username }]
          : prev.likes.filter((l) => (l.user._id || l.user) !== user._id),
      }))
    } finally {
      setLiking(false)
    }
  }

  const handleCommentAdded = (postId, comment, count) => {
    setPost((prev) => ({
      ...prev,
      comments: [...(prev.comments || []), comment],
      commentCount: count,
    }))
  }

  const imageUrl = post.image ? `${API_BASE}${post.image}` : null
  const initials = post.authorUsername?.slice(0, 2).toUpperCase() || '??'

  return (
    <>
      <Card
        sx={{
          animation: 'fadeSlideIn 0.35s ease both',
          '@keyframes fadeSlideIn': {
            from: { opacity: 0, transform: 'translateY(16px)' },
            to:   { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <CardContent sx={{ pb: 1, p: { xs: 2, sm: 2.5 } }}>
          {/* Author row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Avatar sx={{ width: 38, height: 38, fontSize: '0.75rem' }}>
              {initials}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, lineHeight: 1.2, color: '#F0EDE8' }}
              >
                {post.authorUsername}
              </Typography>
              <Typography variant="caption" sx={{ color: '#4A4A4A', fontSize: '0.72rem' }}>
                {formatDate(post.createdAt)}
              </Typography>
            </Box>

            {/* "New" badge for posts < 10 min old */}
            {(Date.now() - new Date(post.createdAt)) < 600000 && (
              <Chip
                label="NEW"
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.62rem',
                  background: 'rgba(245,166,35,0.15)',
                  color: '#F5A623',
                  border: '1px solid rgba(245,166,35,0.3)',
                }}
              />
            )}
          </Box>

          {/* Post text */}
          {post.text && (
            <Typography
              variant="body1"
              sx={{
                color: '#D0CEC9',
                lineHeight: 1.65,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                mb: imageUrl ? 1.5 : 0,
              }}
            >
              {post.text}
            </Typography>
          )}
        </CardContent>

        {/* Post image */}
        {imageUrl && (
          <Box
            onClick={() => setImgExpanded((v) => !v)}
            sx={{ cursor: 'zoom-in', overflow: 'hidden', px: { xs: 2, sm: 2.5 } }}
          >
            <CardMedia
              component="img"
              image={imageUrl}
              alt="post"
              sx={{
                borderRadius: '10px',
                maxHeight: imgExpanded ? 600 : 320,
                objectFit: imgExpanded ? 'contain' : 'cover',
                width: '100%',
                transition: 'max-height 0.3s ease',
                border: '1px solid rgba(255,255,255,0.06)',
                background: '#0D0D0D',
              }}
            />
          </Box>
        )}

        {/* Action bar */}
        <CardActions
          sx={{
            px: { xs: 2, sm: 2.5 },
            py: 1.25,
            display: 'flex',
            gap: 0.5,
            borderTop: '1px solid rgba(255,255,255,0.04)',
            mt: imageUrl ? 1 : 0,
          }}
        >
          {/* Like button */}
          <Tooltip title={user ? (isLiked ? 'Unlike' : 'Like') : 'Log in to like'}>
            <span>
              <IconButton
                size="small"
                onClick={handleLike}
                disabled={!user || liking}
                sx={{
                  color: isLiked ? '#E8445A' : '#5A5550',
                  gap: 0.6,
                  pr: 1,
                  borderRadius: '8px',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    color: '#E8445A',
                    background: 'rgba(232,68,90,0.1)',
                    transform: isLiked ? 'scale(0.9)' : 'scale(1.1)',
                  },
                }}
              >
                {isLiked
                  ? <FavoriteIcon sx={{ fontSize: 18, animation: isLiked ? 'heartPop 0.2s ease' : 'none',
                      '@keyframes heartPop': { '0%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.4)' }, '100%': { transform: 'scale(1)' } }
                    }} />
                  : <FavoriteBorderIcon sx={{ fontSize: 18 }} />}
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: '"Syne", sans-serif',
                    fontWeight: 600,
                    color: isLiked ? '#E8445A' : '#5A5550',
                    fontSize: '0.8rem',
                  }}
                >
                  {post.likes.length}
                </Typography>
              </IconButton>
            </span>
          </Tooltip>

          {/* Comment button */}
          <Tooltip title="Comments">
            <IconButton
              size="small"
              onClick={() => setCommentOpen(true)}
              sx={{
                color: '#5A5550',
                gap: 0.6,
                pr: 1,
                borderRadius: '8px',
                '&:hover': { color: '#F5A623', background: 'rgba(245,166,35,0.08)' },
              }}
            >
              <CommentIcon sx={{ fontSize: 17 }} />
              <Typography
                variant="caption"
                sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 600, fontSize: '0.8rem', color: 'inherit' }}
              >
                {post.comments?.length ?? post.commentCount ?? 0}
              </Typography>
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>

      <CommentDialog
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
        post={post}
        onCommentAdded={handleCommentAdded}
      />
    </>
  )
}

export default PostCard