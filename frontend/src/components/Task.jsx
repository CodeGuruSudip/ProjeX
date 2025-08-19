import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import TaskModal from './TaskModal';

const Task = ({ task, index }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <>
      <Draggable draggableId={task._id} index={index}>
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onClick={handleOpenModal}
            style={{
              userSelect: 'none',
              padding: '16px',
              margin: '0 0 12px 0',
              minHeight: '50px',
              backgroundColor: snapshot.isDragging ? 'var(--accent, #fbbf24)' : 'var(--primary, #2563eb)',
              color: snapshot.isDragging ? 'var(--primary, #2563eb)' : '#fff',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '1rem',
              transition: 'background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s',
              transform: snapshot.isDragging ? 'scale(1.04)' : 'scale(1)',
              ...provided.draggableProps.style,
            }}
          >
            {task.name}
          </div>
        )}
      </Draggable>
      {isModalOpen && <TaskModal task={task} onClose={handleCloseModal} />}
    </>
  );
};

export default Task;
