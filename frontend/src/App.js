import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import './App.css';


function App() {
  const [view, setView] = useState('login');
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  const logout = () => {
    setToken(null);
    setRole(null);
    setView('login');
  };

  return (
    <div className="container">
      {token && <button onClick={logout}>Logout</button>}

      {!token && view === 'login' && <Login setToken={setToken} setRole={setRole} setView={setView} />}
      {!token && view === 'register' && <Register setView={setView} />}
      
      {!token && view !== 'login' && view !== 'register' && (
        <div>
          <button onClick={() => setView('login')}>Login</button>
          <button onClick={() => setView('register')}>Register</button>
        </div>
      )}

      {token && role === 'user' && <Dashboard token={token} />}
      {token && role === 'admin' && <AdminPanel token={token} />}
    </div>
  );
}

export default App;
