const { readData, writeData } = require('./db');

const DB_NAME = 'watchlists';

const getUserWatchlist = (userId) => {
  const watchlists = readData(DB_NAME);
  return watchlists.filter(w => w.userId === userId);
};

const add = (userId, coinId, coinSymbol, coinName) => {
  const watchlists = readData(DB_NAME);

  // Check if already exists for this user
  const exists = watchlists.some(
    w => w.userId === userId && Number(w.coinId) === Number(coinId)
  );

  if (exists) {
    return { success: true, message: 'Já está na tua watchlist' };
  }

  const newItem = {
    id: Date.now().toString(),
    userId,
    coinId: Number(coinId),
    coinSymbol,
    coinName,
    addedAt: new Date().toISOString()
  };

  watchlists.push(newItem);
  writeData(DB_NAME, watchlists);

  return { success: true, item: newItem };
};

const remove = (userId, coinId) => {
  const watchlists = readData(DB_NAME);
  
  const initialLength = watchlists.length;
  const filtered = watchlists.filter(
    w => !(w.userId === userId && Number(w.coinId) === Number(coinId))
  );

  if (filtered.length === initialLength) {
    return { success: false, message: 'Item não encontrado na tua watchlist' };
  }

  writeData(DB_NAME, filtered);
  return { success: true };
};

module.exports = {
  getUserWatchlist,
  add,
  remove
};
