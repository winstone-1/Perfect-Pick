# Perfect Pick — E-Commerce Store

A full-stack e-commerce web application built for a retail boutique selling bags, shoes, jewelry, and gifts. Built with the MERN stack, featuring JWT authentication, role-based access control, per-variant inventory tracking, and M-Pesa STK push payments.

## Live Demo

- Frontend: https://perfect-pick.vercel.app
- Backend: https://perfect-pick-server.onrender.com

## Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS v4
- shadcn/ui
- React Router DOM v7
- Axios
- Sonner (toast notifications)

### Backend
- Node.js + Express.js
- MongoDB Atlas + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Axios (M-Pesa API)

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Features

### Customer
- Browse products by category (bags, shoes, jewelry, gifts)
- Search and sort products by name and price
- View product details with variant selection (size/color)
- Add to cart with quantity management
- Wishlist to save favourite products
- Checkout with M-Pesa STK push payment
- Order history with real-time status tracking
- User profile with name and password management

### Admin
- Add, edit, and delete products with per-variant inventory
- View and manage all orders
- Update order statuses (pending, processing, shipped, delivered, cancelled)
- View all registered users

### Manager
- View and update order statuses
- No access to product or user management

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Safaricom Daraja API account

### Installation

Clone the repo:
```bash
git clone https://github.com/winstone-1/Perfect-Pick.git
```

Install backend dependencies:
```bash
cd server
npm install
```

Install frontend dependencies:
```bash
cd client
npm install
```

### Running Locally

Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd client
npm run dev
```

## API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/profile` | Private |
| PUT | `/api/auth/profile` | Private |

### Products
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |

### Cart
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/cart` | Private |
| POST | `/api/cart` | Private |
| PUT | `/api/cart/:itemId` | Private |
| DELETE | `/api/cart/:itemId` | Private |
| DELETE | `/api/cart` | Private |

### Orders
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/orders` | Private |
| GET | `/api/orders/myorders` | Private |
| GET | `/api/orders/:id` | Private |

### Admin
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/admin/products` | Admin |
| PUT | `/api/admin/products/:id` | Admin |
| DELETE | `/api/admin/products/:id` | Admin |
| GET | `/api/admin/orders` | Manager + Admin |
| PUT | `/api/admin/orders/:id` | Manager + Admin |
| GET | `/api/admin/users` | Admin |

### M-Pesa
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/mpesa/stkpush` | Private |
| POST | `/api/mpesa/callback` | Public |
| POST | `/api/mpesa/query` | Private |

## Query Parameters

Products endpoint supports:
- `?category=bags` — filter by category (bags, shoes, jewelry, gifts)
- `?search=keyword` — search by product name
- `?sort=price_asc` — sort by price ascending
- `?sort=price_desc` — sort by price descending

## Roles

| Role | Products | Orders | Users |
|------|----------|--------|-------|
| Customer | View only | Own orders | Own profile |
| Manager | View only | View + update all | None |
| Admin | Full CRUD | Full access | View all |

## M-Pesa Integration

Payments are processed via the Safaricom Daraja API using STK Push (Lipa Na M-Pesa Online). The current implementation uses the sandbox environment. To go live, replace the sandbox URLs in `mpesaController.js` with the production endpoints and update your credentials.

## Deployment

### Backend (Render)
- Connect GitHub repo to Render
- Set environment variables in Render dashboard
- Build command: `npm install`
- Start command: `npm start`

### Frontend (Vercel)
- Connect GitHub repo to Vercel
- Set root directory to `client`
- Add `VITE_API_URL` environment variable
- `vercel.json` handles SPA routing automatically

## License

MIT LICENSE