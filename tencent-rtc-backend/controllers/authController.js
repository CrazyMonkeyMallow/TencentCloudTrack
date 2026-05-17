const jwt = require('jsonwebtoken');
const User = require('../model/user');

// POST /api/auth/register
// Receives: name, email, password, role
// Returns: JWT + basic user information
async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['patient', 'doctor'].includes(role)) {
      return res.status(400).json({ message: 'role must be either patient or doctor' });
    }

    // Check if email is already registered
    const existing = User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'This email is already registered' });
    }

    // Hash password + save to database
    const hashed = await User.hashPassword(password);
    const user = User.create({ name, email, password: hashed, role });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/auth/login
// Receives: email, password
// Returns: JWT + basic user information
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const match = await User.comparePassword(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { register, login };