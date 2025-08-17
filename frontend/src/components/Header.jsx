import { FaSignInAlt, FaSignOutAlt, FaUser, FaBell } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { getNotifications } from '../features/notifications/notificationSlice';
import Notifications from './Notifications';
import { useState, useEffect } from 'react';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notification);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(getNotifications());
    }
  }, [user, dispatch]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <header className='header'>
      <div className='logo'>
        <Link to='/'>ProjectManager</Link>
      </div>
      <ul>
        {user ? (
          <>
            <li>
              <div className='notification-icon' onClick={() => setShowNotifications(!showNotifications)}>
                <FaBell />
                {unreadCount > 0 && <span className='notification-badge'>{unreadCount}</span>}
              </div>
              {showNotifications && <Notifications />}
            </li>
            <li>
              <Link to='/calendar'>Calendar</Link>
            </li>
            <li>
              <Link to='/profile'>
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      marginRight: '5px'
                    }}
                  />
                ) : (
                  <FaUser />
                )}
                Profile
              </Link>
            </li>
            <li>
              <button className='btn' onClick={onLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to='/login'>
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li>
              <Link to='/register'>
                <FaUser /> Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
