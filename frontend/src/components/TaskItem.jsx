function TaskItem({ task }) {
  return (
    <div className='task'>
      <div>{new Date(task.createdAt).toLocaleString('en-US')}</div>
      <h2>{task.name}</h2>
    </div>
  );
}

export default TaskItem;
