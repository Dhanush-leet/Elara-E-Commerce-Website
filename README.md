# Elara - E-Commerce Platform

Elara is a modern, premium e-commerce web application built with a focus on immersive aesthetics and a seamless user experience. It features interactive UI elements, full-stack authentication, and integrated payment flows.

## Features

- **Immersive Frontend Experience:** Built with Next.js, Framer Motion, and Tailwind CSS.
- **Trendy Checkout System:** Features a dynamic 3D-flipping credit card preview with real-time masking, and an animated UPI QR code scanner.
- **Discount & Coupon Engine:** Built-in cart logic capable of applying percentage-based discounts (e.g., `ELARA3001` for 10% off).
- **Authentication:** Seamless Google Account Sign-in and standard credential-based login powered by NextAuth.js.
- **Robust Backend:** An Express.js REST API handling secure orders, emails (Nodemailer), and Razorpay payment verification.
- **State Management:** Fast, unopinionated client-side state management using Zustand.

## Tech Stack

### Frontend
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion, GSAP, Lenis (for smooth scrolling)
- **State:** Zustand
- **Auth:** NextAuth.js (v5 beta)

### Backend
- **Framework:** Node.js with Express
- **Payments:** Razorpay SDK
- **Mailing:** Nodemailer
- **Security:** bcryptjs, dotenv

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Set up the Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory with your secrets:
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
```
Start the frontend development server:
```bash
npm run dev
```

### 3. Open the App
Navigate to [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Usage Highlights
- **Testing Coupons:** Add an item to your cart, proceed to checkout, and enter `ELARA3001` in the order summary to see the 10% discount applied.
- **Testing Payments:** You can test the Razorpay flow using their test credentials, or use the interactive UPI QR code for visual validation.

## License
This project is open-source and available under the MIT License.
