import React, { useState } from 'react';
import API from '../api';

function Register({ setView }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleRegister = async () => {
    try {
      await API.post('/register', { username, password, role });
      alert('Registered successfully. You can now login.');
      setView('login');
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <div className="form-box">
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <select onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={handleRegister}>Register</button>
        <p className="switch-link">
          Already have an account?{' '}
          <span onClick={() => setView('login')}>Login here</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
