import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { setToken } from '../utils/auth';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      setToken(res.data.token);
      alert("Login Success");
      navigate('/dashboard');
    } catch (err) {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          placeholder='Email'
          type="email"
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder='Password'
          type='password'
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type='submit'>Login</button>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          New user? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
