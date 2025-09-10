import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';

const Column = ({ column, tasks }) => {
  return (
    <div className='modern-card' style={{ margin: '8px', borderRadius: '18px', width: '30%', background: 'var(--card-bg, #fff)', boxShadow: 'var(--shadow, 0 4px 24px rgba(37,99,235,0.08))', transition: 'box-shadow 0.2s, transform 0.2s' }}>
      <h3 style={{ padding: '8px', color: 'var(--primary, #2563eb)', fontWeight: 700 }}>{column.title}</h3>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              background: snapshot.isDraggingOver ? 'var(--accent, #fbbf24)' : '#f8fafc',
              padding: '8px',
              minHeight: '500px',
              borderRadius: '12px',
              transition: 'background 0.2s',
            }}
          >
            {tasks.map((task, index) => (
              <Task key={task._id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
