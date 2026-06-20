# Project Information

## Group Members

- Student 1: Luis Martinho Nº25361

## Project Theme

TcriptoW - Plataforma Visual de Acompanhamento de Criptomoedas com Watchlist Personalizada.

## External API Used

- API name: CoinMarketCap API
- API link: https://coinmarketcap.com/api/
- Requires API key? Yes

## Backend Repository

- Link:[TcriptoW Backend](https://github.com/luismartinho21/backend-template_TW.git)

## Entities

1. User (Utilizador registado na plataforma com ID, nome, email e hash da password)
2. WatchlistItem (Par cripto monitorizado, ligado a um utilizador específico com coinId, coinSymbol e coinName)

## Main Features

1. Registo e Autenticação de Utilizadores (Login e Registo com encriptação bcryptjs e JWT)
2. Gestão de Watchlist (Persistência da lista de observação individual de cada utilizador em base de dados JSON)
3. Documentação Completa Swagger (Acesso interativo às rotas do backend em /api-docs com suporte para Bearer Authentication)

## Endpoints

- GET /api/
- POST /api/auth/register
- POST /api/auth/login
- GET /api/watchlist
- POST /api/watchlist
- DELETE /api/watchlist/{coinId}

## Notes

O backend utiliza persistência simples e fiável em ficheiros JSON na pasta `src/data/`, garantindo 100% de fiabilidade de execução sem qualquer necessidade de instalação de base de dados externa na máquina de correção.
