const { db } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const SALT_ROUNDS = 10;

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const validateUserPayload = ({ username, email, phone_number, password }, options = {}) => {
  const trimmedUsername = String(username || '').trim();
  const normalizedEmail = normalizeEmail(email);
  const trimmedPhoneNumber = String(phone_number || '').trim();
  const trimmedPassword = String(password || '');

  if (!trimmedUsername) {
    return { error: 'Username is required' };
  }

  if (!normalizedEmail) {
    return { error: 'Email is required' };
  }

  if (!trimmedPhoneNumber) {
    return { error: 'Phone number is required' };
  }

  if (!options.allowEmptyPassword && trimmedPassword.length < 8) {
    return { error: 'Password must be at least 8 characters long' };
  }

  if (options.allowEmptyPassword && trimmedPassword && trimmedPassword.length < 8) {
    return { error: 'Password must be at least 8 characters long' };
  }

  return {
    username: trimmedUsername,
    email: normalizedEmail,
    phone_number: trimmedPhoneNumber,
    password: trimmedPassword,
  };
};

const signToken = (user) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    {
      userId: user.id,
      isAdmin: Boolean(user.isAdmin),
      email: user.email,
    },
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
  );
};

const registerUser = async (req, res) => {
  const validated = validateUserPayload(req.body);

  if (validated.error) {
    return res.status(400).json({ message: validated.error });
  }

  const { username, email, phone_number, password } = validated;

  try {
    const [existingUsers] = await db
      .promise()
      .query(
        'SELECT id FROM user_table WHERE email = ? OR phone_number = ? LIMIT 1',
        [email, phone_number],
      );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: 'A user with that email or phone number already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await db
      .promise()
      .query(
        'INSERT INTO user_table (username, email, phone_number, password, isAdmin) VALUES (?, ?, ?, ?, ?)',
        [username, email, phone_number, hashedPassword, 0],
      );

    return res.status(201).json({
      message: 'User registered successfully!',
      isAdmin: false,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Registration failed' });
  }
};

const loginUser = async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || '');

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [result] = await db
      .promise()
      .query(
        'SELECT id, username, email, password, isAdmin FROM user_table WHERE is_active = TRUE AND email = ? LIMIT 1',
        [email],
      );

    if (result.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);

    return res.status(200).json({
      message: 'Login successful!',
      userId: user.id,
      isAdmin: Boolean(user.isAdmin),
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const [result] = await db
      .promise()
      .query(
        'SELECT id, username, email, phone_number, isAdmin, is_active, created_at FROM user_table WHERE id = ? AND is_active = TRUE LIMIT 1',
        [req.user.userId],
      );

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getUser = async (req, res) => {
  try {
    const [users] = await db
      .promise()
      .query(
        'SELECT id, username, email, phone_number, isAdmin, is_active, created_at FROM user_table WHERE isAdmin = 0 AND is_active = TRUE ORDER BY created_at DESC',
      );

    return res.status(200).json(users);
  } catch (error) {
    console.error('Get staff error:', error);
    return res.status(500).json({ message: 'Failed to fetch staff' });
  }
};

const updateUser = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  const validated = validateUserPayload(req.body, { allowEmptyPassword: true });

  if (validated.error) {
    return res.status(400).json({ message: validated.error });
  }

  const { username, email, phone_number, password } = validated;

  try {
    const [users] = await db
      .promise()
      .query(
        'SELECT id, password FROM user_table WHERE id = ? AND isAdmin = 0 AND is_active = TRUE LIMIT 1',
        [id],
      );

    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: 'User not found or cannot update admin' });
    }

    const [duplicates] = await db
      .promise()
      .query(
        'SELECT id FROM user_table WHERE (email = ? OR phone_number = ?) AND id <> ? LIMIT 1',
        [email, phone_number, id],
      );

    if (duplicates.length > 0) {
      return res.status(409).json({
        message: 'A user with that email or phone number already exists',
      });
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, SALT_ROUNDS)
      : users[0].password;

    await db
      .promise()
      .query(
        'UPDATE user_table SET username = ?, email = ?, phone_number = ?, password = ? WHERE id = ? AND isAdmin = 0',
        [username, email, phone_number, hashedPassword, id],
      );

    return res.status(200).json({ message: 'User updated successfully!' });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ message: 'Update failed' });
  }
};

const deleteUser = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  if (id === req.user.userId) {
    return res.status(400).json({ message: 'You cannot delete your own account' });
  }

  try {
    const [result] = await db
      .promise()
      .query(
        'UPDATE user_table SET is_active = FALSE WHERE id = ? AND isAdmin = 0 AND is_active = TRUE',
        [id],
      );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: 'User not found or cannot delete admin' });
    }

    return res.status(200).json({ message: 'User deleted successfully!' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ message: 'Deletion failed' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  getUser,
  updateUser,
  deleteUser,
};
