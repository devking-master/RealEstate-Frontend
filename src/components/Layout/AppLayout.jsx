import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';

const AppLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
