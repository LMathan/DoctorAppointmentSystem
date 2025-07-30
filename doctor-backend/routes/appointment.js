const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Appointment = require("../models/Appointment");
const User = require("../models/User");

// GET appointments for logged-in user
router.get("/my", auth, async (req, res) => {
  try {
    const filter = req.user.role === "doctor"
      ? { doctor: req.user.id }
      : { patient: req.user.id };

    const appointments = await Appointment.find(filter)
      .populate("patient", "name")
      .populate("doctor", "name");

    res.json(appointments);
  } catch (err) {
    console.error("Error getting appointments:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// POST new appointment (patient -> doctor)
router.post("/", auth, async (req, res) => {
  const { doctorId, date, time } = req.body;

  if (!doctorId || !date || !time) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(400).json({ msg: "Invalid doctor" });
    }

    const newAppointment = new Appointment({
      doctor: doctorId,
      patient: req.user.id,
      date,
      time,
      status: "pending",
    });

    await newAppointment.save();
    res.json({ msg: "Appointment requested" });
  } catch (err) {
    console.error("❌ Failed to create appointment:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// PUT to update status (used by doctors)
router.put("/status", auth, async (req, res) => {
  const { id, status } = req.body;

  try {
    const appt = await Appointment.findById(id);
    if (!appt) return res.status(404).json({ msg: "Appointment not found" });

    if (req.user.role !== "doctor" || appt.doctor.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    appt.status = status;
    await appt.save();
    res.json({ msg: "Status updated" });
  } catch (err) {
    console.error("Error updating status:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
