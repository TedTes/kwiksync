import React from "react";
import { Card, CardContent, Typography, Grid, Badge } from "@mui/material";

const TrendingCards: React.FC = () => {
  const trendingProducts = [
    { id: 1, name: "Product A", likes: 500, shares: 30, views: 3000 },
    { id: 2, name: "Product B", likes: 700, shares: 50, views: 5000 },
  ];

  return (
    <Grid container spacing={2}>
      {trendingProducts.map((product) => (
        <Grid item xs={12} key={product.id}>
          <Card variant="outlined">
            <CardContent>
              <Badge color="primary" badgeContent="Trending">
                <Typography variant="h6">{product.name}</Typography>
              </Badge>
              <Typography>Likes: {product.likes}</Typography>
              <Typography>Shares: {product.shares}</Typography>
              <Typography>Views: {product.views}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default TrendingCards;
