
# Premium Sneaker Ecommerce App

This project is split into two workspaces:

- `frontend`: Vite + React ecommerce app.
- `backend`: Node.js API server.

## Running the code

Install dependencies from the project root:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Start the backend:

```bash
npm run dev:backend
```

The backend API runs on `http://localhost:5000/api` by default.

Available API routes:

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/orders`
- `GET /api/orders`
- `POST /api/newsletter`

Build the frontend:

```bash
npm run build
```
