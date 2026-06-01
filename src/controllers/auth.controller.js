const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'tcriptow_secret_key_super_secure';

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos os campos (nome, email, password) são obrigatórios.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'A palavra-passe deve ter pelo menos 6 caracteres.' });
    }

    // Check if user already exists
    const existingUser = User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Este endereço de email já está registado.' });
    }

    // Create user
    const user = await User.create(name, email, password);

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Registo efetuado com sucesso.',
      token,
      user
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e palavra-passe são obrigatórios.' });
    }

    // Find user
    const existingUser = User.findByEmail(email);
    if (!existingUser) {
      return res.status(400).json({ message: 'Credenciais inválidas. Por favor, tenta novamente.' });
    }

    // Validate password
    const isPasswordValid = await User.validatePassword(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Credenciais inválidas. Por favor, tenta novamente.' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: existingUser.id }, JWT_SECRET, { expiresIn: '7d' });

    const user = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email
    };

    res.json({
      message: 'Autenticação efetuada com sucesso.',
      token,
      user
    });
  } catch (error) {
    next(error);
  }
};
