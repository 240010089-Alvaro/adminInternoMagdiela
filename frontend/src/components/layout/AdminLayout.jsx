import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="admin-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
