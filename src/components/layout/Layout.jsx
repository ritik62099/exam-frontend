// src/components/layout/Layout.jsx
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <>
      <style>
        {`
          .layout-content {
            margin-left: 250px;
            padding: 20px;
            min-height: 100vh;
            background: #f9fafb;
          }
          @media (max-width: 768px) {
            .sidebar {
              width: 200px;
            }
            .layout-content {
              margin-left: 200px;
            }
          }
        `}
      </style>

      <Sidebar />
      <div className="layout-content">
        {children}
      </div>
    </>
  );
};

export default Layout;