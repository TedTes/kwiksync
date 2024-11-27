import React, { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../types";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchInventory = async (): Promise<void> => {
    try {
      const response = await axios.get("/products", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Inventory Management
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => alert(`Editing product: ${product.name}`)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => alert(`Deleting product: ${product.name}`)}
                  sx={{ ml: 1 }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default Inventory;
