import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    specialization: ''
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only send specialization if role is doctor
    const payload = { ...form };
    if (form.role !== 'doctor') {
      delete payload.specialization;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', payload);
      alert("✅ Registered Successfully");
      navigate('/');
    } catch (err) {
      alert("❌ Registration failed: " + (err.response?.data?.msg || "Check form fields"));
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input
          placeholder="Name"
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          required
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        {/* Show specialization input only if role is doctor */}
        {form.role === 'doctor' && (
          <input
            placeholder="Specialization (e.g. Cardiologist)"
            type="text"
            value={form.specialization}
            onChange={(e) => setForm({ ...form, specialization: e.target.value })}
            required
          />
        )}

        <button type="submit">Register</button>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
