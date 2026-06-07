const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { doctors, patients } = require('../data/store');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// GET /api/doctors — list with optional search/filter
router.get('/', (req, res) => {
  const { q, specialization, department } = req.query;
  let result = [...doctors];

  if (q) {
    const lower = q.toLowerCase();
    result = result.filter(d =>
      d.firstName.toLowerCase().includes(lower) ||
      d.lastName.toLowerCase().includes(lower) ||
      d.email.toLowerCase().includes(lower) ||
      d.licenseNumber.toLowerCase().includes(lower)
    );
  }
  if (specialization) result = result.filter(d => d.specialization === specialization);
  if (department) result = result.filter(d => d.department === department);

  res.json(result);
});

// GET /api/doctors/:id
router.get('/:id', (req, res) => {
  const doctor = doctors.find(d => d.id === req.params.id);
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

  const doctorPatients = patients.filter(p => p.doctorId === doctor.id);
  res.json({ ...doctor, patients: doctorPatients });
});

// POST /api/doctors — admin only
router.post('/', authorize('admin'), (req, res) => {
  const { firstName, lastName, specialization, department, phone, email, licenseNumber, availability } = req.body;
  if (!firstName || !lastName || !specialization || !department || !phone || !email || !licenseNumber)
    return res.status(400).json({ error: 'Missing required fields' });

  if (doctors.find(d => d.email === email))
    return res.status(409).json({ error: 'Email already exists' });

  const doctor = { id: uuidv4(), firstName, lastName, specialization, department, phone, email, licenseNumber, availability: availability || '', createdAt: new Date().toISOString() };
  doctors.push(doctor);
  res.status(201).json(doctor);
});

// PUT /api/doctors/:id — admin only
router.put('/:id', authorize('admin'), (req, res) => {
  const idx = doctors.findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Doctor not found' });

  const { firstName, lastName, specialization, department, phone, email, licenseNumber, availability } = req.body;
  if (!firstName || !lastName || !specialization || !department || !phone || !email || !licenseNumber)
    return res.status(400).json({ error: 'Missing required fields' });

  const emailConflict = doctors.find(d => d.email === email && d.id !== req.params.id);
  if (emailConflict) return res.status(409).json({ error: 'Email already in use' });

  doctors[idx] = { ...doctors[idx], firstName, lastName, specialization, department, phone, email, licenseNumber, availability: availability || '', updatedAt: new Date().toISOString() };
  res.json(doctors[idx]);
});

// DELETE /api/doctors/:id — admin only
router.delete('/:id', authorize('admin'), (req, res) => {
  const idx = doctors.findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Doctor not found' });

  const hasPatients = patients.some(p => p.doctorId === req.params.id);
  if (hasPatients) return res.status(409).json({ error: 'Cannot delete doctor with assigned patients. Reassign patients first.' });

  doctors.splice(idx, 1);
  res.json({ message: 'Doctor deleted successfully' });
});

// GET /api/doctors/meta/specializations
router.get('/meta/specializations', (req, res) => {
  const specs = [...new Set(doctors.map(d => d.specialization))];
  res.json(specs);
});

module.exports = router;
