import React, { useState } from 'react';
import API from '../api';

function Login({ setToken, setRole, setView }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await API.post('/login', { username, password });
      setToken(res.data.token);
      setRole(res.data.role);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div className="auth-container">
      <h2> Online Voting System</h2>
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
        <button onClick={handleLogin}>Login</button>
        <p className="switch-link">
          Don’t have an account?{' '}
          <span onClick={() => setView('register')}>Register here</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
