module.exports = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};