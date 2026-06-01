const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tcriptow_secret_key_super_secure';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acesso negado. Token de autenticação em falta ou malformado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: 'Sessão expirada ou token inválido. Por favor, inicia sessão novamente.' });
  }
};

module.exports = authMiddleware;
