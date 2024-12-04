import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Button,
} from "@mui/material";

const InventoryTable: React.FC = () => {
  const products = [
    {
      id: 1,
      name: "Product A",
      quantity: 50,
      price: 10.99,
      likes: 200,
      shares: 15,
      views: 1500,
    },
    {
      id: 2,
      name: "Product B",
      quantity: 10,
      price: 15.49,
      likes: 500,
      shares: 50,
      views: 3000,
    },
  ];

  return (
    <TableContainer
      component={Paper}
      style={{ maxHeight: "400px", overflowY: "auto" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Likes</TableCell>
            <TableCell>Shares</TableCell>
            <TableCell>Views</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>{product.likes}</TableCell>
              <TableCell>{product.shares}</TableCell>
              <TableCell>{product.views}</TableCell>
              <TableCell>
                <Button variant="contained" color="primary" size="small">
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  style={{ marginLeft: 8 }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InventoryTable;
