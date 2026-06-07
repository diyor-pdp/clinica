const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// ─── In-memory database (arrays) ───────────────────────────────────────────

const users = [
  {
    id: uuidv4(),
    username: 'admin',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    name: 'System Administrator',
    email: 'admin@caretrack.com'
  },
  {
    id: uuidv4(),
    username: 'doctor1',
    password: bcrypt.hashSync('clinic123', 10),
    role: 'clinician',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@caretrack.com'
  },
  {
    id: uuidv4(),
    username: 'reception1',
    password: bcrypt.hashSync('recept123', 10),
    role: 'reception',
    name: 'Emily Davis',
    email: 'emily.davis@caretrack.com'
  }
];

const doctors = [
  {
    id: uuidv4(),
    firstName: 'Sarah',
    lastName: 'Johnson',
    specialization: 'Cardiology',
    department: 'Cardiology',
    phone: '+1-555-0101',
    email: 'sarah.johnson@caretrack.com',
    licenseNumber: 'MD-2019-0045',
    availability: 'Mon-Fri 09:00-17:00',
    createdAt: new Date('2024-01-10').toISOString()
  },
  {
    id: uuidv4(),
    firstName: 'Michael',
    lastName: 'Chen',
    specialization: 'Neurology',
    department: 'Neurology',
    phone: '+1-555-0102',
    email: 'michael.chen@caretrack.com',
    licenseNumber: 'MD-2017-0123',
    availability: 'Mon-Thu 08:00-16:00',
    createdAt: new Date('2024-01-12').toISOString()
  },
  {
    id: uuidv4(),
    firstName: 'Aisha',
    lastName: 'Patel',
    specialization: 'Dermatology',
    department: 'Dermatology',
    phone: '+1-555-0103',
    email: 'aisha.patel@caretrack.com',
    licenseNumber: 'MD-2020-0067',
    availability: 'Tue-Sat 10:00-18:00',
    createdAt: new Date('2024-02-05').toISOString()
  },
  {
    id: uuidv4(),
    firstName: 'David',
    lastName: 'Martinez',
    specialization: 'Orthopedics',
    department: 'Orthopedics',
    phone: '+1-555-0104',
    email: 'david.martinez@caretrack.com',
    licenseNumber: 'MD-2016-0089',
    availability: 'Mon-Fri 08:30-16:30',
    createdAt: new Date('2024-02-20').toISOString()
  }
];

const patients = [];
const diseases = [];

// Seed patients after doctors array is ready
function seedData() {
  const doc1 = doctors[0].id;
  const doc2 = doctors[1].id;
  const doc3 = doctors[2].id;

  const p1 = { id: uuidv4(), firstName: 'James', lastName: 'Wilson', dateOfBirth: '1985-03-15', gender: 'Male', bloodType: 'A+', phone: '+1-555-1001', email: 'james.wilson@email.com', address: '123 Oak Street, Springfield', doctorId: doc1, emergencyContact: 'Mary Wilson - +1-555-1002', insuranceNumber: 'INS-2024-001', createdAt: new Date('2024-03-01').toISOString() };
  const p2 = { id: uuidv4(), firstName: 'Linda', lastName: 'Thompson', dateOfBirth: '1972-07-22', gender: 'Female', bloodType: 'O-', phone: '+1-555-1003', email: 'linda.thompson@email.com', address: '456 Maple Ave, Riverside', doctorId: doc1, emergencyContact: 'Bob Thompson - +1-555-1004', insuranceNumber: 'INS-2024-002', createdAt: new Date('2024-03-05').toISOString() };
  const p3 = { id: uuidv4(), firstName: 'Robert', lastName: 'Garcia', dateOfBirth: '1990-11-08', gender: 'Male', bloodType: 'B+', phone: '+1-555-1005', email: 'robert.garcia@email.com', address: '789 Pine Rd, Lakewood', doctorId: doc2, emergencyContact: 'Maria Garcia - +1-555-1006', insuranceNumber: 'INS-2024-003', createdAt: new Date('2024-03-10').toISOString() };
  const p4 = { id: uuidv4(), firstName: 'Susan', lastName: 'Lee', dateOfBirth: '1968-05-30', gender: 'Female', bloodType: 'AB+', phone: '+1-555-1007', email: 'susan.lee@email.com', address: '321 Elm St, Hillview', doctorId: doc3, emergencyContact: 'Tom Lee - +1-555-1008', insuranceNumber: 'INS-2024-004', createdAt: new Date('2024-03-15').toISOString() };

  patients.push(p1, p2, p3, p4);

  diseases.push(
    { id: uuidv4(), patientId: p1.id, icdCode: 'I10', description: 'Essential (primary) hypertension', severity: 'Moderate', symptoms: 'Headache, dizziness, shortness of breath', treatment: 'Amlodipine 5mg daily, lifestyle modification', diagnosedAt: new Date('2024-03-02').toISOString(), status: 'Ongoing', notes: 'Monitor BP weekly' },
    { id: uuidv4(), patientId: p1.id, icdCode: 'E11', description: 'Type 2 diabetes mellitus without complications', severity: 'Mild', symptoms: 'Frequent urination, increased thirst', treatment: 'Metformin 500mg twice daily, diet control', diagnosedAt: new Date('2024-03-15').toISOString(), status: 'Ongoing', notes: 'Check HbA1c every 3 months' },
    { id: uuidv4(), patientId: p2.id, icdCode: 'I25', description: 'Chronic ischaemic heart disease', severity: 'Severe', symptoms: 'Chest pain, fatigue, palpitations', treatment: 'Aspirin 100mg, Atorvastatin 40mg, cardiac rehabilitation', diagnosedAt: new Date('2024-03-06').toISOString(), status: 'Ongoing', notes: 'Scheduled for angioplasty review' },
    { id: uuidv4(), patientId: p3.id, icdCode: 'G43', description: 'Migraine', severity: 'Moderate', symptoms: 'Severe headache, nausea, photophobia', treatment: 'Sumatriptan 50mg as needed, preventive therapy', diagnosedAt: new Date('2024-03-11').toISOString(), status: 'Recurrent', notes: 'Trigger diary recommended' },
    { id: uuidv4(), patientId: p4.id, icdCode: 'L20', description: 'Atopic dermatitis', severity: 'Mild', symptoms: 'Itching, dry skin, rash on arms and neck', treatment: 'Hydrocortisone cream, antihistamine, moisturizer', diagnosedAt: new Date('2024-03-16').toISOString(), status: 'Chronic', notes: 'Avoid known triggers' }
  );
}

seedData();

module.exports = { users, doctors, patients, diseases };
