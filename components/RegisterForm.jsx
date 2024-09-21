"use client";
import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [formState, setFormState] = useState({ errors: {}, success: null });
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
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    setLoading(true);
    setFormState({ errors: {}, success: null });

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setFormState({ success: "Account created successfully!", errors: {} });
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setFormState({ errors: result.errors || { global: "An error occurred" }, success: null });
      }
    } catch {
      setFormState({ errors: { global: "Something went wrong." }, success: null });
    } finally {
      setLoading(false);
    }
  };

  const getFirstError = () => {
    const { errors } = formState;
    return errors.global || errors.name || errors.email || errors.password || null;
  };

  const textFieldStyles = {
    borderRadius: "5%",
    backgroundColor: "#F0F0F0",
    "& .MuiInputBase-input": { color: "#050505" },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#F0F0F0" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#F0F0F0" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#F0F0F0" },
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h2" sx={{ textAlign: "center", color: "white" }}>
        <strong>Sign Up</strong>
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
        <Box mb={3}>
          <TextField
            fullWidth
            name="name"
            label="Username"
            autoComplete="off"
            variant="outlined"
            sx={textFieldStyles}
          />
        </Box>

        <Box mb={3}>
          <TextField
            fullWidth
            name="email"
            label="Email"
            autoComplete="off"
            variant="outlined"
            sx={textFieldStyles}
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
            sx={textFieldStyles}
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
          {loading ? "Creating Account..." : "Create Account"}
        </Button>

        <Box mt={2}>
          {getFirstError() && (
            <Alert variant="filled" severity="warning">
              {getFirstError()}
            </Alert>
          )}
          {formState.success && (
            <Alert variant="filled" severity="success">
              {formState.success}
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
}
