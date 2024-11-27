import React, { useState } from "react";
import axios from "axios";
import { Container, Typography, TextField, Button, Alert } from "@mui/material";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (): Promise<void> => {
    try {
      const response = await axios.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      alert("Login successful!");
      setError(null);
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login
      </Button>
    </Container>
  );
};

export default Login;
