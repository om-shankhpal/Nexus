const Complaint = require("../models/Complaint");

async function createComplaint(req, res, next) {
  try {
    const { subject, description } = req.body || {};

    if (!subject || !description) {
      const e = new Error("subject and description are required");
      e.statusCode = 400;
      throw e;
    }

    const complaint = await Complaint.create({
      user: req.user.id,
      subject: String(subject).trim(),
      description: String(description).trim(),
      status: "OPEN",
    });

    return res.status(201).json({ success: true, data: complaint });
  } catch (err) {
    next(err);
  }
}

async function getMyComplaints(req, res, next) {
  try {
    const complaints = await Complaint.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: complaints });
  } catch (err) {
    next(err);
  }
}

module.exports = { createComplaint, getMyComplaints };
