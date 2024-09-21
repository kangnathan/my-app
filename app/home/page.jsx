'use client';
import { useState, useEffect, useReducer, useCallback } from 'react';
import Post from '../../components/Post';
import AddPostModal from '../../components/AddPostModal';
import { Container, CircularProgress, Typography, Divider, Box, Grid, Grow } from '@mui/material';
import DatePicker from '../../components/DatePicker';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import MenuBar from '@/components/MenuBar';
import dayjs from 'dayjs'; // Import dayjs for formatting

const initialState = {
  user: null,
  userName: '',
  posts: [],
  startDate: null,
  endDate: null,
  loading: true,
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, userName: action.payload.userName };
    case 'SET_POSTS':
      return { ...state, posts: action.payload, loading: false, error: '' };
    case 'SET_DATES':
      return { ...state, ...action.payload }; // Use destructuring
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'REMOVE_POST':
      return { ...state, posts: state.posts.filter(post => post.id !== action.payload) };
    default:
      return state;
  }
}

export default function HomeClient() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user, userName, posts, startDate, endDate, loading, error } = state;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        if (res.ok) {
          const userData = await res.json();
          dispatch({ type: 'SET_USER', payload: userData });
        } else {
          router.push("/login");
        }
      } catch {
        router.push("/login");
      }
    };
    fetchUser();
  }, [router]);

  const fetchPosts = useCallback(async () => {
    if (!user) return;
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const { data } = await axios.get('/api/posts', { params: { startDate: startDate || '', endDate: endDate || '' } });
      dispatch({ type: 'SET_POSTS', payload: data.posts });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error fetching posts.' });
    }
  }, [user, startDate, endDate]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const refetchPosts = () => fetchPosts(); 

  if (loading) {
    return (
      <Container maxWidth={false} sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <CircularProgress />
          <Typography variant="body1" sx={{ marginTop: '5px', color: 'white', fontSize: '25px' }}>
            Getting posts...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth={false} sx={{ minHeight: '100vh', padding: '20px' }}>
      <MenuBar userName={userName} />
      <Divider variant="middle" sx={{ borderColor: '#CDCDCD', marginBottom: '30px' }} />

      <Box display="flex" alignItems="center" marginLeft="40px">
        <DatePicker
          startDate={startDate}
          setStartDate={(date) => dispatch({ type: 'SET_DATES', payload: { startDate: date, endDate } })} // Updated
          endDate={endDate}
          setEndDate={(date) => dispatch({ type: 'SET_DATES', payload: { startDate, endDate: date } })} // Updated
          fetchPosts={fetchPosts}
          user={user}
        />
      </Box>

      {posts.length > 0 ? (
        <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh" marginLeft="40px" marginRight="40px">
          <Grid container spacing={4} justifyContent="flex-start">
            {posts.map((post, index) => (
              <Grow
                in={true}
                style={{ transformOrigin: '0 0 0' }}
                timeout={index * 300}
                key={post.id}
              >
                <Grid item xs={12} sm={6} md={4} lg={2}>
                  <Box mb={-4.5}>
                    <Post post={post} refetchPosts={refetchPosts} />
                  </Box>
                </Grid>
              </Grow>
            ))}
          </Grid>
        </Box>
      ) : (
        <Container maxWidth={false} sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ color: 'white', fontSize: '25px' }}>No posts found.</Typography>
        </Container>
      )}
    </Container>
  );
}
