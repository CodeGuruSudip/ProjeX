import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getNotifications, markAsRead } from '../features/notifications/notificationSlice';
import './Notifications.css';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, isLoading } = useSelector((state) => state.notification);
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef(null);

  // Fetch notifications periodically
  useEffect(() => {
    dispatch(getNotifications());
    const interval = setInterval(() => {
      dispatch(getNotifications());
    }, 30000); // Fetch every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  // Handle click outside to close notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = useCallback(async (id) => {
    await dispatch(markAsRead(id));
  }, [dispatch]);

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  if (isLoading && !notifications.length) {
    return <div className="notifications-icon">Loading...</div>;
  }

  return (
    <div className="notifications-container" ref={notificationRef}>
      <button 
        className="notifications-trigger" 
        onClick={toggleNotifications}
        aria-label="Toggle notifications"
      >
        <span className="notifications-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notifications-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <button 
                className="close-button"
                onClick={() => setIsOpen(false)}
                aria-label="Close notifications"
              >
                ×
              </button>
            )}
          </div>
          
          <div className="notifications-list">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                >
                  <Link 
                    to={notification.link}
                    onClick={async () => {
                      if (!notification.read) {
                        await handleMarkAsRead(notification._id);
                      }
                      setIsOpen(false);
                    }}
                  >
                    <div className="notification-content">
                      <p className="notification-message">{notification.message}</p>
                      <span className="notification-time">
                        {new Date(notification.createdAt).toLocaleDateString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p className="no-notifications">No new notifications</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
