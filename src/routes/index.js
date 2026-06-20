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
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicitar recuperação de password (gera código de verificação)
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *     responses:
 *       200:
 *         description: Código gerado com sucesso (retorna o código no JSON para simulação)
 *       400:
 *         description: Email em falta ou não registado
 */

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Redefinir a password usando o código de verificação
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               code:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 minimum: 6
 *                 example: nova_password123
 *     responses:
 *       200:
 *         description: Palavra-passe redefinida com sucesso
 *       400:
 *         description: Campos inválidos, código incorreto/expirado ou erro ao atualizar
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

/**
 * @swagger
 * /api/crypto/listings:
 *   get:
 *     summary: Obter listagem de criptomoedas da CoinMarketCap (Proxy)
 *     tags: [Mercado]
 *     responses:
 *       200:
 *         description: Dados obtidos com sucesso
 *       500:
 *         description: Erro na comunicação com a API externa
 */
router.get("/crypto/listings", async (req, res, next) => {
  try {
    const apiKey = process.env.CMC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Chave da API CoinMarketCap não configurada no servidor." });
    }

    const response = await fetch("https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=200&convert=EUR", {
      method: "GET",
      headers: {
        "X-CMC_PRO_API_KEY": apiKey,
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        error: "Erro ao comunicar com a CoinMarketCap",
        details: errText
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

