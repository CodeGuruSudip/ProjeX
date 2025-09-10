import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import '../styles/ActivityLog.css';

const ActivityLog = ({ projectId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user || !projectId) {
        setError('Missing required data');
        setLoading(false);
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        console.log('Fetching activities for project:', projectId);
        const response = await axios.get(
          `/api/activity-logs/project/${projectId}`,
          config
        );
        console.log('Activity logs response:', response.data);

        if (response.data && response.data.logs) {
          setActivities(response.data.logs);
          setError(null);
        } else {
          console.log('No logs in response:', response.data);
          setError('No activity logs found');
          setActivities([]);
        }
      } catch (error) {
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        setError(
          error.response?.data?.message || 
          error.message || 
          'Failed to load activity log'
        );
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user, projectId]);

  const getActivityIcon = (action) => {
    const icons = {
      project_created: '🚀',
      project_updated: '✏️',
      member_added: '👤',
      member_removed: '👋',
      member_role_updated: '🔄',
      task_created: '📝',
      task_updated: '📝',
      task_deleted: '🗑️',
      task_status_changed: '🔄',
      task_assigned: '👥',
      comment_added: '💬',
      file_uploaded: '📎',
      time_logged: '⏱️',
    };
    return icons[action] || '📋';
  };

  const getActivityColor = (action) => {
    const colors = {
      project_created: 'text-success',
      project_updated: 'text-warning',
      member_added: 'text-info',
      member_removed: 'text-danger',
      member_role_updated: 'text-warning',
      task_created: 'text-success',
      task_updated: 'text-warning',
      task_deleted: 'text-danger',
      task_status_changed: 'text-info',
      task_assigned: 'text-primary',
      comment_added: 'text-secondary',
      file_uploaded: 'text-info',
      time_logged: 'text-primary',
    };
    return colors[action] || 'text-secondary';
  };

  if (loading) {
    return (
      <div className="activity-log">
        <div className="activity-log-header">
          <h3 className="activity-log-title">Activity Log</h3>
        </div>
        <div className="skeleton" style={{ height: '200px' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="activity-log">
        <div className="activity-log-header">
          <h3 className="activity-log-title">Activity Log</h3>
        </div>
        <div className="text-center text-muted py-4">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-log">
      <div className="activity-log-header">
        <h3 className="activity-log-title">Activity Log</h3>
        <span className="badge badge-primary">
          {activities.length} activities
        </span>
      </div>

      <div className="activity-timeline">
        {activities.length === 0 ? (
          <div className="text-center text-muted py-4">
            <p>No activities yet</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div key={activity._id} className="activity-item">
              <div className="activity-content">
                <div className="activity-header">
                  <span className="activity-icon">
                    {getActivityIcon(activity.action)}
                  </span>
                  <div className="activity-user">
                    {activity.user?.name || 'Unknown User'}
                  </div>
                  <div className="activity-time">
                    {formatDistanceToNow(new Date(activity.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <div className={`activity-description ${getActivityColor(activity.action)}`}>
                  {activity.details}
                </div>
                {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                  <div className="activity-metadata">
                    {Object.entries(activity.metadata).map(([key, value]) => (
                      <span key={key} className="badge badge-secondary">
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityLog;