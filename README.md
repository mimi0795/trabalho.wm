
# Passo Prime

Este projeto está dividido em dois workspaces:

- `frontend`: app de e-commerce em Vite + React.
- `backend`: servidor de API em Node.js.

## Rodando o projeto

Instale as dependências pela raiz do projeto:

```bash
npm install
```

Configure o backend:

```powershell
Copy-Item backend/.env.example backend/.env
```

O backend usa MongoDB. Por padrão ele tenta conectar em `mongodb://127.0.0.1:27017` no banco `passo_prime`.
Você pode trocar isso em `backend/.env`:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=passo_prime
```

Suba o MongoDB local com Docker:

```powershell
docker compose up -d mongodb
```

Ao iniciar, a API cria os índices e popula o banco com produtos, categorias, variações e promoções iniciais baseados no diagrama do projeto.

Inicie o frontend:

```bash
npm run dev
```

Inicie o backend:

```bash
npm run dev:backend
```

A API do backend roda em `http://localhost:5000/api` por padrão.

Rotas disponíveis:

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/orders`
- `GET /api/orders`
- `POST /api/newsletter`
- `POST /api/support`

Gere o build do frontend:

```bash
npm run build
```
