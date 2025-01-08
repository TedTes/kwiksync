import React, { useState, useEffect } from "react";
import { Package, ShoppingCart, AlertTriangle, TrendingUp } from "lucide-react";
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
const webServerURLApi = "http://localhost:3000/api/v1/analytics";
export const OverviewView = () => {
  const [weeklyData, setWeeklyData] = useState<IWeeklyData[]>([]);
  const [platformData, setPlatformData] = useState<IPlatformData[]>([]);
  const [recentActivity, setRecentActivity] = useState<IRecentActivity[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          axios.get(`${webServerURLApi}/weekly-revenue`),
          axios.get(`${webServerURLApi}/platform-performance`),
          axios.get(`${webServerURLApi}/recent-activity`),
        ]);

        const [weeklyRes, platformRes, activityRes] = results;

        if (
          weeklyRes.status === "fulfilled" &&
          Array.isArray(weeklyRes.value.data)
        )
          setWeeklyData(weeklyRes.value.data);
        else if (weeklyRes.status === "rejected")
          console.error("Error fetching weekly revenue:", weeklyRes.reason);

        if (
          platformRes.status === "fulfilled" &&
          Array.isArray(platformRes.value.data)
        )
          setPlatformData(platformRes.value.data);
        else if (platformRes.status === "rejected")
          console.error("Error fetching platform stat:", platformRes.reason);

        if (
          activityRes.status === "fulfilled" &&
          Array.isArray(activityRes.value.data)
        )
          setRecentActivity(activityRes.value.data);
        else if (activityRes.status === "rejected")
          console.error("Error fetching recent activity:", activityRes.reason);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl">
          <div className="flex items-center text-blue-600 mb-2">
            <Package className="mr-2" />
            <h3 className="font-semibold">Total Products</h3>
          </div>
          <p className="text-2xl font-bold">102</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl">
          <div className="flex items-center text-green-600 mb-2">
            <ShoppingCart className="mr-2" />
            <h3 className="font-semibold">Total Revenue</h3>
          </div>
          <p className="text-2xl font-bold">$7047.05</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl">
          <div className="flex items-center text-yellow-600 mb-2">
            <AlertTriangle className="mr-2" />
            <h3 className="font-semibold">Sync Issues</h3>
          </div>
          <p className="text-2xl font-bold">3</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl">
          <div className="flex items-center text-purple-600 mb-2">
            <TrendingUp className="mr-2" />
            <h3 className="font-semibold">Platforms</h3>
          </div>
          <p className="text-2xl font-bold">3</p>
        </div>
      </div>

      {/* Weekly Revenue Trend */}
      <div className="bg-white rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Weekly Revenue Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#4F46E5" dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Platform Performance */}
        <div className="bg-white rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Platform Performance</h3>
          <div className="space-y-4">
            {platformData.map((platform) => (
              <div key={platform.name} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{platform.name}</p>
                    <p className="text-gray-600">${platform.revenue}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={
                        platform.trend === "up"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {platform.trend === "up" ? "↑" : "↓"}{" "}
                      {Math.abs(platform.growth)}%
                    </p>
                    <p className="text-gray-600">{platform.cvr}% CVR</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Rates */}
        <div className="bg-white rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Conversion Rates</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cvr" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{activity.product}</p>
                  <p className="text-sm text-gray-600">
                    Platform: {activity.platform}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-red-600">{activity.change} units</p>
                  <p className="text-sm text-gray-600">
                    Stock: {activity.stock}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
