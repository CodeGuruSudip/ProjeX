import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTasks, reset as resetTasks } from '../features/tasks/taskSlice';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import TaskForm from '../components/TaskForm';
import KanbanBoard from '../components/KanbanBoard';
import MemberManager from '../components/MemberManager';
import ActivityLog from '../components/ActivityLog';

function Project() {
  const dispatch = useDispatch();
  const { projectId } = useParams();

  const { tasks, isLoading: tasksLoading, isError: tasksError, message: tasksMessage } = useSelector(
    (state) => state.tasks
  );
  const { projects, isLoading: projectsLoading } = useSelector(
    (state) => state.projects
  );

  const project = projects.find((p) => p._id === projectId);

  useEffect(() => {
    if (tasksError) {
      console.log(tasksMessage);
    }

    dispatch(getTasks(projectId));

    return () => {
      dispatch(resetTasks());
    };
  }, [dispatch, tasksError, tasksMessage, projectId]);

  if (projectsLoading || tasksLoading) {
    return <Spinner />;
  }

  return (
    <div className='modern-container'>
      <div className="project-header">
        <div className="project-info">
          <h1 className="project-title">{project ? project.name : 'Project'}</h1>
          <p className="project-description">{project ? project.description : ''}</p>
        </div>
        <div className="project-stats">
          <div className="stat-item">
            <span className="stat-number">{tasks.length}</span>
            <span className="stat-label">Tasks</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {project ? project.members.length : 0}
            </span>
            <span className="stat-label">Members</span>
          </div>
        </div>
      </div>

      <div className="project-content">
        <div className="project-main">
          {project && <MemberManager project={project} />}

          <div className="modern-card">
            <TaskForm projectId={projectId} />
          </div>

          <div className="kanban-section">
            <h2 className="section-title">Task Board</h2>
            <KanbanBoard tasks={tasks} projectId={projectId} />
          </div>
        </div>

        <div className="project-sidebar">
          <ActivityLog projectId={projectId} />
        </div>
      </div>
    </div>
  );
}

export default Project;
