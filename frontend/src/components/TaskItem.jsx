function TaskItem({ task }) {
  return (
    <div className='card task' style={{ marginBottom: 16 }}>
      <div style={{ color: '#888', fontSize: '0.95rem', marginBottom: 8 }}>{new Date(task.createdAt).toLocaleString('en-US')}</div>
      <h2 style={{ marginBottom: 8 }}>{task.name}</h2>
    </div>
  );
}

export default TaskItem;
