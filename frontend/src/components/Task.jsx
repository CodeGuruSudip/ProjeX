import React, { useState, useCallback, memo } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import TaskModal from './TaskModal';
import './Task.css';

const Task = memo(({ task, index }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = useCallback(() => setModalOpen(true), []);
  const handleCloseModal = useCallback(() => setModalOpen(false), []);

  const taskStyle = useCallback((isDragging) => ({
    userSelect: 'none',
    padding: '16px',
    margin: '0 0 12px 0',
    minHeight: '50px',
    backgroundColor: isDragging ? 'var(--accent, #fbbf24)' : 'var(--primary, #2563eb)',
    color: isDragging ? 'var(--primary, #2563eb)' : '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
    cursor: isDragging ? 'grabbing' : 'pointer',
    fontWeight: 500,
    fontSize: '1rem',
    willChange: 'transform, background-color, color',
    transform: isDragging ? 'scale(1.04)' : 'scale(1)',
    transition: 'background-color 0.2s ease, color 0.2s ease, transform 0.2s ease'
  }), []);

  const handleClick = useCallback((e, isDragging) => {
    if (!isDragging) {
      e.preventDefault();
      handleOpenModal();
    }
  }, [handleOpenModal]);

  return (
    <>
      <Draggable draggableId={task._id} index={index}>
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onClick={(e) => handleClick(e, snapshot.isDragging)}
            style={{
              ...taskStyle(snapshot.isDragging),
              ...provided.draggableProps.style
            }}
          >
            <div className="task-content">
              {task.name}
              {task.priority && (
                <span className={`task-priority priority-${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
              )}
            </div>
          </div>
        )}
      </Draggable>
      {isModalOpen && (
        <TaskModal 
          task={task} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
});

// Add display name for debugging
Task.displayName = 'Task';

export default Task;
