import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import ProjectForm from '../components/ProjectForm';
import ProjectItem from '../components/ProjectItem';
import Spinner from '../components/Spinner';
import { getProjects, reset } from '../features/projects/projectSlice';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { projects, isLoading, isError, message } = useSelector(
    (state) => state.projects
  );

  useEffect(() => {
    if (!user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
      return;
    }

    if (isError) {
      console.error('Error:', message);
      toast.error(message);
      return;
    }

    console.log('Fetching projects...');
    dispatch(getProjects())
      .unwrap()
      .then((projects) => {
        console.log('Projects fetched:', projects);
      })
      .catch((error) => {
        console.error('Failed to fetch projects:', error);
        toast.error('Failed to load projects');
      });

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className='heading'>
        <h1>Welcome {user && user.name}</h1>
        <p>Projects Dashboard</p>
      </section>

      <ProjectForm />

      <section className='content'>
        {projects.length > 0 ? (
          <div className='projects'>
            {projects.map((project) => (
              <ProjectItem key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <h3>You have not set any projects</h3>
        )}
      </section>
    </>
  );
}

export default Dashboard;
