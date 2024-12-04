import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { name: "10:00 AM", likes: 400, shares: 50, views: 1500 },
  { name: "11:00 AM", likes: 500, shares: 70, views: 2000 },
  { name: "12:00 PM", likes: 800, shares: 90, views: 3000 },
];

const TrendingChart: React.FC = () => {
  return (
    <LineChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="likes" stroke="#8884d8" />
      <Line type="monotone" dataKey="shares" stroke="#82ca9d" />
      <Line type="monotone" dataKey="views" stroke="#ffc658" />
    </LineChart>
  );
};

export default TrendingChart;
