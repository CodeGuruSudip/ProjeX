import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import ProjectForm from '../components/ProjectForm';
import ProjectItem from '../components/ProjectItem';
import Spinner from '../components/Spinner';
import { getProjects, reset } from '../features/projects/projectSlice';
import './Dashboard.css';

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

  // Calculate dashboard statistics
  const stats = useMemo(() => {
    const completed = projects.filter(p => p.status === 'Completed').length;
    const inProgress = projects.filter(p => p.status === 'In Progress').length;
    const totalTasks = projects.reduce((acc, p) => acc + (p.tasks?.length || 0), 0);
    
    return {
      total: projects.length,
      completed,
      inProgress,
      tasks: totalTasks
    };
  }, [projects]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <div className="welcome-text">
            <h1>Welcome back, {user?.name}</h1>
            <p>Here's what's happening with your projects today.</p>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Projects</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
          <div className="stat-card">
            <h3>In Progress</h3>
            <p className="stat-value">{stats.inProgress}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-value">{stats.completed}</p>
          </div>
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <p className="stat-value">{stats.tasks}</p>
          </div>
        </div>
      </div>

      <div className="project-form-container">
        <div className="form-header">
          <h2>Create New Project</h2>
        </div>
        <ProjectForm />
      </div>

      <div className="projects-section">
        <div className="projects-header">
          <h2>Your Projects</h2>
        </div>
        {projects.length > 0 ? (
          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectItem key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="no-projects">
            <h3>No Projects Yet</h3>
            <p>Create your first project to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
