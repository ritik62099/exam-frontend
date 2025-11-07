

// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const Sidebar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   const menuItems =
//     user?.role === 'admin'
//       ? [
//         { label: 'Users', path: '/admin' },
//         { label: 'Add Student', path: '/admin/add-student' },
//         { label: 'Exams', path: '/admin/exams' },
//         { label: 'Create Exam', path: '/admin/create-exam' },
//         { label: 'Results', path: '/admin/results' },
//       ]
//       : [
//         { label: 'Exams', path: '/student' },
//         { label: 'Results', path: '/student/results' },
//       ];

//   return (
//     <>
//       <style>
//         {`
//           .sidebar {
//             width: 250px;
//             background: #2d3748;
//             color: white;
//             height: 100vh;
//             position: fixed;
//             top: 0;
//             left: 0;
//             padding-top: 20px;
//             box-shadow: 2px 0 10px rgba(0,0,0,0.1);
//             z-index: 100;
//           }
//           .sidebar-header {
//             padding: 0 20px 20px;
//             border-bottom: 1px solid #4a5568;
//           }
//           .sidebar-header h3 {
//             margin: 0;
//             font-size: 1.2rem;
//           }
//           .sidebar-header p {
//             margin: 5px 0 0;
//             font-size: 0.95rem;
//             color: #cbd5e0;
//           }
//           .sidebar-menu {
//             list-style: none;
//             padding: 0;
//             margin: 0;
//           }
//           .sidebar-menu li {
//             padding: 12px 20px;
//             cursor: pointer;
//             transition: background 0.2s;
//           }
//           .sidebar-menu li:hover,
//           .sidebar-menu li.active {
//             background: #4a5568;
//             font-weight: bold;
//           }
//           .logout-btn {
//             position: absolute;
//             bottom: 20px;
//             left: 20px;
//             width: calc(100% - 40px);
//             padding: 10px;
//             background: #e53e3e;
//             color: white;
//             border: none;
//             border-radius: 4px;
//             cursor: pointer;
//             text-align: left;
//           }
//         `}
//       </style>

//       <div className="sidebar">
//         <div className="sidebar-header">
//           <h3>{user?.role === 'admin' ? 'Admin Panel' : 'Student Portal'}</h3>
//           {/* 👇 Show student name if user is student */}
//           {user?.role === 'student' && (
//             <p>Welcome, {user?.username || 'Student'}</p>
//           )}
//         </div>

//         <ul className="sidebar-menu">
//           {menuItems.map((item, index) => (
//             <li
//               key={index}
//               onClick={() => navigate(item.path)}
//               className={location.pathname === item.path ? 'active' : ''}
//             >
//               {item.label}
//             </li>
//           ))}
//         </ul>

//         <button className="logout-btn" onClick={handleLogout}>
//           Logout
//         </button>
//       </div>
//     </>
//   );
// };

// export default Sidebar;


import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems =
    user?.role === 'admin'
      ? [
          { label: 'Users', path: '/admin' },
          { label: 'Add Student', path: '/admin/add-student' },
          { label: 'Exams', path: '/admin/exams' },
          { label: 'Create Exam', path: '/admin/create-exam' },
          { label: 'Results', path: '/admin/results' },
        ]
      : [
          { label: 'Exams', path: '/student' },
          { label: 'Results', path: '/student/results' },
        ];

  return (
    <>
      <style>
        {`
          .sidebar {
            width: 250px;
            background: #2d3748;
            color: white;
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            padding-top: 20px;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            z-index: 100;
          }
          .sidebar-header {
            padding: 0 20px 20px;
            border-bottom: 1px solid #4a5568;
          }
          .sidebar-header h3 {
            margin: 0;
            font-size: 1.2rem;
          }
          .sidebar-header p {
            margin: 5px 0 0;
            font-size: 0.9rem;
            color: #cbd5e0;
          }
          .sidebar-menu {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .sidebar-menu li {
            padding: 12px 20px;
            cursor: pointer;
            transition: background 0.2s;
          }
          .sidebar-menu li:hover,
          .sidebar-menu li.active {
            background: #4a5568;
            font-weight: bold;
          }
          .logout-btn {
            position: absolute;
            bottom: 20px;
            left: 20px;
            width: calc(100% - 40px);
            padding: 10px;
            background: #e53e3e;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-align: left;
          }
        `}
      </style>

      <div className="sidebar">
        <div className="sidebar-header">
          <h3>{user?.role === 'admin' ? 'Admin Panel' : 'Student Portal'}</h3>

          {/* 👇 Show student details */}
          {user?.role === 'student' && (
            <>
              <p>Welcome, {user?.username || 'Student'}</p>
              {user?.registrationNumber && (
                <p>Reg. No: {user.registrationNumber}</p>
              )}
            </>
          )}
        </div>

        <ul className="sidebar-menu">
          {menuItems.map((item, index) => (
            <li
              key={index}
              onClick={() => navigate(item.path)}
              className={location.pathname === item.path ? 'active' : ''}
            >
              {item.label}
            </li>
          ))}
        </ul>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;
