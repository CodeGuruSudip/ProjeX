import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTask } from '../features/tasks/taskSlice';

function TaskForm({ projectId }) {
  const [name, setName] = useState('');

  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(createTask({ projectId, taskData: { name } }));
    setName('');
  };

  return (
    <section className='form'>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='name'>Task</label>
          <input
            type='text'
            name='name'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <button className='btn btn-block' type='submit'>
            Add Task
          </button>
        </div>
      </form>
    </section>
  );
}

export default TaskForm;
