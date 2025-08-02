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
              margin: '0 0 8px 0',
              minHeight: '50px',
              backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
              color: 'white',
              cursor: 'pointer',
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
