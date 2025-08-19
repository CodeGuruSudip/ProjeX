import { useDispatch } from 'react-redux';
import { deleteProject } from '../features/projects/projectSlice';
import { Link } from 'react-router-dom';

function ProjectItem({ project }) {
  const dispatch = useDispatch();

  return (
    <div className='card project'>
      <div style={{ color: '#888', fontSize: '0.95rem', marginBottom: 8 }}>{new Date(project.createdAt).toLocaleString('en-US')}</div>
      <h2 style={{ marginBottom: 8 }}>
        <Link to={`/project/${project._id}`}>{project.name}</Link>
      </h2>
      <button onClick={() => dispatch(deleteProject(project._id))} className='btn' style={{ float: 'right', background: 'var(--accent)', color: 'var(--primary)', fontWeight: 700, borderRadius: '999px', boxShadow: '0 2px 8px rgba(251,191,36,0.10)' }}>
        Delete
      </button>
    </div>
  );
}

export default ProjectItem;
