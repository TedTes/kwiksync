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
      // const response = await axios.get("/products", {
      //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      // });
      setProducts([
        {
          id: "P0001",
          name: "Laptop",
          category: "Accessories",
          description: "A high-quality product used in various applications.",
          quantity: 490,
          price: 956.06,
          restockThreshold: 70,
          supplier: "Supplier A",
        },
        {
          id: "P0002",
          name: "Webcam",
          category: "Accessories",
          description: "A high-quality product used in various applications.",
          quantity: 194,
          price: 386.22,
          restockThreshold: 79,
          supplier: "Supplier B",
        },
        {
          id: "P0003",
          name: "External Hard Drive",
          category: "Electronics",
          description: "A high-quality product used in various applications.",
          quantity: 216,
          price: 792.16,
          restockThreshold: 63,
          supplier: "Supplier C",
        },
        {
          id: "P0004",
          name: "Tablet",
          category: "Accessories",
          description: "A high-quality product used in various applications.",
          quantity: 313,
          price: 656.91,
          restockThreshold: 76,
          supplier: "Supplier B",
        },
        {
          id: "P0005",
          name: "Webcam",
          category: "Office Supplies",
          description: "A high-quality product used in various applications.",
          quantity: 487,
          price: 599.59,
          restockThreshold: 50,
          supplier: "Supplier B",
        },
        {
          id: "P0006",
          name: "Smartphone",
          category: "Office Supplies",
          description: "A high-quality product used in various applications.",
          quantity: 384,
          price: 300.93,
          restockThreshold: 55,
          supplier: "Supplier C",
        },
        {
          id: "P0007",
          name: "Graphics Card",
          category: "Office Supplies",
          description: "A high-quality product used in various applications.",
          quantity: 60,
          price: 402.81,
          restockThreshold: 68,
          supplier: "Supplier C",
        },
        {
          id: "P0008",
          name: "Mouse",
          category: "Accessories",
          description: "A high-quality product used in various applications.",
          quantity: 78,
          price: 154.18,
          restockThreshold: 62,
          supplier: "Supplier A",
        },
        {
          id: "P0009",
          name: "Router",
          category: "Electronics",
          description: "A high-quality product used in various applications.",
          quantity: 373,
          price: 447.35,
          restockThreshold: 68,
          supplier: "Supplier B",
        },
        {
          id: "P0010",
          name: "Monitor",
          category: "Accessories",
          description: "A high-quality product used in various applications.",
          quantity: 107,
          price: 900.61,
          restockThreshold: 59,
          supplier: "Supplier A",
        },
        {
          id: "P0011",
          name: "Processor",
          category: "Accessories",
          description: "A high-quality product used in various applications.",
          quantity: 185,
          price: 499.55,
          restockThreshold: 50,
          supplier: "Supplier A",
        },
        {
          id: "P0012",
          name: "Monitor",
          category: "Accessories",
          description: "A high-quality product used in various applications.",
          quantity: 226,
          price: 603.8,
          restockThreshold: 52,
          supplier: "Supplier A",
        },
        {
          id: "P0013",
          name: "USB Drive",
          category: "Accessories",
          description: "A high-quality product used in various applications.",
          quantity: 421,
          price: 273.07,
          restockThreshold: 60,
          supplier: "Supplier C",
        },
        {
          id: "P0014",
          name: "Power Bank",
          category: "Office Supplies",
          description: "A high-quality product used in various applications.",
          quantity: 398,
          price: 676.32,
          restockThreshold: 61,
          supplier: "Supplier C",
        },
        {
          id: "P0015",
          name: "Desk Chair",
          category: "Electronics",
          description: "A high-quality product used in various applications.",
          quantity: 291,
          price: 442.07,
          restockThreshold: 58,
          supplier: "Supplier C",
        },
        {
          id: "P0016",
          name: "USB Drive",
          category: "Accessories",
          description: "A high-quality product used in various applications.",
          quantity: 457,
          price: 792.44,
          restockThreshold: 53,
          supplier: "Supplier A",
        },
        {
          id: "P0017",
          name: "Processor",
          category: "Office Supplies",
          description: "A high-quality product used in various applications.",
          quantity: 17,
          price: 393.68,
          restockThreshold: 98,
          supplier: "Supplier A",
        },
        {
          id: "P0018",
          name: "Printer",
          category: "Office Supplies",
          description: "A high-quality product used in various applications.",
          quantity: 298,
          price: 39.27,
          restockThreshold: 63,
          supplier: "Supplier C",
        },
        {
          id: "P0019",
          name: "Cables",
          category: "Electronics",
          description: "A high-quality product used in various applications.",
          quantity: 30,
          price: 63.1,
          restockThreshold: 76,
          supplier: "Supplier A",
        },
        {
          id: "P0020",
          name: "Gaming Console",
          category: "Electronics",
          description: "A high-quality product used in various applications.",
          quantity: 211,
          price: 277.99,
          restockThreshold: 91,
          supplier: "Supplier C",
        },
        {
          id: "P0021",
          name: "Graphics Card",
          category: "Office Supplies",
          description: "A high-quality product used in various applications.",
          quantity: 320,
          price: 65.02,
          restockThreshold: 84,
          supplier: "Supplier C",
        },
        {
          id: "P0022",
          name: "Mouse",
          category: "Office Supplies",
          description: "A high-quality product used in various applications.",
          quantity: 123,
          price: 431.01,
          restockThreshold: 74,
          supplier: "Supplier C",
        },
        {
          id: "P0023",
          name: "Power Bank",
          category: "Accessories",
          description: "A high-quality product used in various applications.",
          quantity: 380,
          price: 367.79,
          restockThreshold: 61,
          supplier: "Supplier B",
        },
        {
          id: "P0024",
          name: "External Hard Drive",
          category: "Electronics",
          description: "A high-quality product used in various applications.",
          quantity: 28,
          price: 520.65,
          restockThreshold: 86,
          supplier: "Supplier B",
        },
        {
          id: "P0025",
          name: "Monitor",
          category: "Office Supplies",
          description: "A high-quality product used in various applications.",
          quantity: 413,
          price: 502.76,
          restockThreshold: 72,
          supplier: "Supplier A",
        },
        {
          id: "P0026",
          name: "Cables",
          category: "Electronics",
          description: "A high-quality product used in various applications.",
          quantity: 191,
          price: 754.08,
          restockThreshold: 72,
          supplier: "Supplier A",
        },
        {
          id: "P0027",
          name: "Cooling Fan",
          category: "Electronics",
          description: "A high-quality product used in various applications.",
          quantity: 177,
          price: 920.05,
          restockThreshold: 92,
          supplier: "Supplier C",
        },
        {
          id: "P0028",
          name: "External Hard Drive",
          category: "Accessories",
          description: "A high-quality product used in various applications.",
          quantity: 190,
          price: 704.41,
          restockThreshold: 67,
          supplier: "Supplier B",
        },
        {
          id: "P0029",
          name: "Speakers",
          category: "Accessories",
          description: "A high-quality product used in various applications.",
          quantity: 43,
          price: 360.09,
          restockThreshold: 97,
          supplier: "Supplier B",
        },
        {
          id: "P0030",
          name: "Graphics Card",
          category: "Office Supplies",
          description: "A high-quality product used in various applications.",
          quantity: 474,
          price: 726.95,
          restockThreshold: 51,
          supplier: "Supplier C",
        },
        {
          id: "P0031",
          name: "Desk Chair",
          category: "Electronics",
          description: "A high-quality product used in various applications.",
          quantity: 276,
          price: 515.8,
          restockThreshold: 87,
          supplier: "Supplier A",
        },
        {
          id: "P0032",
          name: "USB Drive",
          category: "Accessories",
          description: "A high-quality product used in various applications.",
          quantity: 344,
          price: 89.55,
          restockThreshold: 98,
          supplier: "Supplier A",
        },
        {
          id: "P0033",
          name: "Graphics Card",
          category: "Office Supplies",
          description: "A high-quality product used in various applications.",
          quantity: 89,
          price: 181.62,
          restockThreshold: 53,
          supplier: "Supplier C",
        },
        {
          id: "P0034",
          name: "Smartphone",
          category: "Electronics",
          description: "A high-quality product used in various applications.",
          quantity: 22,
          price: 589.75,
          restockThreshold: 69,
          supplier: "Supplier B",
        },
        {
          id: "P0035",
          name: "Tablet",
          category: "Electronics",
          description: "A high-quality product used in various applications.",
          quantity: 90,
          price: 84.02,
          restockThreshold: 60,
          supplier: "Supplier A",
        },
        {
          id: "P0036",
          name: "Webcam",
          category: "Office Supplies",
          description: "A high-quality product used in various applications.",
          quantity: 39,
          price: 424.33,
          restockThreshold: 89,
          supplier: "Supplier B",
        },
        {
          id: "P0037",
          name: "Power Bank",
          category: "Accessories",
          description: "A high-quality product used in various applications.",
          quantity: 248,
          price: 354.7,
          restockThreshold: 72,
          supplier: "Supplier B",
        },
        {
          id: "P0038",
          name: "Motherboard",
          category: "Accessories",
          description: "A high-quality product used in various applications.",
          quantity: 420,
          price: 226.35,
          restockThreshold: 53,
          supplier: "Supplier C",
        },
        {
          id: "P0039",
          name: "Smartphone",
          category: "Accessories",
          description: "A high-quality product used in various applications.",
          quantity: 178,
          price: 267.86,
          restockThreshold: 56,
          supplier: "Supplier B",
        },
        {
          id: "P0040",
          name: "RAM",
          category: "Office Supplies",
          description: "A high-quality product used in various applications.",
          quantity: 229,
          price: 938.55,
          restockThreshold: 63,
          supplier: "Supplier B",
        },
        {
          id: "P0041",
          name: "Mouse",
          category: "Accessories",
          description: "A high-quality product used in various applications.",
          quantity: 237,
          price: 959.26,
          restockThreshold: 82,
          supplier: "Supplier C",
        },
        {
          id: "P0042",
          name: "Motherboard",
          category: "Accessories",
          description: "A high-quality product used in various applications.",
          quantity: 99,
          price: 531.27,
          restockThreshold: 97,
          supplier: "Supplier B",
        },
        {
          id: "P0043",
          name: "Keyboard",
          category: "Office Supplies",
          description: "A high-quality product used in various applications.",
          quantity: 186,
          price: 581.73,
          restockThreshold: 61,
          supplier: "Supplier B",
        },
        {
          id: "P0044",
          name: "Smart Watch",
          category: "Office Supplies",
          description: "A high-quality product used in various applications.",
          quantity: 166,
          price: 209.63,
          restockThreshold: 58,
          supplier: "Supplier A",
        },
        {
          id: "P0045",
          name: "Cooling Fan",
          category: "Electronics",
          description: "A high-quality product used in various applications.",
          quantity: 390,
          price: 944.96,
          restockThreshold: 59,
          supplier: "Supplier A",
        },
        {
          id: "P0046",
          name: "Gaming Console",
          category: "Office Supplies",
          description: "A high-quality product used in various applications.",
          quantity: 362,
          price: 618.69,
          restockThreshold: 72,
          supplier: "Supplier A",
        },
        {
          id: "P0047",
          name: "HDD",
          category: "Accessories",
          description: "A high-quality product used in various applications.",
          quantity: 452,
          price: 425.85,
          restockThreshold: 56,
          supplier: "Supplier C",
        },
        {
          id: "P0048",
          name: "USB Drive",
          category: "Office Supplies",
          description: "A high-quality product used in various applications.",
          quantity: 456,
          price: 407.51,
          restockThreshold: 58,
          supplier: "Supplier C",
        },
        {
          id: "P0049",
          name: "External Hard Drive",
          category: "Accessories",
          description: "A high-quality product used in various applications.",
          quantity: 292,
          price: 495.55,
          restockThreshold: 99,
          supplier: "Supplier B",
        },
        {
          id: "P0050",
          name: "Monitor",
          category: "Office Supplies",
          description: "A high-quality product used in various applications.",
          quantity: 236,
          price: 445.68,
          restockThreshold: 81,
          supplier: "Supplier C",
        },
      ]);
      // setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <Container>
      {/* <Typography variant="h4" gutterBottom>
        Inventory Management
      </Typography> */}
      <Table
        style={{
          // border: "solid 2px black",
          width: "600px",

          margin: "4em auto",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Stock Quantity</TableCell>
            <TableCell>Restock Threshold</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Supplier</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{product.restockThreshold}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.supplier}</TableCell>
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
