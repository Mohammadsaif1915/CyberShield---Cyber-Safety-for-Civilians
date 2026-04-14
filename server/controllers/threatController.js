import Threat from '../models/Threat.js';

// Get all threats
export const getAllThreats = async (req, res) => {
  try {
    const { severity, type } = req.query;
    
    let query = {};
    if (severity && severity !== 'All') {
      query.severity = severity;
    }
    if (type && type !== 'All') {
      query.type = type;
    }

    const threats = await Threat.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: threats.length,
      data: threats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch threats',
      error: error.message,
    });
  }
};

// Get single threat by ID
export const getThreatById = async (req, res) => {
  try {
    const threat = await Threat.findById(req.params.id);
    if (!threat) {
      return res.status(404).json({
        success: false,
        message: 'Threat not found',
      });
    }
    res.json({
      success: true,
      data: threat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch threat',
      error: error.message,
    });
  }
};

// Get threat statistics
export const getThreatStats = async (req, res) => {
  try {
    const stats = {
      total: await Threat.countDocuments(),
      critical: await Threat.countDocuments({ severity: 'Critical' }),
      high: await Threat.countDocuments({ severity: 'High' }),
      medium: await Threat.countDocuments({ severity: 'Medium' }),
      low: await Threat.countDocuments({ severity: 'Low' }),
      byType: {},
    };

    const types = ['Ransomware', 'APT', 'Vulnerability', 'Phishing', 'Network', 'Malware', 'DDoS'];
    for (const type of types) {
      stats.byType[type] = await Threat.countDocuments({ type });
    }

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch threat stats',
      error: error.message,
    });
  }
};
