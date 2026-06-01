const Watchlist = require('../models/watchlist.model');

exports.getWatchlist = async (req, res, next) => {
  try {
    const list = Watchlist.getUserWatchlist(req.userId);
    res.json(list);
  } catch (error) {
    next(error);
  }
};

exports.addToWatchlist = async (req, res, next) => {
  try {
    const { coinId, coinSymbol, coinName } = req.body;

    if (!coinId || !coinSymbol || !coinName) {
      return res.status(400).json({ message: 'Parâmetros em falta. Exigido: coinId, coinSymbol, coinName.' });
    }

    const result = Watchlist.add(req.userId, coinId, coinSymbol, coinName);
    
    res.status(201).json({
      message: 'Item adicionado à watchlist com sucesso.',
      item: result.item
    });
  } catch (error) {
    next(error);
  }
};

exports.removeFromWatchlist = async (req, res, next) => {
  try {
    const coinId = Number(req.params.coinId);

    if (isNaN(coinId)) {
      return res.status(400).json({ message: 'ID da moeda inválido.' });
    }

    const result = Watchlist.remove(req.userId, coinId);

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    res.json({ message: 'Item removido da watchlist com sucesso.' });
  } catch (error) {
    next(error);
  }
};
