import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import { updateTask } from '../features/tasks/taskSlice';
import Column from './Column';

const KanbanBoard = ({ tasks, projectId }) => {
  const [columns, setColumns] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    const initialColumns = {
      'To Do': {
        id: 'To Do',
        title: 'To Do',
        tasks: tasks.filter((task) => task.status === 'To Do'),
      },
      'In Progress': {
        id: 'In Progress',
        title: 'In Progress',
        tasks: tasks.filter((task) => task.status === 'In Progress'),
      },
      Done: {
        id: 'Done',
        title: 'Done',
        tasks: tasks.filter((task) => task.status === 'Done'),
      },
    };
    setColumns(initialColumns);
  }, [tasks]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];

    if (start === finish) {
      const newTasks = Array.from(start.tasks);
      const [removed] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removed);

      const newColumn = {
        ...start,
        tasks: newTasks,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
      return;
    }

    // Moving from one list to another
    const startTasks = Array.from(start.tasks);
    const [removed] = startTasks.splice(source.index, 1);
    const newStart = {
      ...start,
      tasks: startTasks,
    };

    const finishTasks = Array.from(finish.tasks);
    finishTasks.splice(destination.index, 0, removed);
    const newFinish = {
      ...finish,
      tasks: finishTasks,
    };

    setColumns({
      ...columns,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    });

    dispatch(
      updateTask({ _id: draggableId, status: destination.droppableId })
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {Object.values(columns).map((column) => (
          <Column key={column.id} column={column} tasks={column.tasks} />
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
