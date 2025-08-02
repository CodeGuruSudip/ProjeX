import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getNotifications, markAsRead } from '../features/notifications/notificationSlice';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, isLoading } = useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  if (isLoading) {
    return <p>Loading notifications...</p>;
  }

  return (
    <div className='notifications-dropdown'>
      <h3>Notifications</h3>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div
            key={notification._id}
            className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            onClick={() => handleMarkAsRead(notification._id)}
          >
            <Link to={notification.link}>{notification.message}</Link>
          </div>
        ))
      ) : (
        <p>No new notifications.</p>
      )}
    </div>
  );
};

export default Notifications;
