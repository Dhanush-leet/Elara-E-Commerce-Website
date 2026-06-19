"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart, cartTotal, useUI } from "@/lib/store";
import { formatPrice } from "@/lib/products";
import { SmartImage } from "../SmartImage";

const steps = ["Shipping", "Payment", "Review"] as const;

type Shipping = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pin: string;
};

type Card = { number: string; name: string; expiry: string; cvv: string };

function FloatingInput({
  label,
  value,
  onChange,
  type = "text",
  required = true,
  className = "",
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type">) {
  return (
    <label className={`relative block ${className}`}>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className="peer w-full rounded-2xl border border-ink/20 bg-paper px-4 pb-2 pt-6 text-sm transition-colors focus:border-ink focus:outline-none"
        {...rest}
      />
      <span className="pointer-events-none absolute left-4 top-4 text-xs uppercase tracking-widest text-smoke transition-all peer-focus:top-2 peer-focus:text-[9px] peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[9px]">
        {label}
      </span>
    </label>
  );
}

function StepIndicator({ step }: { step: number }) {
  return (
    <ol className="mb-10 flex items-center" aria-label="Checkout progress">
      {steps.map((s, i) => (
        <li key={s} className={`flex items-center ${i < steps.length - 1 ? "flex-1" : ""}`}>
          <div className="flex flex-col items-center gap-2">
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold transition-all duration-500 ${
                i < step
                  ? "border-ink bg-ink text-paper"
                  : i === step
                    ? "border-accent bg-accent text-paper"
                    : "border-ink/25 text-smoke"
              }`}
              aria-current={i === step ? "step" : undefined}
            >
              {i < step ? (
                <svg width="13" height="11" viewBox="0 0 13 11" fill="none" aria-hidden="true">
                  <path d="M1 5.5L4.8 9.5L12 1.5" stroke="currentColor" strokeWidth="2" className="check-draw" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em]">{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className="relative mx-3 mb-5 h-px flex-1 bg-ink/15">
              <div
                className="absolute inset-y-0 left-0 bg-accent transition-all duration-700 ease-luxury"
                style={{ width: i < step ? "100%" : "0%" }}
              />
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

export function CheckoutClient() {
  const router = useRouter();
  const { items, clear } = useCart();
  const toast = useUI((s) => s.toast);
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<"card" | "upi" | "razorpay">("card");
  const [shipping, setShipping] = useState<Shipping>({
    name: "", email: "", phone: "", address: "", city: "", pin: "",
  });
  const [card, setCard] = useState<Card>({ number: "", name: "", expiry: "", cvv: "" });
  const [upi, setUpi] = useState("");
  const [cvvFocus, setCvvFocus] = useState(false);
  const [processing, setProcessing] = useState(false);

  const subtotal = cartTotal(items);
  const shipCost = subtotal >= 50000 ? 0 : 1200;
  const total = subtotal + shipCost;

  if (items.length === 0 && !processing) {
    return (
      <div className="px-4 py-24 text-center sm:px-8">
        <p className="font-serif text-3xl italic text-smoke">Your bag is empty.</p>
        <Link href="/collection" className="pill-solid mt-8 inline-flex">
          Back to the Collection
        </Link>
      </div>
    );
  }

  const placeOrder = async () => {
    setProcessing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, qty: i.qty })),
          lineItems: items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
          amount: total,
          method,
          shipping,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Payment failed");
      const order = {
        id: data.orderId,
        total,
        items,
        name: shipping.name,
        email: shipping.email,
        placedAt: new Date().toISOString(),
      };
      sessionStorage.setItem("elara-last-order", JSON.stringify(order));
      const history = JSON.parse(localStorage.getItem("elara-orders") ?? "[]");
      localStorage.setItem("elara-orders", JSON.stringify([order, ...history]));
      clear();
      router.push("/checkout/success");
    } catch (e) {
      setProcessing(false);
      toast(e instanceof Error ? e.message : "Payment failed — please retry");
    }
  };

  const shippingValid =
    shipping.name && shipping.email.includes("@") && shipping.address && shipping.city && shipping.pin;
  const paymentValid =
    method === "card"
      ? card.number.replace(/\s/g, "").length >= 15 && card.name && card.expiry && card.cvv.length >= 3
      : method === "upi"
        ? upi.includes("@")
        : true;

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-10 sm:px-8 lg:grid-cols-[3fr_2fr]">
      <div>
        <h1 className="display-mega mb-8 text-5xl sm:text-6xl">Checkout</h1>
        <StepIndicator step={step} />

        <AnimatePresence mode="wait">
          {/* ── Step 1: Shipping ─────────────────────── */}
          {step === 0 && (
            <motion.form
              key="shipping"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={(e) => {
                e.preventDefault();
                if (shippingValid) setStep(1);
              }}
              className="grid gap-4 sm:grid-cols-2"
            >
              <FloatingInput label="Full name" value={shipping.name} onChange={(v) => setShipping({ ...shipping, name: v })} autoComplete="name" />
              <FloatingInput label="Email" type="email" value={shipping.email} onChange={(v) => setShipping({ ...shipping, email: v })} autoComplete="email" />
              <FloatingInput label="Phone" type="tel" value={shipping.phone} onChange={(v) => setShipping({ ...shipping, phone: v })} autoComplete="tel" />
              <FloatingInput label="PIN code" value={shipping.pin} onChange={(v) => setShipping({ ...shipping, pin: v })} autoComplete="postal-code" />
              <FloatingInput label="Address" value={shipping.address} onChange={(v) => setShipping({ ...shipping, address: v })} className="sm:col-span-2" autoComplete="street-address" />
              <FloatingInput label="City" value={shipping.city} onChange={(v) => setShipping({ ...shipping, city: v })} autoComplete="address-level2" />
              <button
                type="submit"
                disabled={!shippingValid}
                className="rounded-full bg-ink py-4 text-sm font-bold uppercase tracking-[0.2em] text-paper transition-all hover:bg-accent disabled:opacity-30 sm:col-span-2"
              >
                Continue to Payment →
              </button>
            </motion.form>
          )}

          {/* ── Step 2: Payment ──────────────────────── */}
          {step === 1 && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-6 flex flex-wrap gap-2" role="radiogroup" aria-label="Payment method">
                {([["card", "Card"], ["upi", "UPI"], ["razorpay", "Razorpay"]] as const).map(([id, label]) => (
                  <button
                    key={id}
                    role="radio"
                    aria-checked={method === id}
                    onClick={() => setMethod(id)}
                    className={`pill ${method === id ? "!border-ink !bg-ink !text-paper" : ""}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {method === "card" && (
                <>
                  {/* 3D flipping card preview */}
                  <div className="flip-scene mx-auto mb-8 h-48 w-80 max-w-full">
                    <div className={`flip-card relative h-full w-full ${cvvFocus ? "flipped" : ""}`}>
                      <div className="flip-face absolute inset-0 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-ink via-[#2c2620] to-frame p-5 text-paper shadow-2xl">
                        <div className="flex justify-between">
                          <span className="font-serif text-lg italic">elara pay</span>
                          <span className="h-7 w-10 rounded bg-gold/80" aria-hidden="true" />
                        </div>
                        <p className="font-mono text-lg tracking-[0.2em]">
                          {card.number.padEnd(19, "•").slice(0, 19)}
                        </p>
                        <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-paper/70">
                          <span>{card.name || "Your name"}</span>
                          <span>{card.expiry || "MM/YY"}</span>
                        </div>
                      </div>
                      <div className="flip-face flip-back absolute inset-0 rounded-2xl bg-gradient-to-br from-ink to-frame p-5 text-paper shadow-2xl">
                        <div className="-mx-5 mt-3 h-9 bg-black" aria-hidden="true" />
                        <div className="mt-5 flex items-center justify-end gap-3">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-paper/60">CVV</span>
                          <span className="rounded bg-paper px-3 py-1 font-mono text-sm text-ink">
                            {"•".repeat(card.cvv.length) || "•••"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FloatingInput
                      label="Card number"
                      value={card.number}
                      onChange={(v) =>
                        setCard({ ...card, number: v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim() })
                      }
                      inputMode="numeric"
                      className="sm:col-span-2"
                      autoComplete="cc-number"
                    />
                    <FloatingInput label="Name on card" value={card.name} onChange={(v) => setCard({ ...card, name: v })} autoComplete="cc-name" />
                    <div className="grid grid-cols-2 gap-4">
                      <FloatingInput
                        label="Expiry"
                        value={card.expiry}
                        onChange={(v) =>
                          setCard({ ...card, expiry: v.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2") })
                        }
                        inputMode="numeric"
                        autoComplete="cc-exp"
                      />
                      <FloatingInput
                        label="CVV"
                        type="password"
                        value={card.cvv}
                        onChange={(v) => setCard({ ...card, cvv: v.replace(/\D/g, "").slice(0, 4) })}
                        onFocus={() => setCvvFocus(true)}
                        onBlur={() => setCvvFocus(false)}
                        inputMode="numeric"
                        autoComplete="cc-csc"
                      />
                    </div>
                  </div>
                </>
              )}

              {method === "upi" && (
                <FloatingInput label="UPI ID (name@bank)" value={upi} onChange={setUpi} className="max-w-md" />
              )}

              {method === "razorpay" && (
                <p className="max-w-md rounded-2xl border border-ink/15 bg-paper p-5 text-sm text-ink/70">
                  You&apos;ll be redirected to Razorpay to complete payment with
                  card, UPI, netbanking or wallets.
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-smoke">
                <span>🔒 256-bit TLS</span>
                <span>✱ PCI-DSS compliant</span>
                <span>✱ 3-D Secure</span>
              </div>

              <div className="mt-8 flex gap-3">
                <button onClick={() => setStep(0)} className="pill px-8 py-3.5">← Back</button>
                <button
                  onClick={() => paymentValid && setStep(2)}
                  disabled={!paymentValid}
                  className="flex-1 rounded-full bg-ink py-4 text-sm font-bold uppercase tracking-[0.2em] text-paper transition-all hover:bg-accent disabled:opacity-30"
                >
                  Review Order →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Review ───────────────────────── */}
          {step === 2 && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-ink/15 bg-paper p-5">
                  <h3 className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-smoke">Ship to</h3>
                  <p className="text-sm font-semibold">{shipping.name}</p>
                  <p className="text-sm text-ink/70">{shipping.address}, {shipping.city} {shipping.pin}</p>
                  <p className="text-sm text-ink/70">{shipping.email}</p>
                  <button onClick={() => setStep(0)} className="mt-3 font-mono text-[10px] uppercase tracking-widest text-accent">Edit</button>
                </div>
                <div className="rounded-2xl border border-ink/15 bg-paper p-5">
                  <h3 className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-smoke">Pay with</h3>
                  <p className="text-sm font-semibold uppercase">{method === "card" ? `Card •••• ${card.number.slice(-4)}` : method === "upi" ? `UPI — ${upi}` : "Razorpay"}</p>
                  <button onClick={() => setStep(1)} className="mt-3 font-mono text-[10px] uppercase tracking-widest text-accent">Edit</button>
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={processing}
                className="relative mt-8 w-full overflow-hidden rounded-full bg-ink py-5 text-sm font-bold uppercase tracking-[0.25em] text-paper transition-colors hover:bg-accent disabled:cursor-wait"
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-3">
                    <motion.span
                      className="h-4 w-4 rounded-full border-2 border-paper/30 border-t-paper"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    />
                    Processing payment…
                  </span>
                ) : (
                  <>Pay {formatPrice(total)} ✱</>
                )}
              </button>
              <button onClick={() => setStep(1)} disabled={processing} className="mt-4 w-full text-center font-mono text-[10px] uppercase tracking-widest text-smoke hover:text-ink">
                ← Back to payment
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Order summary rail ───────────────────────── */}
      <aside className="h-fit border border-ink/15 bg-paper p-6 lg:sticky lg:top-10">
        <h2 className="text-xs font-bold uppercase tracking-[0.25em]">Order Summary</h2>
        <div className="ruler-ticks my-4" aria-hidden="true" />
        <ul className="flex max-h-72 flex-col gap-4 overflow-y-auto">
          {items.map((i) => (
            <li key={i.id} className="flex items-center gap-3">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-stone">
                <SmartImage src={i.image} alt={i.name} fill sizes="56px" className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider">{i.name}</p>
                <p className="font-mono text-[10px] text-smoke">{i.color} × {i.qty}</p>
              </div>
              <span className="font-mono text-xs">{formatPrice(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-5 flex flex-col gap-2 border-t border-ink/10 pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-smoke">Subtotal</dt><dd className="font-mono">{formatPrice(subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-smoke">Shipping</dt><dd className="font-mono">{shipCost === 0 ? "Free" : formatPrice(shipCost)}</dd></div>
          <div className="flex justify-between text-base font-bold"><dt>Total</dt><dd className="font-mono">{formatPrice(total)}</dd></div>
        </dl>
      </aside>
    </div>
  );
}
