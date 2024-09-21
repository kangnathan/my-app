import HomeClient from "./home/page";
import RegisterForm from "../components/RegisterForm";
import { Typography, Box, Divider, Button } from "@mui/material";
import Link from 'next/link';

export default async function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/user`);
  const user = res.ok ? await res.json() : null;

  return (
    <>
      {user ? (
        <HomeClient user={user} />
      ) : (
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 0 }}>
          <Box flex={1} textAlign="center" sx={{ backgroundColor: '#202124', color: 'white', p: 2 }}>
            <Typography variant="h2" sx={{marginBottom:"30px"}}>
              <strong>Quick<span style={{ color: "#BB86FC" }}>CRUD</span></strong>
            </Typography>
            <Typography variant="h5" gutterBottom >
              Don’t have an account? <strong>Create One</strong>
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center" sx={{ mt: 1 }}>
              <Typography variant="h6" sx={{ marginRight: 1 }}>or just</Typography>
              <Link href="/login">
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#BB86FC", color: "#fff", "&:hover": { backgroundColor: "#9a6cd8" } }}>
                  Log In
                </Button>
              </Link>
            </Box>
          </Box>
          <Box sx={{ height: '909px', display: 'flex', alignItems: 'center', mx: 0 }}>
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                height: '100%',
                bgcolor: 'black', // Change color to white
                borderWidth: 2,   // Adjust thickness
                borderStyle: 'solid', // Make it solid
              }}
            />
          </Box>
          <Box flex={1} display="flex" justifyContent="center">
            <RegisterForm />
          </Box>
        </Box>
      )}
    </>
  );
}
