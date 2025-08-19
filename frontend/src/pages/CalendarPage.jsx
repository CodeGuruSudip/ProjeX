import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getMyTasks } from '../features/tasks/taskSlice';
import '../styles/Calendar.css'; // Add custom styles for animation

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(getMyTasks());
  }, [dispatch]);

  // Defensive: ensure tasks is always an array
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const events = safeTasks
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

  // Custom event style for animation
  const eventPropGetter = () => ({
    className: 'calendar-event-animated',
  });

  return (
    <div className='container calendar-fade-in'>
      <h1 className='heading'>Project Calendar</h1>
      <div style={{ height: '70vh' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ margin: '20px 0' }}
          eventPropGetter={eventPropGetter}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
