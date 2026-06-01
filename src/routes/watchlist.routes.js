const { Router } = require("express");
const watchlistController = require("../controllers/watchlist.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = Router();

// Protege todas as rotas da watchlist com o middleware JWT
router.use(authMiddleware);

router.get("/", watchlistController.getWatchlist);
router.post("/", watchlistController.addToWatchlist);
router.delete("/:coinId", watchlistController.removeFromWatchlist);

module.exports = router;
