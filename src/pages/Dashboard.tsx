import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FaShippingFast, FaChartLine, FaDollarSign, FaUsers } from 'react-icons/fa';
import '../styles/dashboard.css';

interface OrderTrend {
  date: string;
  orders: number;
}

interface DashboardData {
  totalOrders: number;
  totalShipments: number;
  totalRevenue: number;
  activeCustomers: number;
  orderTrends: OrderTrend[];
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    fetch('http://127.0.0.1:8000/api/dashboard-data', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data: DashboardData) => setDashboardData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  if (!dashboardData) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      {/* Total Orders Card */}
      <div className="card total-orders">
        <div className="card-header">
          <FaShippingFast className="icon" />
          <h3 className="card-title">Orders</h3>
        </div>
        <div className="card-content">{dashboardData.totalOrders}</div>
      </div>

      {/* Total Shipments Card */}
      <div className="card total-shipments">
        <div className="card-header">
          <FaChartLine className="icon" />
          <h3 className="card-title">Shipments</h3>
        </div>
        <div className="card-content">{dashboardData.totalShipments}</div>
      </div>

      {/* Total Revenue Card */}
      <div className="card total-revenue">
        <div className="card-header">
          <FaDollarSign className="icon" />
          <h3 className="card-title">Revenue</h3>
        </div>
        <div className="card-content">${dashboardData.totalRevenue}</div>
      </div>

      {/* Active Customers Card */}
      <div className="card active-customers">
        <div className="card-header">
          <FaUsers className="icon" />
          <h3 className="card-title">Customers</h3>
        </div>
        <div className="card-content">{dashboardData.activeCustomers}</div>
      </div>

      {/* Orders Trend Chart */}
      <div className="chart-container">
        <div className="chart-card">
          <h3 className="chart-title">Orders Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.orderTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={4} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
