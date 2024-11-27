import React, { useState } from "react";
import axios from "axios";
import { Container, Typography, TextField, Button, Alert } from "@mui/material";

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("merchant");
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (): Promise<void> => {
    try {
      await axios.post("/auth/register", { email, password, role });
      alert("Registration successful! You can now log in.");
      setError(null);
    } catch (error) {
      console.error("Error registering:", error);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Register
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
      <Button variant="contained" color="primary" onClick={handleRegister}>
        Register
      </Button>
    </Container>
  );
};

export default Register;
