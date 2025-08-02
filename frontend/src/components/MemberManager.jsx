import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMember, removeMember, updateMemberRole } from '../features/projects/projectSlice';

const MemberManager = ({ project }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Viewer');

  const { user } = useSelector((state) => state.auth);

  const handleAddMember = (e) => {
    e.preventDefault();
    dispatch(addMember({ projectId: project._id, email, role }));
    setEmail('');
    setRole('Viewer');
  };

  const handleRemoveMember = (userId) => {
    dispatch(removeMember({ projectId: project._id, userId }));
  };

  const handleRoleChange = (userId, newRole) => {
    dispatch(updateMemberRole({ projectId: project._id, userId, role: newRole }));
  };

  const isOwner = project.owner === user._id;

  return (
    <div className='member-manager'>
      <h3>Members</h3>
      {isOwner && (
        <form onSubmit={handleAddMember}>
          <input
            type='email'
            placeholder='User email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value='Viewer'>Viewer</option>
            <option value='Editor'>Editor</option>
            <option value='Admin'>Admin</option>
          </select>
          <button type='submit'>Add Member</button>
        </form>
      )}
      <ul>
        {project.members.map((member) => (
          <li key={member.user._id}>
            {member.user.name} ({member.user.email}) - {member.role}
            {isOwner && member.user._id !== project.owner && (
              <>
                <select
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.user._id, e.target.value)}
                >
                  <option value='Viewer'>Viewer</option>
                  <option value='Editor'>Editor</option>
                  <option value='Admin'>Admin</option>
                </select>
                <button onClick={() => handleRemoveMember(member.user._id)}>Remove</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberManager;
