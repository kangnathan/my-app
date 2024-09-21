"use client";

import { useState } from "react";
import { Container, Typography, TextField, Button, Alert, Box, IconButton, InputAdornment } from "@mui/material";
import { useRouter } from "next/navigation";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Link from "next/link";

export default function Page() {
  const [formState, setFormState] = useState({ success: null, message: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    setFormState({ success: null, message: '' });
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormState({ success: true, message: 'Login successful!' });
        
        // Add a 1.5 second delay before navigating
        setTimeout(() => {
          router.push("/home");
        }, 1500);
      } else {
        setFormState({ success: false, message: result.message || 'Login failed.' });
      }
    } catch (error) {
      setFormState({ success: false, message: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        <Link href="/" style={{ textDecoration: "none", textAlign: 'center', color: "white" }}>
          <Typography marginTop="50px" variant="h2">
            <strong>Quick<span style={{ color: "#BB86FC" }}>CRUD</span></strong>
          </Typography>
        </Link>
      </Typography>
      <Typography marginTop="150px" variant="h2" sx={{ textAlign: 'center', color: 'white' }}>
        <strong>Log In</strong>
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
        <Box mb={3}>
          <TextField
            fullWidth
            name="email"
            label="Email"
            autoComplete="off"
            variant="outlined"
            sx={{
              borderRadius: "5%",
              backgroundColor: "#F0F0F0",
              "& .MuiInputBase-input": { color: "#050505" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#F0F0F0" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#F0F0F0" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#F0F0F0" },
            }}
          />
        </Box>
        <Box mb={3}>
          <TextField
            fullWidth
            name="password"
            label="Password"
            autoComplete="off"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            sx={{
              borderRadius: "5%",
              backgroundColor: "#F0F0F0",
              "& .MuiInputBase-input": { color: "#050505" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#F0F0F0" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#F0F0F0" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#F0F0F0" },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Button
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: "#BB86FC",
            color: "#fff",
            "&:hover": { backgroundColor: "#9a6cd8" },
          }}
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Submit"}
        </Button>
        {/* Alerts below the button */}
        <Box mt={2}>
          {(formState.success !== null) && (
            <Alert variant="filled" severity={formState.success ? "success" : "warning"}>
              {formState.success ? 'Login successful!' : formState.message || 'Login failed.'}
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
}
