<p align="center">
  <img alt="status" src="https://img.shields.io/badge/status-live-brightgreen">
  <img alt="license" src="https://img.shields.io/badge/license-MIT-blue">
  <img alt="next.js" src="https://img.shields.io/badge/Next.js-14-black">
  <img alt="payments" src="https://img.shields.io/badge/Payments-Razorpay-0d5eff">
  <img alt="auth" src="https://img.shields.io/badge/Auth-NextAuth.js-purple">
</p>

# 👜 Elara — E-Commerce Platform

Elara is a modern, premium e-commerce web application built with a focus on immersive aesthetics and a seamless user experience. It features interactive UI elements, full-stack authentication, and integrated payment flows.

**🔗 Live App:** [elara-e-commerce-website.vercel.app](https://elara-e-commerce-website.vercel.app/)

---

## ✨ Features

- **Immersive Frontend Experience** — Built with Next.js, Framer Motion, and Tailwind CSS for a fluid, animated shopping experience.
- **Trendy Checkout System** — Features a dynamic 3D-flipping credit card preview with real-time masking, and an animated UPI QR code scanner.
- **Discount & Coupon Engine** — Built-in cart logic capable of applying percentage-based discounts (e.g., `ELARA3001` for 10% off).
- **Authentication** — Seamless Google Account Sign-in and standard credential-based login powered by NextAuth.js.
- **Robust Backend** — An Express.js REST API handling secure orders, emails (Nodemailer), and Razorpay payment verification.
- **State Management** — Fast, unopinionated client-side state management using Zustand.

---

## 🛠️ Tech Stack

### Frontend
| Category | Technology |
|---|---|
| Framework | Next.js (React) |
| Styling | Tailwind CSS |
| Animations | Framer Motion, GSAP, Lenis (smooth scrolling) |
| State Management | Zustand |
| Auth | NextAuth.js (v5 beta) |
| Hosting | Vercel |

### Backend
| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Payments | Razorpay SDK |
| Mailing | Nodemailer |
| Security | bcryptjs, dotenv |
| Hosting | Railway |

---

## 🏗️ Deployment Architecture

Elara runs as two independently hosted services that communicate over HTTPS:

```
┌─────────────────────┐          ┌──────────────────────┐
│   Frontend (Next.js) │  HTTPS   │  Backend (Express.js) │
│   Hosted on Vercel    │ ───────▶ │   Hosted on Railway    │
│                       │          │                        │
│  elara-e-commerce-    │          │  Handles orders,       │
│  website.vercel.app   │          │  Razorpay, email       │
└─────────────────────┘          └──────────────────────┘
```

- **Frontend** auto-deploys to Vercel on every push to `main`
- **Backend** auto-deploys to Railway on every push to `main`
- Frontend talks to backend via `NEXT_PUBLIC_API_URL`, pointing to the Railway-hosted API

---

## 📂 Project Structure

```
elara/
├── frontend/
│   ├── app/
│   │   ├── (auth)/               # Login / signup routes
│   │   ├── (shop)/                # Product listing & detail pages
│   │   ├── checkout/              # Cart, coupon, payment flow
│   │   └── api/auth/[...nextauth]/route.ts
│   ├── components/
│   │   ├── checkout/              # 3D card preview, UPI QR scanner
│   │   ├── products/
│   │   └── auth/
│   ├── store/                     # Zustand stores (cart, auth, ui)
│   ├── lib/                       # API client, helpers
│   └── .env.local
│
├── backend/
│   ├── src/
│   │   ├── routes/                # orders, auth, payments
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── services/               # Razorpay, Nodemailer
│   │   └── middleware/
│   └── .env
│
└── README.md
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- npm or yarn
- A [Razorpay](https://razorpay.com/) account (test mode keys)
- A [Google Cloud](https://console.cloud.google.com/) OAuth client (for Google Sign-in)

### 1. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
SMTP_HOST=your_smtp_host
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
```

Start the backend server:

```bash
npm start
```

### 2. Set up the Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
AUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

### 3. Open the App

Navigate to [http://localhost:3000](http://localhost:3000) in your browser to view the application locally, or visit the [live deployment](https://elara-e-commerce-website.vercel.app/).

---

## 🧪 Usage Highlights

- **Testing Coupons** — Add an item to your cart, proceed to checkout, and enter `ELARA3001` in the order summary to see the 10% discount applied.
- **Testing Payments** — Use Razorpay's test card/UPI credentials, or scan the interactive UPI QR code for visual validation.

---

## 🗺️ Roadmap

- [x] Core storefront UI (Next.js + Tailwind + Framer Motion)
- [x] Google & credential authentication (NextAuth.js)
- [x] Checkout flow with 3D card preview + UPI QR
- [x] Coupon/discount engine
- [x] Razorpay payment integration
- [x] Production deployment (Vercel + Railway)
- [ ] Order history & tracking dashboard
- [ ] Admin panel for inventory & order management
- [ ] Wishlist and product reviews
- [ ] 3D product viewer (Three.js)

---

## 🤝 Contributing

This is currently a self-initiated portfolio project. Suggestions and feedback are welcome via Issues.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Dhanush G**
Final-year B.Tech CSBS student | Full-Stack Developer
[GitHub](https://github.com/Dhanush-leet) · [Live Demo](https://elara-e-commerce-website.vercel.app/)
