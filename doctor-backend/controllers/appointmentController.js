const Appointment = require("../models/Appointment");
const User = require("../models/User");

exports.bookAppointment = async (req, res) => {
  const { doctorId, date, time } = req.body;
  try {
    const appointment = new Appointment({
      patient: req.user.id,
      doctor: doctorId,
      date,
      time
    });
    await appointment.save();
    res.json({ msg: "Appointment requested", appointment });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.getAppointments = async (req, res) => {
  try {
    let appointments;
    if (req.user.role === "doctor") {
      appointments = await Appointment.find({ doctor: req.user.id }).populate("patient");
    } else {
      appointments = await Appointment.find({ patient: req.user.id }).populate("doctor");
    }
    res.json(appointments);
  } catch (err) {
    res.status(500).send("Server error");
  }
};
