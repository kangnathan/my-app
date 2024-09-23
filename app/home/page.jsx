'use client';
import { useState, useEffect, useReducer, useCallback } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Post from '../../components/Post';
import { Container, CircularProgress, Typography, Divider, Box, Grid, Grow } from '@mui/material';
import DatePicker from '../../components/DatePicker';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import MenuBar from '@/components/MenuBar';

// Drag and Drop Types
const ItemType = {
  POST: 'post',
};

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
      return { ...state, ...action.payload };
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

// Draggable Post Component
const DraggablePost = ({ post, index, movePost, refetchPosts }) => {
  const [{ isDragging }, ref] = useDrag({
    type: ItemType.POST,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType.POST,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        movePost(draggedItem.index, index);
        draggedItem.index = index; // Update the dragged item index
      }
    },
  });

  // State for controlling the grow transition
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true); // Set to true when component mounts
  }, []);

  return (
    <div
      ref={(node) => ref(drop(node))}
      className={`draggable-post ${isDragging ? 'dragging' : ''}`}
      style={{
        opacity: isDragging ? 0.5 : 1,
        transition: 'transform 0.2s ease',
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      <Box mb={-4.5}>
        <Grow
          in={visible}
          style={{ transformOrigin: '0 0 0' }}
          {...(visible ? { timeout: 1000 } : {})} // Adjust the timeout as needed
        >
          <div>
            <Post post={post} refetchPosts={refetchPosts} />
          </div>
        </Grow>
      </Box>
    </div>
  );
};

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

  const movePost = (fromIndex, toIndex) => {
    const updatedPosts = [...posts];
    const [movedPost] = updatedPosts.splice(fromIndex, 1);
    updatedPosts.splice(toIndex, 0, movedPost);
    dispatch({ type: 'SET_POSTS', payload: updatedPosts });
  };

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
    <DndProvider backend={HTML5Backend}>
      <Container maxWidth={false} sx={{ minHeight: '100vh', padding: '20px' }}>
        <MenuBar userName={userName} />
        <Divider variant="middle" sx={{ borderColor: '#CDCDCD', marginBottom: '30px' }} />

        <Box display="flex" alignItems="center" marginLeft="40px">
          <DatePicker
            startDate={startDate}
            setStartDate={(date) => dispatch({ type: 'SET_DATES', payload: { startDate: date, endDate } })}
            endDate={endDate}
            setEndDate={(date) => dispatch({ type: 'SET_DATES', payload: { startDate, endDate: date } })}
            fetchPosts={fetchPosts}
            user={user}
          />
        </Box>

        {posts.length > 0 ? (
          <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh" marginLeft="40px" marginRight="40px">
            <Grid container spacing={4} justifyContent="flex-start">
              {posts.map((post, index) => (
                <Grid item xs={12} sm={6} md={4} lg={2} key={post.id}>
                  <DraggablePost post={post} index={index} movePost={movePost} refetchPosts={refetchPosts} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Container maxWidth={false} sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: "center" }}>
            <Typography sx={{ color: 'white', fontSize: '25px' }}>No posts found.</Typography>
          </Container>
        )}
      </Container>
    </DndProvider>
  );
}
