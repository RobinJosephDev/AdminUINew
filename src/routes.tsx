import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import ProtectedRoute from './components/common/ProtectedRoute';
import UserProvider from './UserProvider';

const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LeadsPage = lazy(() => import('./pages/CRM/LeadsPage'));
const LeadFollowupPage = lazy(() => import('./pages/CRM/LeadFollowupPage'));
const LeadQuotesPage = lazy(() => import('./pages/Sales/LeadQuotesPage'));
const CustomersPage = lazy(() => import('./pages/Customers/CustomersPage'));
const OrderPage = lazy(() => import('./pages/Orders/OrderPage'));
const CarrierPage = lazy(() => import('./pages/Carriers&Co/CarrierPage'));
const VendorPage = lazy(() => import('./pages/Carriers&Co/VendorPage'));
const BrokerPage = lazy(() => import('./pages/Carriers&Co/BrokerPage'));
const UserPage = lazy(() => import('./pages/Users/UserPage'));
const QuotePage = lazy(() => import('./pages/Sales/QuotePage'));

const AppRoutes: React.FC = () => (
  <UserProvider>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Auth */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* CRM */}
        <Route
          path="/lead"
          element={
            <ProtectedRoute>
              <LeadsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/follow-up"
          element={
            <ProtectedRoute>
              <LeadFollowupPage />
            </ProtectedRoute>
          }
        />

        {/* Quotes */}
        <Route
          path="/quotes-lead"
          element={
            <ProtectedRoute>
              <LeadQuotesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quote"
          element={
            <ProtectedRoute>
              <QuotePage />
            </ProtectedRoute>
          }
        />

        {/* Customer */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute>
              <CustomersPage />
            </ProtectedRoute>
          }
        />

        {/* Order */}
        <Route
          path="/order"
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />

        {/* User */}
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />

        {/* CarrierS&Co */}
        <Route
          path="/carrier"
          element={
            <ProtectedRoute>
              <CarrierPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor"
          element={
            <ProtectedRoute>
              <VendorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/broker"
          element={
            <ProtectedRoute>
              <BrokerPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  </UserProvider>
);

export default AppRoutes;
