const User = require('../models/User');
const Staff = require('../models/Staff');
const jwt = require('jsonwebtoken');

// Get model by role
const getModelByRole = (role) => (role === 'Staff' ? Staff : User);

// Sign JWT token
const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

// REGISTER
exports.register = async (req, res) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;
  const phone = req.body.phone?.trim();
  const role = req.body.role || 'Resident';
  const roomPreference = req.body.roomPreference;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email & password are required' });
  }

  try {
    const [existsInUsers, existsInStaff] = await Promise.all([
      User.findOne({ email }),
      Staff.findOne({ email }),
    ]);

    if (existsInUsers || existsInStaff) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    let account;
    if (role === 'Staff') {
      account = new Staff({ name, email, password, phone, role });
    } else {
      account = new User({ name, email, password, phone, role, roomPreference });
    }

    await account.save(); // This will trigger password hashing via pre-save hook

    const token = signToken(account);
    console.log(`🎉 Registered new ${account.role}: ${account.email}`);

    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(201)
      .json({
        user: {
          _id: account._id,
          name: account.name,
          email: account.email,
          role: account.role,
        },
        token,
      });
  } catch (err) {
    console.error('[REGISTER ERROR]', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already registered (duplicate key)' });
    }
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email & password are required' });
  }

  try {
    let user = await User.findOne({ email }) || await Staff.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user);
    console.log(`✅ ${user.role} ${user.email} logged in`);

    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// LOGOUT
exports.logout = (req, res) => {
  res
    .clearCookie('token', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    })
    .json({ message: 'Logged out successfully' });
};

// GET USER
exports.getUser = async (req, res) => {
  try {
    const { id, role } = req.user;
    const Model = getModelByRole(role);

    const user = await Model.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('[GET USER ERROR]', err);
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};
