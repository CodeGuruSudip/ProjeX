import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTask } from '../features/tasks/taskSlice';

function TaskForm({ projectId, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
  });

  const { name, description, priority, dueDate } = formData;
  const dispatch = useDispatch();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(createTask({ 
        projectId, 
        taskData: formData 
      })).unwrap();
      
      if (onClose) onClose();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  return (
    <div className='task-form-container'>
      <h3 className='form-title'>Create New Task</h3>
      <form onSubmit={onSubmit} className='task-form'>
        <div className='form-group'>
          <label htmlFor='name'>Task Name</label>
          <input
            type='text'
            className='form-control'
            id='name'
            name='name'
            value={name}
            onChange={onChange}
            placeholder='Enter task name'
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='description'>Description</label>
          <textarea
            className='form-control'
            id='description'
            name='description'
            value={description}
            onChange={onChange}
            placeholder='Enter task description'
            rows='3'
          />
        </div>

        <div className='form-row'>
          <div className='form-group'>
            <label htmlFor='priority'>Priority</label>
            <select
              className='form-control'
              id='priority'
              name='priority'
              value={priority}
              onChange={onChange}
            >
              <option value='Low'>Low</option>
              <option value='Medium'>Medium</option>
              <option value='High'>High</option>
            </select>
          </div>

          <div className='form-group'>
            <label htmlFor='dueDate'>Due Date</label>
            <input
              type='date'
              className='form-control'
              id='dueDate'
              name='dueDate'
              value={dueDate}
              onChange={onChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className='form-actions'>
          {onClose && (
            <button type='button' className='btn btn-secondary' onClick={onClose}>
              Cancel
            </button>
          )}
          <button type='submit' className='btn btn-primary'>
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
