const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { patients, doctors, diseases } = require('../data/store');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

// GET /api/patients
router.get('/', (req, res) => {
  const { q, doctorId, gender, bloodType } = req.query;
  let result = [...patients];

  if (q) {
    const lower = q.toLowerCase();
    result = result.filter(p =>
      p.firstName.toLowerCase().includes(lower) ||
      p.lastName.toLowerCase().includes(lower) ||
      p.email.toLowerCase().includes(lower) ||
      p.insuranceNumber.toLowerCase().includes(lower) ||
      p.phone.includes(lower)
    );
  }
  if (doctorId) result = result.filter(p => p.doctorId === doctorId);
  if (gender) result = result.filter(p => p.gender === gender);
  if (bloodType) result = result.filter(p => p.bloodType === bloodType);

  // Attach doctor name for display
  result = result.map(p => {
    const doc = doctors.find(d => d.id === p.doctorId);
    return { ...p, doctorName: doc ? `Dr. ${doc.firstName} ${doc.lastName}` : 'Unassigned' };
  });

  res.json(result);
});

// GET /api/patients/:id — full profile with doctor and diagnoses
router.get('/:id', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) return res.status(404).json({ error: 'Patient not found' });

  const doctor = doctors.find(d => d.id === patient.doctorId);
  const diagnoses = diseases.filter(d => d.patientId === patient.id);

  res.json({ ...patient, doctor: doctor || null, diagnoses });
});

// POST /api/patients — admin and reception
router.post('/', authorize('admin', 'reception'), (req, res) => {
  const { firstName, lastName, dateOfBirth, gender, bloodType, phone, email, address, doctorId, emergencyContact, insuranceNumber } = req.body;
  if (!firstName || !lastName || !dateOfBirth || !gender || !phone || !doctorId)
    return res.status(400).json({ error: 'Missing required fields' });

  if (!doctors.find(d => d.id === doctorId))
    return res.status(400).json({ error: 'Invalid doctor ID' });

  if (email && patients.find(p => p.email === email))
    return res.status(409).json({ error: 'Email already exists' });

  const patient = {
    id: uuidv4(), firstName, lastName, dateOfBirth, gender,
    bloodType: bloodType || 'Unknown', phone, email: email || '',
    address: address || '', doctorId,
    emergencyContact: emergencyContact || '',
    insuranceNumber: insuranceNumber || `INS-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  patients.push(patient);
  res.status(201).json(patient);
});

// PUT /api/patients/:id — admin, clinician, reception
router.put('/:id', authorize('admin', 'clinician', 'reception'), (req, res) => {
  const idx = patients.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Patient not found' });

  const { firstName, lastName, dateOfBirth, gender, bloodType, phone, email, address, doctorId, emergencyContact, insuranceNumber } = req.body;
  if (!firstName || !lastName || !dateOfBirth || !gender || !phone || !doctorId)
    return res.status(400).json({ error: 'Missing required fields' });

  if (!doctors.find(d => d.id === doctorId))
    return res.status(400).json({ error: 'Invalid doctor ID' });

  const emailConflict = email && patients.find(p => p.email === email && p.id !== req.params.id);
  if (emailConflict) return res.status(409).json({ error: 'Email already in use' });

  patients[idx] = { ...patients[idx], firstName, lastName, dateOfBirth, gender, bloodType: bloodType || 'Unknown', phone, email: email || '', address: address || '', doctorId, emergencyContact: emergencyContact || '', insuranceNumber: insuranceNumber || patients[idx].insuranceNumber, updatedAt: new Date().toISOString() };
  res.json(patients[idx]);
});

// DELETE /api/patients/:id — admin only
router.delete('/:id', authorize('admin'), (req, res) => {
  const idx = patients.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Patient not found' });

  // Remove associated diseases
  const diseaseIds = diseases.filter(d => d.patientId === req.params.id).map(d => d.id);
  diseaseIds.forEach(did => { const di = diseases.findIndex(d => d.id === did); if (di > -1) diseases.splice(di, 1); });

  patients.splice(idx, 1);
  res.json({ message: 'Patient and associated records deleted successfully' });
});

module.exports = router;
