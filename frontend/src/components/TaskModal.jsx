import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, uploadAttachment, logTime } from '../features/tasks/taskSlice';

const TaskModal = ({ task, onClose }) => {
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
    <div className='modal-backdrop'>
      <div className='modal-content'>
        <h2>{task.name}</h2>
        <p>{task.description || 'No description'}</p>

        <div className='comments-section'>
          <h3>Comments</h3>
          <div className='comments-list'>
            {task.comments && task.comments.length > 0 ? (
              task.comments.map((comment, index) => (
                <div key={index} className='comment'>
                  <p>
                    <strong>{comment.user ? comment.user.name : user.name}</strong>: {comment.text}
                  </p>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
          <form onSubmit={handleCommentSubmit}>
            <div className='form-group'>
              <textarea
                name='text'
                id='text'
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder='Add a comment'
                required
              ></textarea>
            </div>
            <div className='form-group'>
              <button className='btn' type='submit'>
                Submit
              </button>
            </div>
          </form>
        </div>

        <div className='attachments-section'>
          <h3>Attachments</h3>
          <div className='attachments-list'>
            {task.attachments && task.attachments.length > 0 ? (
              task.attachments.map((file, index) => (
                <div key={index} className='attachment'>
                  <a
                    href={`http://localhost:5000/${file.path.replace(/\\/g, '/')}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {file.filename}
                  </a>
                </div>
              ))
            ) : (
              <p>No attachments yet.</p>
            )}
          </div>
          <form>
            <div className='form-group'>
              <input type='file' name='file' onChange={handleFileChange} />
            </div>
          </form>
        </div>

        <div className='time-tracking-section'>
          <h3>Time Tracking</h3>
          <p>Total time tracked: {task.timeTracked.reduce((acc, curr) => acc + curr.time, 0) / 60} minutes</p>
          <div className='time-log-list'>
            {task.timeTracked && task.timeTracked.length > 0 ? (
              task.timeTracked.map((log, index) => (
                <div key={index} className='time-log'>
                  <p>
                    <strong>{log.user ? log.user.name : 'A user'}</strong> logged {log.time / 60} minutes on {new Date(log.date).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No time logged yet.</p>
            )}
          </div>
          <form onSubmit={handleTimeSubmit}>
            <div className='form-group'>
              <input
                type='number'
                name='time'
                id='time'
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder='Log time in minutes'
                required
              />
            </div>
            <div className='form-group'>
              <button className='btn' type='submit'>
                Log Time
              </button>
            </div>
          </form>
        </div>

        <button onClick={onClose} className='btn btn-reverse'>
          Close
        </button>
      </div>
    </div>
  );
};

export default TaskModal;
