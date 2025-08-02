import { useDispatch } from 'react-redux';
import { deleteProject } from '../features/projects/projectSlice';
import { Link } from 'react-router-dom';

function ProjectItem({ project }) {
  const dispatch = useDispatch();

  return (
    <div className='project'>
      <div>{new Date(project.createdAt).toLocaleString('en-US')}</div>
      <h2>
        <Link to={`/project/${project._id}`}>{project.name}</Link>
      </h2>
      <button onClick={() => dispatch(deleteProject(project._id))} className='close'>
        X
      </button>
    </div>
  );
}

export default ProjectItem;
