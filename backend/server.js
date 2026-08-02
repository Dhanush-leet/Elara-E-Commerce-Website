import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createUser, verifyCredentials } from "./lib/users.js";
import { sendEmail, welcomeEmail, orderEmail, formatPrice } from "./lib/email.js";
import { createOrder } from "./lib/orders.js";

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
  const { items, amount, shipping, lineItems, method, bank, upi } = req.body;

  if (!items?.length || typeof amount !== "number") {
    return res.status(400).json({ error: "Invalid order payload" });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const hasRazorpay = !!keyId && !!keySecret && keyId !== "rzp_test_placeholder_key";

  if (method === "razorpay") {
    if (hasRazorpay) {
      try {
        const Razorpay = (await import("razorpay")).default;
        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });
        const options = {
          amount: Math.round(amount * 100), // in paise
          currency: "INR",
          receipt: `rcpt_${Date.now()}`
        };
        const rzpOrder = await razorpay.orders.create(options);
        return res.json({
          ok: true,
          isRazorpay: true,
          demo: false,
          razorpayOrderId: rzpOrder.id,
          razorpayKeyId: keyId,
          amount,
        });
      } catch (err) {
        console.error("[checkout] failed to create razorpay order:", err);
        return res.status(500).json({ error: "Failed to initialize Razorpay payment" });
      }
    } else {
      // Demo mode for Razorpay
      const razorpayOrderId = `rzp_order_demo_${Date.now().toString(36).toUpperCase()}`;
      return res.json({
        ok: true,
        isRazorpay: true,
        demo: true,
        razorpayOrderId,
        amount,
      });
    }
  }

  // Simulate checkout processing latency
  await new Promise((r) => setTimeout(r, 1400));
  const orderId = `ELR-${Date.now().toString(36).toUpperCase()}-${Math.floor(
    Math.random() * 900 + 100
  )}`;

  // Persist order to JSON database
  try {
    const orderPayload = {
      id: orderId,
      amount,
      method,
      bank: method === "netbanking" ? bank : undefined,
      upi: method === "upi" ? upi : undefined,
      shipping,
      items,
      createdAt: new Date().toISOString(),
    };
    await createOrder(orderPayload);
  } catch (err) {
    console.error("[checkout] failed to save order to database:", err);
  }

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
    demo: true,
    orderId,
    amount,
  });
});

// Razorpay Payment Verification Route
app.post("/api/checkout/verify", async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    demo,
    items,
    amount,
    shipping,
    lineItems,
  } = req.body;

  if (!items?.length || typeof amount !== "number") {
    return res.status(400).json({ error: "Invalid order payload" });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const hasRazorpay = !!keyId && !!keySecret && keyId !== "rzp_test_placeholder_key";

  if (!demo && hasRazorpay) {
    // Verify signature
    try {
      const crypto = await import("node:crypto");
      const text = razorpay_order_id + "|" + razorpay_payment_id;
      const signature = crypto
        .createHmac("sha256", keySecret)
        .update(text)
        .digest("hex");

      if (signature !== razorpay_signature) {
        return res.status(400).json({ error: "Payment signature verification failed" });
      }
    } catch (err) {
      console.error("[checkout/verify] signature verification error:", err);
      return res.status(500).json({ error: "Error verifying payment signature" });
    }
  }

  // Payment is verified or it is a demo transaction, let's persist the order
  const orderId = `ELR-${Date.now().toString(36).toUpperCase()}-${Math.floor(
    Math.random() * 900 + 100
  )}`;

  try {
    const orderPayload = {
      id: orderId,
      amount,
      method: "razorpay",
      shipping,
      items,
      createdAt: new Date().toISOString(),
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      demo: !!demo,
    };
    await createOrder(orderPayload);
  } catch (err) {
    console.error("[checkout/verify] failed to save order to database:", err);
    return res.status(500).json({ error: "Failed to persist order" });
  }

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
      console.error("[checkout/verify] order email failed:", e)
    );
  }

  res.json({
    ok: true,
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

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Elara Express backend running on port ${port}`);
  });
}

export default app;
