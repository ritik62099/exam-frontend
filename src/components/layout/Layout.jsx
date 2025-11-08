

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
            transition: margin-left 0.3s ease-in-out;
          }
          @media (max-width: 768px) {
            .layout-content {
              margin-left: 0;
              padding: 70px 15px 20px; /* space for top bar/hamburger */
            }
          }
        `}
      </style>

      <Sidebar />
      <div className="layout-content">{children}</div>
    </>
  );
};

export default Layout;
