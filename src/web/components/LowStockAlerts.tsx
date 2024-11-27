import React, { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../types";
import { Alert, Container } from "@mui/material";

const LowStockAlerts: React.FC = () => {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  const fetchLowStockAlerts = async (): Promise<void> => {
    try {
      const response = await axios.get("/products/low-stock", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLowStockProducts(response.data.lowStockProducts);
    } catch (error) {
      console.error("Error fetching low-stock alerts:", error);
    }
  };

  useEffect(() => {
    fetchLowStockAlerts();
  }, []);

  return (
    <Container>
      {lowStockProducts.map((product) => (
        <Alert key={product.id} severity="warning">
          {`Product "${product.name}" is low on stock. Current quantity: ${product.quantity}`}
        </Alert>
      ))}
    </Container>
  );
};

export default LowStockAlerts;
