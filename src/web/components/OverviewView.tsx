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
import { api } from "../config";
import { useUserStore } from "../store";
export const OverviewView = () => {
  const [weeklyData, setWeeklyData] = useState<IWeeklyData[]>([]);
  const [platformData, setPlatformData] = useState<IPlatformData[]>([]);
  const [recentActivity, setRecentActivity] = useState<IRecentActivity[]>([]);
  const [metrics, setMetrics] = useState<MerchantMetrics[]>([]);
  const { user } = useUserStore();
  useEffect(() => {
    const fetchData = async () => {
      const userId = user && user.id;
      try {
        const results = await Promise.allSettled([
          api.get(`/analytics/weekly-revenue`),
          api.get(`/analytics/platform-performance`),
          api.get(`/analytics/recent-activity`),
          api.get(`/metrics?id=${userId}`),
        ]);
        results.forEach((result, index) => {
          if (
            result.status === "fulfilled" &&
            Array.isArray(result.value.data)
          ) {
            switch (index) {
              case 0:
                setWeeklyData(result.value.data);
                break;
              case 1:
                setPlatformData(result.value.data);
                break;
              case 2:
                setRecentActivity(result.value.data);
                break;
              case 3:
                setMetrics(result.value.data);
                break;
            }
          } else if (result.status === "rejected") {
            console.error("Error", result.reason);
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center p-8 text-gray-500 bg-gray-50 rounded-lg">
      <Package className="w-12 h-12 mb-3 text-gray-400" />{" "}
      <p className="text-base font-medium">{message}</p>
      {/* <p className="text-sm mt-1">No data available at the moment</p> */}
    </div>
  );
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl">
          <div className="flex items-center text-blue-600 mb-2">
            <Package className="mr-2" />
            <h3 className="font-semibold">Total Products</h3>
          </div>
          <p className="text-2xl font-bold">
            ${metrics[0]?.totalProducts || 0}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl">
          <div className="flex items-center text-green-600 mb-2">
            <ShoppingCart className="mr-2" />
            <h3 className="font-semibold">Total Revenue</h3>
          </div>
          <p className="text-2xl font-bold">${metrics[0]?.totalRevenue || 0}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl">
          <div className="flex items-center text-yellow-600 mb-2">
            <AlertTriangle className="mr-2" />
            <h3 className="font-semibold">Sync Issues</h3>
          </div>
          <p className="text-2xl font-bold">${metrics[0]?.syncIssues || 0}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl">
          <div className="flex items-center text-purple-600 mb-2">
            <TrendingUp className="mr-2" />
            <h3 className="font-semibold">Platforms</h3>
          </div>
          <p className="text-2xl font-bold">
            ${metrics[0]?.platformCount || 0}
          </p>
        </div>
      </div>

      {/* Weekly Revenue Trend */}
      <div className="bg-white rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Weekly Revenue Trend</h3>
        <div className="h-64">
          {weeklyData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#4F46E5" dot />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No Weekly data available" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Platform Performance */}
        <div className="bg-white rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Platform Performance</h3>
          <div className="space-y-4">
            {platformData.length ? (
              platformData.map((platform) => (
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
              ))
            ) : (
              <EmptyState message="No platform data available" />
            )}
          </div>
        </div>

        {/* Conversion Rates */}
        <div className="bg-white rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Conversion Rates</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {platformData.length ? (
                <BarChart data={platformData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cvr" fill="#4F46E5" />
                </BarChart>
              ) : (
                <EmptyState message="No conversion rate available" />
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.length ? (
            recentActivity.map((activity, index) => (
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
            ))
          ) : (
            <EmptyState message="No Recent activity available" />
          )}
        </div>
      </div>
    </div>
  );
};
