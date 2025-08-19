import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProject } from '../features/projects/projectSlice';

function ProjectForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(createProject({ name, description }));
    setName('');
    setDescription('');
  };

  return (
    <section className='form card' style={{ marginBottom: 32 }}>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='name'>Project Name</label>
          <input
            type='text'
            name='name'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='description'>Project Description</label>
          <input
            type='text'
            name='description'
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <button className='btn btn-block' type='submit'>
            Add Project
          </button>
        </div>
      </form>
    </section>
  );
}

export default ProjectForm;
