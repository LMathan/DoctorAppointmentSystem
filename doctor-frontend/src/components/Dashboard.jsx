import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const authHeader = { headers: { 'x-auth-token': token } };

        // Fetch current user's appointments
        const res = await axios.get('http://localhost:5000/api/appointments/my', authHeader);
        setAppointments(res.data);

        // Decode role from token
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserRole(decoded.user.role);

        // If user is a patient, load doctor list
        if (decoded.user.role === 'patient') {
          const userRes = await axios.get('http://localhost:5000/api/auth/users', authHeader);
          const doctorList = userRes.data.filter(u => u.role === 'doctor');
          setDoctors(doctorList);
        }
      } catch (error) {
        console.error("Error loading dashboard:", error);
        alert("Something went wrong while loading data.");
      }
    };

    fetchData();
  }, []);

  // Doctor accepts or rejects appointment
  const updateStatus = async (id, status) => {
    try {
      await axios.put('http://localhost:5000/api/appointments/status', { id, status }, {
        headers: { 'x-auth-token': getToken() }
      });
      window.location.reload();
    } catch (error) {
      console.error("Status update failed:", error);
      alert("Failed to update appointment");
    }
  };

  // Patient requests appointment with doctor
  const requestAppointment = async (doctorId) => {
    try {
      const date = prompt("Enter date (YYYY-MM-DD):");
      const time = prompt("Enter time (HH:MM):");

      if (!date || !time) return alert("Date and Time are required");

      await axios.post('http://localhost:5000/api/appointments', {
        doctorId, date, time
      }, {
        headers: { 'x-auth-token': getToken() }
      });

      alert("✅ Appointment Requested");
      window.location.reload();
    } catch (error) {
      console.error("Appointment request error:", error.response?.data || error.message);
      alert("❌ Failed to request appointment: " + (error.response?.data?.msg || "Unknown error"));
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ textAlign: 'center' }}>Dashboard</h2>

      {userRole === 'patient' && (
        <>
          <h3>Available Doctors</h3>
          <ul>
            {doctors.map(doctor => (
              <li key={doctor._id} style={{
                background: '#fff',
                margin: '1rem auto',
                padding: '1rem',
                maxWidth: '600px',
                borderLeft: '4px solid #007bff',
                borderRadius: '6px',
                boxShadow: '0 0 6px rgba(0,0,0,0.1)',
              }}>
                <strong>Dr. {doctor.name}</strong> ({doctor.email})<br />
                <em>Specialization: {doctor.specialization || 'N/A'}</em><br />
                <button onClick={() => requestAppointment(doctor._id)} style={{ marginTop: '0.5rem' }}>
                  Request Appointment
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <h3>My Appointments</h3>
      <ul>
        {appointments.map((a) => (
          <li key={a._id} style={{
            background: '#fff',
            margin: '1rem auto',
            padding: '1rem',
            maxWidth: '600px',
            borderLeft: '4px solid #28a745',
            borderRadius: '6px',
            boxShadow: '0 0 6px rgba(0,0,0,0.1)',
          }}>
            {userRole === 'doctor'
              ? <strong>Patient: {a.patient?.name}</strong>
              : <strong>Doctor: {a.doctor?.name}</strong>
            }<br />
            Date: {a.date} <br />
            Time: {a.time} <br />
            Status: <strong>{a.status}</strong><br />
            {userRole === 'doctor' && a.status === 'pending' && (
              <>
                <button onClick={() => updateStatus(a._id, 'confirmed')} style={{ marginRight: '0.5rem' }}>
                  Accept
                </button>
                <button onClick={() => updateStatus(a._id, 'declined')}>
                  Reject
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
