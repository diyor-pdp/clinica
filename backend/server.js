const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/diseases', require('./routes/diseases'));

// Stats endpoint
app.get('/api/stats', require('./middleware/auth').authenticate, (req, res) => {
  const { doctors, patients, diseases } = require('./data/store');
  res.json({
    totalDoctors: doctors.length,
    totalPatients: patients.length,
    totalDiagnoses: diseases.length,
    severityBreakdown: {
      Mild: diseases.filter(d => d.severity === 'Mild').length,
      Moderate: diseases.filter(d => d.severity === 'Moderate').length,
      Severe: diseases.filter(d => d.severity === 'Severe').length,
      Critical: diseases.filter(d => d.severity === 'Critical').length
    },
    departmentBreakdown: doctors.reduce((acc, d) => {
      acc[d.department] = (acc[d.department] || 0) + 1;
      return acc;
    }, {})
  });
});

// Serve frontend for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🏥 CareTrack Clinic MRMS running on http://localhost:${PORT}`);
  console.log(`\nDefault credentials:`);
  console.log(`  Admin     → username: admin     | password: admin123`);
  console.log(`  Clinician → username: doctor1   | password: clinic123`);
  console.log(`  Reception → username: reception1| password: recept123\n`);
});
