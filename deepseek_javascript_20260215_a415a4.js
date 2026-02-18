const jwt = require('jsonwebtoken');
const TaxReturn = require('../models/TaxReturn');

module.exports = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  try {
    const submissions = await TaxReturn.find().sort({ createdAt: -1 });
    const data = submissions.map((sub) => sub.getDecrypted());
    res.json(data);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};