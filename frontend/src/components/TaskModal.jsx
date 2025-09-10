import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, uploadAttachment, logTime } from '../features/tasks/taskSlice';
import FilePreview from './FilePreview';
import TimeTracker from './TimeTracker';
import './TaskModal.css';

const TaskModal = ({ task, onClose }) => {
  // Add animation state
  const [isVisible, setIsVisible] = useState(false);
  
  // Handle escape key
  const handleEscapeKey = useCallback((event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // Handle clicks outside modal
  const handleOutsideClick = useCallback((event) => {
    if (event.target.classList.contains('modal-backdrop')) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    // Set visibility after a short delay for entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    
    // Add event listeners
    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('mousedown', handleOutsideClick);
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'unset';
    };
  }, [handleEscapeKey, handleOutsideClick]);
  const [text, setText] = useState('');
  const [time, setTime] = useState('');
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    dispatch(addComment({ taskId: task._id, text }));
    setText('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(uploadAttachment({ taskId: task._id, file }));
    }
  };

  const handleTimeSubmit = (e) => {
    e.preventDefault();
    dispatch(logTime({ taskId: task._id, time: time * 60 })); // convert minutes to seconds
    setTime('');
  };

  if (!task) {
    return null;
  }

  return (
    <div 
      className={`modal-backdrop ${isVisible ? 'visible' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
    >
      <div 
        className={`modal-modern ${isVisible ? 'visible' : ''}`}
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <div 
          className='modal-header'
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h2 className='modal-title'>{task.name}</h2>
          <button className='btn btn-ghost' onClick={onClose}>×</button>
        </div>

        <div className='modal-body'>
          <div className='task-details'>
            <p className='task-description'>{task.description || 'No description'}</p>

            <div className='task-meta'>
              <span className={`badge badge-${task.priority?.toLowerCase() || 'medium'}`}>
                {task.priority || 'Medium'} Priority
              </span>
              <span className={`badge badge-${task.status?.toLowerCase().replace(' ', '-') || 'to-do'}`}>
                {task.status || 'To Do'}
              </span>
              {task.dueDate && (
                <span className='badge badge-warning'>
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Time Tracker */}
          <div className='time-tracker-section'>
            <h3>Time Tracking</h3>
            <TimeTracker taskId={task._id} taskName={task.name} />
            <div className='time-history'>
              <h4>Time History</h4>
              <div className='time-log-list'>
                {task.timeTracked && task.timeTracked.length > 0 ? (
                  task.timeTracked.map((log, index) => (
                    <div key={index} className='time-log-item'>
                      <div className='time-log-info'>
                        <strong>{log.user ? log.user.name : 'A user'}</strong>
                        <span>{log.time / 60} minutes</span>
                      </div>
                      <div className='time-log-date'>
                        {new Date(log.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='text-muted'>No time logged yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* File Attachments */}
          <div className='file-preview-container'>
            <div className='file-preview-header'>
              <h3>Attachments</h3>
              <label className='btn btn-secondary btn-sm'>
                <input
                  type='file'
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                Add File
              </label>
            </div>
            <div className='file-preview-grid'>
              {task.attachments && task.attachments.length > 0 ? (
                task.attachments.map((file, index) => (
                  <FilePreview key={index} file={file} />
                ))
              ) : (
                <p className='text-muted'>No attachments yet.</p>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className='comments-section'>
            <h3>Comments</h3>
            <div className='comments-list'>
              {task.comments && task.comments.length > 0 ? (
                task.comments.map((comment, index) => (
                  <div key={index} className='comment-item'>
                    <div className='comment-header'>
                      <strong>{comment.user ? comment.user.name : user.name}</strong>
                      <span className='comment-date'>
                        {new Date(comment.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className='comment-text'>{comment.text}</p>
                  </div>
                ))
              ) : (
                <p className='text-muted'>No comments yet.</p>
              )}
            </div>
            <form onSubmit={handleCommentSubmit} className='comment-form'>
              <div className='form-group'>
                <textarea
                  className='input-modern'
                  name='text'
                  id='text'
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder='Add a comment...'
                  required
                  rows={3}
                />
              </div>
              <button className='btn btn-primary' type='submit'>
                Add Comment
              </button>
            </form>
          </div>
        </div>

        <div className='modal-footer'>
          <button className='btn btn-secondary' onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
