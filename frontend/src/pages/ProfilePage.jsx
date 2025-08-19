import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { reset } from '../features/auth/authSlice';
import '../styles/Profile.css';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [bio, setBio] = useState(user?.bio || '');
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(user?.profilePicture || '');
  const [loading, setLoading] = useState(false);

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('bio', bio);
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }
      const res = await axios.put('/api/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      });
      // Update localStorage and Redux state
      localStorage.setItem('user', JSON.stringify({ ...user, ...res.data }));
      toast.success('Profile updated!');
      window.location.reload(); // Quick way to refresh Redux state
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='profile-page'>
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className='profile-picture-section'>
          <label htmlFor='profilePicture'>Profile Picture</label>
          <div>
            {preview ? (
              <img
                src={preview.startsWith('http') ? preview : `${preview}`}
                alt='Profile Preview'
                style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#eee' }} />
            )}
          </div>
          <input
            type='file'
            id='profilePicture'
            accept='image/*'
            onChange={handlePictureChange}
          />
        </div>
        <div className='bio-section'>
          <label htmlFor='bio'>Bio</label>
          <textarea
            id='bio'
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            style={{ width: '100%', maxWidth: 400 }}
          />
        </div>
        <button type='submit' className='btn' disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
