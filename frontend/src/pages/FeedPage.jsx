// src/pages/FeedPage.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  Box, Container, Typography, CircularProgress,
  Snackbar, Alert, Skeleton, Divider,
} from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import Navbar from '../components/Navbar'
import CreatePost from '../components/CreatePost'
import PostCard from '../components/PostCard'
import { postApi } from '../api/postApi'
import { useAuth } from '../context/AuthContext'

const PostSkeleton = () => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{
      background: '#141414',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '16px',
      p: 2.5,
    }}>
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
        <Skeleton variant="circular" width={38} height={38} sx={{ bgcolor: '#1E1E1E' }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="35%" sx={{ bgcolor: '#1E1E1E' }} />
          <Skeleton variant="text" width="20%" height={12} sx={{ bgcolor: '#1A1A1A' }} />
        </Box>
      </Box>
      <Skeleton variant="text" sx={{ bgcolor: '#1A1A1A' }} />
      <Skeleton variant="text" width="75%" sx={{ bgcolor: '#1A1A1A' }} />
      <Skeleton variant="rectangular" height={200} sx={{ bgcolor: '#1A1A1A', borderRadius: '10px', mt: 1.5 }} />
    </Box>
  </Box>
)

const FeedPage = () => {
  const { user } = useAuth()
  const [posts, setPosts]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage]         = useState(1)
  const [hasMore, setHasMore]   = useState(true)
  const [snack, setSnack]       = useState({ open: false, msg: '', severity: 'success' })
  const observerRef = useRef(null)
  const sentinelRef = useRef(null)

  const notify = (msg, severity = 'success') =>
    setSnack({ open: true, msg, severity })

  // ── Fetch posts ────────────────────────────────
  const fetchPosts = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true)
      else setLoadingMore(true)

      const { data } = await postApi.getFeed(pageNum, 8)

      setPosts((prev) => append ? [...prev, ...data.posts] : data.posts)
      setHasMore(pageNum < data.totalPages)
      setPage(pageNum)
    } catch {
      notify('Failed to load posts.', 'error')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => { fetchPosts(1) }, [fetchPosts])

  // ── Infinite scroll via IntersectionObserver ───
  useEffect(() => {
    if (!sentinelRef.current) return
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          fetchPosts(page + 1, true)
        }
      },
      { threshold: 0.5 }
    )
    observerRef.current.observe(sentinelRef.current)
    return () => observerRef.current?.disconnect()
  }, [hasMore, loadingMore, page, fetchPosts])

  // ── New post prepended to feed ─────────────────
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev])
    notify('Post published! ✨')
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <Navbar />

      <Container
        maxWidth={false}
        sx={{
          maxWidth: 680,
          px: { xs: 2, sm: 3 },
          pt: { xs: 3, sm: 4 },
          pb: 8,
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon sx={{ color: '#F5A623', fontSize: 20 }} />
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Syne", sans-serif',
              fontWeight: 700,
              background: 'linear-gradient(90deg, #F0EDE8, #8A8580)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Your Feed
          </Typography>
        </Box>

        {/* Create Post (only for logged-in users) */}
        {user && <CreatePost onPostCreated={handlePostCreated} />}

        {!user && (
          <Box
            sx={{
              mb: 3,
              p: 2.5,
              border: '1px dashed rgba(245,166,35,0.2)',
              borderRadius: '16px',
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ color: '#6A6560' }}>
              <Typography component="a" href="/login" sx={{ color: '#F5A623', textDecoration: 'none', fontWeight: 600 }}>
                Sign in
              </Typography>{' '}
              to create posts, like, and comment.
            </Typography>
          </Box>
        )}

        <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.04)' }} />

        {/* Feed list */}
        {loading ? (
          <Box>
            {[1, 2, 3].map((i) => <PostSkeleton key={i} />)}
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" sx={{ mb: 1, opacity: 0.15 }}>✦</Typography>
            <Typography variant="body1" sx={{ color: '#6A6560', fontFamily: '"Syne", sans-serif' }}>
              No posts yet.
            </Typography>
            <Typography variant="body2" sx={{ color: '#4A4540', mt: 0.5 }}>
              Be the first to share something!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {posts.map((post, i) => (
              <Box
                key={post._id}
                sx={{
                  animation: `fadeIn 0.3s ease ${Math.min(i, 6) * 0.05}s both`,
                  '@keyframes fadeIn': {
                    from: { opacity: 0, transform: 'translateY(12px)' },
                    to:   { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
              >
                <PostCard post={post} />
              </Box>
            ))}
          </Box>
        )}

        {/* Infinite scroll sentinel */}
        <Box ref={sentinelRef} sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          {loadingMore && <CircularProgress size={28} sx={{ color: '#F5A623' }} />}
          {!hasMore && posts.length > 0 && (
            <Typography variant="caption" sx={{ color: '#2A2A2A', fontFamily: '"Syne", sans-serif' }}>
              — end of feed —
            </Typography>
          )}
        </Box>
      </Container>

      {/* Global Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack((p) => ({ ...p, open: false }))}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack((p) => ({ ...p, open: false }))}
          sx={{ borderRadius: '10px' }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default FeedPage