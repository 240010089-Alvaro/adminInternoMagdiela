import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClientList from './pages/clients/ClientList';
import SaleList from './pages/sales/SaleList';
import NewSale from './pages/sales/NewSale';
import CreditList from './pages/credits/CreditList';
import Reports from './pages/reports/Reports';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'var(--bg-dark)'}}><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'var(--bg-dark)'}}><div className="spinner" /></div>;
  if (user) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { background: '#231D2E', color: '#F5F0F7', border: '1px solid #3A3248', borderRadius: '12px' } }} />
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="clientas" element={<ClientList />} />
            <Route path="ventas" element={<SaleList />} />
            <Route path="nueva-venta" element={<NewSale />} />
            <Route path="creditos" element={<CreditList />} />
            <Route path="reportes" element={<Reports />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
