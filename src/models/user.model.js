const bcrypt = require('bcryptjs');
const { readData, writeData } = require('./db');

const DB_NAME = 'users';

const findByEmail = (email) => {
  const users = readData(DB_NAME);
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

const findById = (id) => {
  const users = readData(DB_NAME);
  return users.find(u => u.id === id);
};

const create = async (name, email, password) => {
  const users = readData(DB_NAME);
  
  // Hashing password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    id: Date.now().toString(), // Simple unique ID
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeData(DB_NAME, users);

  // Return user without password
  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt
  };
};

const validatePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

const updatePasswordByEmail = async (email, newPassword) => {
  const users = readData(DB_NAME);
  const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (userIndex === -1) return false;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  users[userIndex].password = hashedPassword;
  writeData(DB_NAME, users);
  return true;
};

module.exports = {
  findByEmail,
  findById,
  create,
  validatePassword,
  updatePasswordByEmail
};
