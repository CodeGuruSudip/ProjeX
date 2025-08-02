import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getMyTasks } from '../features/tasks/taskSlice';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(getMyTasks());
  }, [dispatch]);

  const events = (tasks || [])
    .filter((task) => task.dueDate)
    .map(task => ({
      title: task.name,
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
      allDay: true,
      resource: task,
    }));

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className='container'>
      <h1 className='heading'>Project Calendar</h1>
      <div style={{ height: '70vh' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ margin: '20px 0' }}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
