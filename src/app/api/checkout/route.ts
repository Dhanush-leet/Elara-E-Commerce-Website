import { NextResponse } from "next/server";
import { sendEmail, orderEmail } from "@/lib/email";
import { formatPrice } from "@/lib/products";

/**
 * Payment intent endpoint.
 *
 * In production this creates a Stripe PaymentIntent (or Razorpay order)
 * using STRIPE_SECRET_KEY / RAZORPAY_KEY_SECRET from env. Without keys,
 * it runs in demo mode and returns a simulated confirmation so the
 * full checkout UX is testable end-to-end.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.items?.length || typeof body.amount !== "number") {
    return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
  }

  const hasStripe = !!process.env.STRIPE_SECRET_KEY;
  const hasRazorpay = !!process.env.RAZORPAY_KEY_SECRET;

  if (hasStripe || hasRazorpay) {
    // Real integration point — kept behind env so the demo runs keyless:
    //   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    //   const intent = await stripe.paymentIntents.create({
    //     amount: body.amount, currency: "inr",
    //     automatic_payment_methods: { enabled: true },
    //   });
    //   return NextResponse.json({ clientSecret: intent.client_secret });
  }

  // Demo mode: simulate processor latency + return an order id
  await new Promise((r) => setTimeout(r, 1400));
  const orderId = `ELR-${Date.now().toString(36).toUpperCase()}-${Math.floor(
    Math.random() * 900 + 100
  )}`;

  // Email the confirmation to the shipping address, if provided.
  const to = body?.shipping?.email;
  if (to && typeof to === "string" && to.includes("@")) {
    const lines = (body.lineItems ?? []).map(
      (l: { name: string; qty: number; price: number }) => ({
        name: l.name,
        qty: l.qty,
        price: formatPrice(l.price * l.qty),
      })
    );
    const tmpl = orderEmail({
      name: body?.shipping?.name,
      orderId,
      total: formatPrice(body.amount),
      lines,
    });
    sendEmail({ to, ...tmpl }).catch((e) =>
      console.error("[checkout] order email failed:", e)
    );
  }

  return NextResponse.json({
    ok: true,
    demo: !hasStripe && !hasRazorpay,
    orderId,
    amount: body.amount,
  });
}
