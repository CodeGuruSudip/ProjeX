import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logTime } from '../features/tasks/taskSlice';

const TimeTracker = ({ taskId, taskName, onTimeLogged }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [manualTime, setManualTime] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const startTracking = () => {
    setIsTracking(true);
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTimeRef.current) / 1000);
      setElapsedTime(elapsed);
    }, 1000);
  };

  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const timeInMinutes = Math.ceil(elapsedTime / 60);
    if (timeInMinutes > 0) {
      dispatch(logTime({ taskId, time: elapsedTime }))
        .unwrap()
        .then(() => {
          if (onTimeLogged) {
            onTimeLogged(timeInMinutes);
          }
        })
        .catch((error) => {
          console.error('Error logging time:', error);
        });
    }

    setIsTracking(false);
    setElapsedTime(0);
    startTimeRef.current = null;
  };

  const handleManualLog = () => {
    const timeInSeconds = parseFloat(manualTime) * 60;
    if (timeInSeconds > 0) {
      dispatch(logTime({ taskId, time: timeInSeconds }))
        .unwrap()
        .then(() => {
          if (onTimeLogged) {
            onTimeLogged(parseFloat(manualTime));
          }
          setManualTime('');
          setShowManualInput(false);
        })
        .catch((error) => {
          console.error('Error logging time:', error);
        });
    }
  };

  return (
    <div className="time-tracker">
      <div className="time-display">
        {formatTime(elapsedTime)}
      </div>

      <div className="time-controls">
        {!isTracking ? (
          <>
            <button
              className="btn btn-success"
              onClick={startTracking}
              disabled={!taskId}
            >
              <span>▶️</span> Start Timer
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowManualInput(!showManualInput)}
            >
              <span>📝</span> Manual Entry
            </button>
          </>
        ) : (
          <button
            className="btn btn-danger"
            onClick={stopTracking}
          >
            <span>⏹️</span> Stop Timer
          </button>
        )}
      </div>

      {showManualInput && (
        <div className="manual-time-input">
          <div className="form-group">
            <label>Time spent (minutes):</label>
            <input
              type="number"
              className="input-modern"
              value={manualTime}
              onChange={(e) => setManualTime(e.target.value)}
              placeholder="Enter time in minutes"
              min="0"
              step="0.25"
            />
          </div>
          <div className="time-controls">
            <button
              className="btn btn-primary"
              onClick={handleManualLog}
              disabled={!manualTime || parseFloat(manualTime) <= 0}
            >
              Log Time
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setShowManualInput(false);
                setManualTime('');
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {taskName && (
        <div className="time-task-info">
          <small className="text-muted">
            Tracking time for: <strong>{taskName}</strong>
          </small>
        </div>
      )}
    </div>
  );
};

export default TimeTracker;