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

// Mapa em memória para armazenar os códigos de recuperação temporários
const recoveryCodes = new Map();

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'O endereço de email é obrigatório.' });
    }

    const user = User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Este endereço de email não está registado.' });
    }

    // Gera um código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Guarda na memória associado ao email
    recoveryCodes.set(email.toLowerCase(), code);

    // Como é uma simulação (sem SMTP real), devolvemos o código na resposta
    // para a interface frontend o poder ler e mostrar num popup explicativo!
    res.json({
      message: 'Código de verificação gerado com sucesso.',
      code,
      email
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Todos os campos (email, código, nova password) são obrigatórios.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'A nova palavra-passe deve ter pelo menos 6 caracteres.' });
    }

    const savedCode = recoveryCodes.get(email.toLowerCase());

    if (!savedCode || savedCode !== code.trim()) {
      return res.status(400).json({ message: 'Código de verificação inválido ou expirado.' });
    }

    // Atualiza a password
    const success = await User.updatePasswordByEmail(email, newPassword);
    if (!success) {
      return res.status(400).json({ message: 'Erro ao atualizar a palavra-passe.' });
    }

    // Remove o código da memória
    recoveryCodes.delete(email.toLowerCase());

    res.json({
      message: 'Palavra-passe redefinida com sucesso. Já podes iniciar sessão!'
    });
  } catch (error) {
    next(error);
  }
};
