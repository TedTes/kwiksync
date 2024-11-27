import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Merchant Dashboard
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">
            Inventory
          </Button>
          <Button color="inherit" component={Link} to="/trends">
            Trends
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
