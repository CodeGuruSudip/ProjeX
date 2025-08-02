import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTasks, reset as resetTasks } from '../features/tasks/taskSlice';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import TaskForm from '../components/TaskForm';
import KanbanBoard from '../components/KanbanBoard';
import MemberManager from '../components/MemberManager';

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
    <div className='container'>
      <section className='heading'>
        <h1>{project ? project.name : 'Project'}</h1>
        <p>{project ? project.description : ''}</p>
      </section>

      {project && <MemberManager project={project} />}

      <TaskForm projectId={projectId} />

      <KanbanBoard tasks={tasks} projectId={projectId} />
    </div>
  );
}

export default Project;
