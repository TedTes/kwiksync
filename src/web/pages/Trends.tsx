import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trend } from "../types";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const Trends: React.FC = () => {
  const [trends, setTrends] = useState<Trend[]>([]);

  const fetchTrends = async (): Promise<void> => {
    try {
      const response = await axios.get("/analytics/sales", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTrends(response.data.report);
    } catch (error) {
      console.error("Error fetching trends:", error);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  return (
    <Container>
      {/* <Typography variant="h4" gutterBottom>
        Real-Time Trend Tracking
      </Typography> */}
      <Table style={{ border: "2px black solid", maxWidth: "400px" }}>
        <TableHead>
          <TableRow>
            <TableCell>Product ID</TableCell>
            <TableCell>Total Quantity Sold</TableCell>
            <TableCell>Total Revenue</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trends.map((trend) => (
            <TableRow key={trend.productId}>
              <TableCell>{trend.productId}</TableCell>
              <TableCell>{trend.totalQuantity}</TableCell>
              <TableCell>{trend.totalRevenue}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default Trends;
