import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';

const BookAppointment = () => {
  const [form, setForm] = useState({ doctorId: '', date: '', time: '' });
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { 'x-auth-token': getToken() }
      });
      setDoctors(res.data.filter(u => u.role === 'doctor'));
    };
    fetchDoctors();
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/appointments/book', form, {
      headers: { 'x-auth-token': getToken() }
    });
    alert("Appointment Requested");
  };

  return (
    <div className="container">
      <form onSubmit={handleBook}>
        <h2>Book Appointment</h2>
        <select onChange={e => setForm({ ...form, doctorId: e.target.value })} required>
          <option value="">Select Doctor</option>
          {doctors.map(doc => (
            <option key={doc._id} value={doc._id}>{doc.name} ({doc.email})</option>
          ))}
        </select>
        <input placeholder='Date' onChange={e => setForm({...form, date: e.target.value})} required />
        <input placeholder='Time' onChange={e => setForm({...form, time: e.target.value})} required />
        <button type='submit'>Book</button>
      </form>
    </div>
  );
};

export default BookAppointment;
