import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createUser, verifyCredentials } from "./lib/users.js";
import { sendEmail, welcomeEmail, orderEmail, formatPrice } from "./lib/email.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// User Registration Route
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name?.trim() || !email?.trim() || !email.includes("@") || !password || password.length < 6) {
    return res.status(400).json({
      error: "Provide a name, valid email, and a password of at least 6 characters."
    });
  }

  try {
    const user = await createUser(name, email, password);
    res.json({ ok: true, email: user.email });
  } catch (e) {
    res.status(409).json({ error: e.message });
  }
});

// NextAuth Credentials Verification Route
app.post("/api/auth/verify", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const user = await verifyCredentials(email, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Order Checkout Route
app.post("/api/checkout", async (req, res) => {
  const { items, amount, shipping, lineItems } = req.body;

  if (!items?.length || typeof amount !== "number") {
    return res.status(400).json({ error: "Invalid order payload" });
  }

  const hasStripe = !!process.env.STRIPE_SECRET_KEY;
  const hasRazorpay = !!process.env.RAZORPAY_KEY_SECRET;

  if (hasStripe || hasRazorpay) {
    // Integration point placeholder
  }

  // Simulate checkout processing latency
  await new Promise((r) => setTimeout(r, 1400));
  const orderId = `ELR-${Date.now().toString(36).toUpperCase()}-${Math.floor(
    Math.random() * 900 + 100
  )}`;

  // Email confirmation to shipping address if provided
  const to = shipping?.email;
  if (to && typeof to === "string" && to.includes("@")) {
    const lines = (lineItems ?? []).map((l) => ({
      name: l.name,
      qty: l.qty,
      price: formatPrice(l.price * l.qty),
    }));

    const tmpl = orderEmail({
      name: shipping?.name,
      orderId,
      total: formatPrice(amount),
      lines,
    });

    sendEmail({ to, ...tmpl }).catch((e) =>
      console.error("[checkout] order email failed:", e)
    );
  }

  res.json({
    ok: true,
    demo: !hasStripe && !hasRazorpay,
    orderId,
    amount,
  });
});

// Welcome Email Route (Triggered during sign-in callback)
app.post("/api/email/welcome", async (req, res) => {
  const { email, name } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const tmpl = welcomeEmail(name);
    await sendEmail({ to: email, ...tmpl });
    res.json({ ok: true });
  } catch (e) {
    console.error("[email] welcome dispatch failed:", e);
    res.status(500).json({ error: "Failed to send welcome email" });
  }
});

app.listen(port, () => {
  console.log(`Elara Express backend running on port ${port}`);
});
