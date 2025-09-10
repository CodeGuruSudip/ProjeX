import { FaSignOutAlt, FaBell, FaUser, FaHome, FaCalendar, FaCog } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { useState } from 'react';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showNotifications, setShowNotifications] = useState(false);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  const navigationItems = [
    { path: '/', icon: <FaHome />, label: 'Dashboard' },
    { path: '/calendar', icon: <FaCalendar />, label: 'Calendar' },
    { path: '/profile', icon: <FaUser />, label: 'Profile' },
  ];

  return (
    <header className='header-modern'>
      <div className='header-content'>
        <div className='header-logo' onClick={() => navigate('/')}>
          <div className='logo-icon'>🚀</div>
          <span className='logo-text'>ProjeX</span>
        </div>

        <nav className='header-nav'>
          {navigationItems.map((item) => (
            <button
              key={item.path}
              className={`header-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              title={item.label}
            >
              {item.icon}
              <span className='nav-label'>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className='header-actions'>
          <button
            className='header-nav-item'
            onClick={() => setShowNotifications(!showNotifications)}
            title='Notifications'
          >
            <FaBell />
            <span className='notification-badge'>3</span>
          </button>

          <div className='user-menu'>
            <div className='user-avatar'>
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} />
              ) : (
                <div className='avatar-placeholder'>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className='user-info'>
              <span className='user-name'>{user?.name}</span>
              <span className='user-role'>{user?.role || 'Member'}</span>
            </div>
            <button
              className='btn btn-ghost btn-sm'
              onClick={onLogout}
              title='Logout'
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className='notifications-dropdown'>
          <div className='notifications-header'>
            <h3>Notifications</h3>
            <button
              className='btn btn-ghost btn-sm'
              onClick={() => setShowNotifications(false)}
            >
              ×
            </button>
          </div>
          <div className='notifications-list'>
            <div className='notification-item'>
              <div className='notification-content'>
                <p>You have been assigned to "Website Redesign" task</p>
                <span className='notification-time'>2 hours ago</span>
              </div>
            </div>
            <div className='notification-item'>
              <div className='notification-content'>
                <p>Project "Mobile App" deadline approaching</p>
                <span className='notification-time'>1 day ago</span>
              </div>
            </div>
            <div className='notification-item'>
              <div className='notification-content'>
                <p>New comment on "API Integration" task</p>
                <span className='notification-time'>2 days ago</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
