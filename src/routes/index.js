const { Router } = require("express");
const authRoutes = require("./auth.routes");
const watchlistRoutes = require("./watchlist.routes");

const router = Router();

/**
 * @swagger
 * /api:
 *   get:
 *     summary: API health check
 *     tags: [General]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: API is running
 */
router.get("/", (_req, res) => {
  res.json({ message: "API is running" });
});

/**
 * @swagger
 * tags:
 *   - name: Autenticação
 *     description: Registo e Início de Sessão de Utilizadores
 *   - name: Watchlist
 *     description: Gestão da Lista de Observação de Criptomoedas do Utilizador
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registar um novo utilizador
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 minimum: 6
 *                 example: password123
 *     responses:
 *       201:
 *         description: Utilizador criado com sucesso
 *       400:
 *         description: Dados inválidos ou utilizador já existe
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sessão de um utilizador existente
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login bem sucedido, devolve JWT
 *       400:
 *         description: Credenciais incorretas ou em falta
 */

/**
 * @swagger
 * /api/watchlist:
 *   get:
 *     summary: Obter a watchlist do utilizador autenticado
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array com as criptomoedas favoritas do utilizador
 *       401:
 *         description: Não autorizado (token em falta ou inválido)
 *   post:
 *     summary: Adicionar uma criptomoeda à watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - coinId
 *               - coinSymbol
 *               - coinName
 *             properties:
 *               coinId:
 *                 type: number
 *                 example: 1
 *               coinSymbol:
 *                 type: string
 *                 example: BTC
 *               coinName:
 *                 type: string
 *                 example: Bitcoin
 *     responses:
 *       201:
 *         description: Adicionado com sucesso
 *       400:
 *         description: Parâmetros inválidos
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /api/watchlist/{coinId}:
 *   delete:
 *     summary: Remover uma criptomoeda da watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: coinId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da moeda na CoinMarketCap a remover
 *     responses:
 *       200:
 *         description: Removido com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Item não encontrado na watchlist
 */

// Registo de Rotas
router.use("/auth", authRoutes);
router.use("/watchlist", watchlistRoutes);

module.exports = router;
