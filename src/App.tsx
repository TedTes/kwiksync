import React from "react";
import { Grid, Typography, Container, Box } from "@mui/material";
import InventoryTable from "./web/components/InventoryTable";
import TrendingCards from "./web/components/TrendingCards";
import TrendingChart from "./web/components/TrendingChart";

const App: React.FC = () => {
  return (
    <Container style={{ background: "black", color: "white" }}>
      <Typography variant="h4" gutterBottom>
        Inventory Dashboard & Trends
      </Typography>
      {/* Trending Cards and Charts */}
      <Grid container spacing={4} mb={4}>
        {/* Trending Cards */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Trending Products
          </Typography>
          <TrendingCards />
        </Grid>
        {/* Trending Chart */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Engagement Trends
          </Typography>
          <TrendingChart />
        </Grid>
      </Grid>
      {/* Inventory Table */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Inventory Table
        </Typography>
        <InventoryTable />
      </Box>
    </Container>
  );
};

export default App;
