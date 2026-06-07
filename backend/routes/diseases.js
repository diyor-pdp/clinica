const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { diseases, patients } = require('../data/store');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

// GET /api/diseases
router.get('/', (req, res) => {
  const { q, patientId, severity, status, icdCode } = req.query;
  let result = [...diseases];

  if (q) {
    const lower = q.toLowerCase();
    result = result.filter(d =>
      d.description.toLowerCase().includes(lower) ||
      d.icdCode.toLowerCase().includes(lower) ||
      d.symptoms.toLowerCase().includes(lower) ||
      d.treatment.toLowerCase().includes(lower)
    );
  }
  if (patientId) result = result.filter(d => d.patientId === patientId);
  if (severity) result = result.filter(d => d.severity === severity);
  if (status) result = result.filter(d => d.status === status);
  if (icdCode) result = result.filter(d => d.icdCode.toUpperCase().includes(icdCode.toUpperCase()));

  // Attach patient name
  result = result.map(d => {
    const p = patients.find(pt => pt.id === d.patientId);
    return { ...d, patientName: p ? `${p.firstName} ${p.lastName}` : 'Unknown' };
  });

  res.json(result);
});

// GET /api/diseases/:id
router.get('/:id', (req, res) => {
  const disease = diseases.find(d => d.id === req.params.id);
  if (!disease) return res.status(404).json({ error: 'Record not found' });

  const patient = patients.find(p => p.id === disease.patientId);
  res.json({ ...disease, patient: patient || null });
});

// POST /api/diseases — admin and clinician
router.post('/', authorize('admin', 'clinician'), (req, res) => {
  const { patientId, icdCode, description, severity, symptoms, treatment, status, notes } = req.body;
  if (!patientId || !icdCode || !description || !severity)
    return res.status(400).json({ error: 'Missing required fields' });

  if (!patients.find(p => p.id === patientId))
    return res.status(400).json({ error: 'Invalid patient ID' });

  const VALID_SEVERITY = ['Mild', 'Moderate', 'Severe', 'Critical'];
  if (!VALID_SEVERITY.includes(severity))
    return res.status(400).json({ error: `Severity must be one of: ${VALID_SEVERITY.join(', ')}` });

  const disease = {
    id: uuidv4(), patientId, icdCode: icdCode.toUpperCase(), description,
    severity, symptoms: symptoms || '', treatment: treatment || '',
    status: status || 'Ongoing', notes: notes || '',
    diagnosedAt: new Date().toISOString()
  };
  diseases.push(disease);
  res.status(201).json(disease);
});

// PUT /api/diseases/:id — admin and clinician
router.put('/:id', authorize('admin', 'clinician'), (req, res) => {
  const idx = diseases.findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Record not found' });

  const { patientId, icdCode, description, severity, symptoms, treatment, status, notes } = req.body;
  if (!patientId || !icdCode || !description || !severity)
    return res.status(400).json({ error: 'Missing required fields' });

  if (!patients.find(p => p.id === patientId))
    return res.status(400).json({ error: 'Invalid patient ID' });

  diseases[idx] = { ...diseases[idx], patientId, icdCode: icdCode.toUpperCase(), description, severity, symptoms: symptoms || '', treatment: treatment || '', status: status || 'Ongoing', notes: notes || '', updatedAt: new Date().toISOString() };
  res.json(diseases[idx]);
});

// DELETE /api/diseases/:id — admin only
router.delete('/:id', authorize('admin'), (req, res) => {
  const idx = diseases.findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Record not found' });
  diseases.splice(idx, 1);
  res.json({ message: 'Diagnosis record deleted successfully' });
});

module.exports = router;
