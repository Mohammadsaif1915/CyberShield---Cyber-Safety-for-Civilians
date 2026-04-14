import mongoose from 'mongoose';

const threatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Ransomware', 'APT', 'Vulnerability', 'Phishing', 'Network', 'Malware', 'DDoS'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low'],
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  indicators_of_compromise: [{
    type: String,
  }],
  mitre_attacks: [{
    type: String,
  }],
  cve: {
    type: String,
  },
  affected_systems: {
    type: String,
  },
  patch_status: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Threat = mongoose.model('Threat', threatSchema);
export default Threat;
