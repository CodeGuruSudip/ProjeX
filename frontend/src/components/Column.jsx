import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';

const Column = ({ column, tasks }) => {
  return (
    <div style={{ margin: '8px', border: '1px solid lightgrey', borderRadius: '2px', width: '30%' }}>
      <h3 style={{ padding: '8px' }}>{column.title}</h3>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
              padding: '8px',
              minHeight: '500px',
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
