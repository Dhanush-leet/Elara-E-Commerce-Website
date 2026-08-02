"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.hasOwnProperty("Razorpay")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function ScramblingCardNumber({ name, number }: { name: string; number: string }) {
  const [scramble, setScramble] = useState(true);
  const [randomStr, setRandomStr] = useState("0000 0000 0000 0000");

  useEffect(() => {
    const endTime = Date.now() + 3000;
    const interval = setInterval(() => {
      if (Date.now() > endTime) {
        clearInterval(interval);
        setScramble(false);
      } else {
        let r = "";
        for(let i=0; i<16; i++) {
          r += Math.floor(Math.random() * 10).toString();
          if (i % 4 === 3 && i !== 15) r += " ";
        }
        setRandomStr(r);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const rawNum = number.replace(/\s/g, "");
  if (rawNum.length >= 13) {
    return <>{`**** **** **** ${rawNum.slice(-4).padEnd(4, "•")}`}</>;
  }
  
  if (scramble) {
    return <>{randomStr}</>;
  }

  const nameStr = name || "elara user";
  let hash = 0;
  for (let i = 0; i < nameStr.length; i++) {
    hash = nameStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const userLast4 = Math.abs(hash % 10000).toString().padStart(4, "0");
  return <>{`**** **** **** ${userLast4}`}</>;
}

export function CheckoutClient() {
  const router = useRouter();
  const { items, clear } = useCart();
  const toast = useUI((s) => s.toast);
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<"card" | "upi" | "netbanking" | "razorpay">("card");
  const [shipping, setShipping] = useState<Shipping>({
    name: "", email: "", phone: "", address: "", city: "", pin: "",
  });
  const [card, setCard] = useState<Card>({ number: "", name: "", expiry: "", cvv: "" });
  const [upi, setUpi] = useState("");
  const [bank, setBank] = useState("");
  const [cvvFocus, setCvvFocus] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Razorpay simulator state
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatorOrderId, setSimulatorOrderId] = useState("");
  const [simulatorAmount, setSimulatorAmount] = useState(0);

  const subtotal = cartTotal(items);
  const shipCost = appliedCoupon === "DHANUSH3001" ? 0 : (subtotal >= 50000 ? 0 : 1200);
  const discountAmount = appliedCoupon === "DHANUSH3001" ? subtotal : (appliedCoupon === "ELARA3001" ? subtotal * 0.1 : 0);
  const flatFee = appliedCoupon === "DHANUSH3001" ? 10 : 0;
  const total = subtotal - discountAmount + shipCost + flatFee;

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

  const finalizeOrder = (orderId: string) => {
    const order = {
      id: orderId,
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
  };

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
          bank: method === "netbanking" ? bank : undefined,
          upi: method === "upi" ? upi : undefined,
          shipping,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Payment failed");

      if (method === "razorpay") {
        if (data.demo) {
          setSimulatorOrderId(data.razorpayOrderId);
          setSimulatorAmount(total);
          setShowSimulator(true);
          return;
        } else {
          const loaded = await loadRazorpayScript();
          if (!loaded) {
            throw new Error("Failed to load Razorpay payment SDK");
          }

          const options = {
            key: data.razorpayKeyId,
            amount: Math.round(total * 100),
            currency: "INR",
            name: "Elara Maison",
            description: "Order Checkout",
            order_id: data.razorpayOrderId,
            prefill: {
              name: shipping.name,
              email: shipping.email,
              contact: shipping.phone,
            },
            theme: {
              color: "#1e1b18",
            },
            handler: async function (response: any) {
              try {
                const verifyRes = await fetch("/api/checkout/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    demo: false,
                    items: items.map((i) => ({ id: i.id, qty: i.qty })),
                    lineItems: items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
                    amount: total,
                    shipping,
                  }),
                });
                const verifyData = await verifyRes.json();
                if (!verifyRes.ok || !verifyData.ok) {
                  throw new Error(verifyData.error ?? "Payment verification failed");
                }
                finalizeOrder(verifyData.orderId);
              } catch (e: any) {
                setProcessing(false);
                toast(e.message ?? "Verification failed");
              }
            },
            modal: {
              ondismiss: function () {
                setProcessing(false);
                toast("Payment checkout closed");
              }
            }
          };
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
          return;
        }
      }

      finalizeOrder(data.orderId);
    } catch (e) {
      setProcessing(false);
      toast(e instanceof Error ? e.message : "Payment failed — please retry");
    }
  };

  const handleSimulatorSuccess = async () => {
    setShowSimulator(false);
    try {
      const verifyRes = await fetch("/api/checkout/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_payment_id: `rzp_payment_demo_${Date.now().toString(36).toUpperCase()}`,
          razorpay_order_id: simulatorOrderId,
          razorpay_signature: "demo_signature",
          demo: true,
          items: items.map((i) => ({ id: i.id, qty: i.qty })),
          lineItems: items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
          amount: simulatorAmount,
          shipping,
        }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.ok) {
        throw new Error(verifyData.error ?? "Payment verification failed");
      }
      finalizeOrder(verifyData.orderId);
    } catch (e: any) {
      setProcessing(false);
      toast(e.message ?? "Simulation verification failed");
    }
  };

  const handleSimulatorFailure = () => {
    setShowSimulator(false);
    setProcessing(false);
    toast("Razorpay payment simulated failure");
  };

  const shippingValid =
    shipping.name && shipping.email.includes("@") && shipping.address && shipping.city && shipping.pin;
  const paymentValid =
    method === "card"
      ? card.number.replace(/\s/g, "").length >= 15 && card.name && card.expiry && card.cvv.length >= 3
      : method === "upi"
        ? upi.includes("@")
        : method === "netbanking"
          ? !!bank
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
                {([["card", "Card"], ["upi", "UPI"], ["netbanking", "Net Banking"], ["razorpay", "Razorpay"]] as const).map(([id, label]) => (
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
                          <ScramblingCardNumber name={card.name} number={card.number} />
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
                <div className="flex flex-col gap-6 max-w-md">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-full max-w-[280px] mx-auto sm:mx-0 rounded-2xl overflow-hidden border border-ink/15 bg-paper p-4 group shadow-sm hover:shadow-xl transition-shadow duration-500"
                  >
                    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-2xl">
                      <motion.div 
                        className="w-full h-[2px] bg-accent/80 shadow-[0_0_12px_rgba(255,51,102,0.8)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        animate={{ y: [16, 260, 16] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                      />
                    </div>
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=elara@bank&pn=Elara" 
                      alt="Scan to pay with UPI"
                      className="relative z-0 w-full h-auto object-contain rounded-xl transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-ink/5 group-hover:ring-accent/40 transition-all duration-500 pointer-events-none" />
                  </motion.div>
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-ink/15"></div>
                    </div>
                    <div className="relative bg-paper px-4 text-[10px] uppercase tracking-widest text-smoke font-mono">
                      OR ENTER UPI ID
                    </div>
                  </div>
                  <FloatingInput label="UPI ID (name@bank)" value={upi} onChange={setUpi} className="w-full" />
                </div>
              )}

              {method === "netbanking" && (
                <div className="max-w-md rounded-2xl border border-ink/15 bg-paper p-5">
                  <label className="block mb-2 font-mono text-[9px] uppercase tracking-widest text-smoke">Select your Bank</label>
                  <select
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="w-full rounded-2xl border border-ink/20 bg-paper px-4 py-4 text-sm focus:border-ink focus:outline-none"
                  >
                    <option value="">-- Choose a Bank --</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                  </select>
                </div>
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
                  <p className="text-sm font-semibold uppercase">
                    {method === "card"
                      ? `Card •••• ${card.number.slice(-4)}`
                      : method === "upi"
                        ? `UPI — ${upi}`
                        : method === "netbanking"
                          ? `Net Banking — ${bank.toUpperCase()}`
                          : "Razorpay"}
                  </p>
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
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Coupon Code" 
              value={couponCode} 
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              disabled={!!appliedCoupon}
              className="flex-1 rounded-full border border-ink/20 bg-transparent px-4 py-2 text-xs focus:border-ink focus:outline-none disabled:opacity-50"
            />
            <button 
              onClick={() => {
                if (couponCode === "ELARA3001") {
                  setAppliedCoupon(couponCode);
                  toast("Coupon applied! 10% off.");
                } else if (couponCode === "DHANUSH3001") {
                  setAppliedCoupon(couponCode);
                  toast("Special coupon applied!");
                } else {
                  toast("Invalid coupon code.");
                }
              }}
              disabled={!!appliedCoupon || !couponCode}
              className="rounded-full bg-ink px-4 py-2 text-xs text-paper disabled:opacity-50"
            >
              {appliedCoupon ? "Applied" : "Apply"}
            </button>
          </div>
          <div className="flex justify-between mt-2"><dt className="text-smoke">Subtotal</dt><dd className="font-mono">{formatPrice(subtotal)}</dd></div>
          {appliedCoupon === "ELARA3001" && (
            <div className="flex justify-between text-accent"><dt>Discount (10%)</dt><dd className="font-mono">-{formatPrice(discountAmount)}</dd></div>
          )}
          {appliedCoupon === "DHANUSH3001" && (
            <div className="flex justify-between text-accent"><dt>Discount (100%)</dt><dd className="font-mono">-{formatPrice(discountAmount)}</dd></div>
          )}
          <div className="flex justify-between"><dt className="text-smoke">Shipping</dt><dd className="font-mono">{shipCost === 0 ? "Free" : formatPrice(shipCost)}</dd></div>
          {appliedCoupon === "DHANUSH3001" && (
            <div className="flex justify-between text-smoke"><dt>Fee</dt><dd className="font-mono">{formatPrice(flatFee)}</dd></div>
          )}
          <div className="flex justify-between text-base font-bold"><dt>Total</dt><dd className="font-mono">{formatPrice(total)}</dd></div>
        </dl>
      </aside>

      {/* ── Razorpay Simulator Modal ────────────────── */}
      <AnimatePresence>
        {showSimulator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="w-full max-w-md overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-2xl"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-200">
                      Razorpay Sandbox
                    </span>
                    <h2 className="text-xl font-bold tracking-tight">Elara Maison</h2>
                  </div>
                  <span className="rounded-full bg-white/20 px-3 py-1 font-mono text-xs font-semibold backdrop-blur-md">
                    Test Mode
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-sm font-light text-blue-200">Amount to pay:</span>
                  <span className="text-2xl font-bold font-mono">
                    {formatPrice(simulatorAmount)}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-6">
                <div className="mb-6 rounded-2xl bg-amber-500/10 p-4 border border-amber-500/20 text-amber-800 text-xs leading-relaxed">
                  <div className="flex gap-2 font-semibold mb-1">
                    <span>⚠️</span>
                    <span>Demo Simulator Mode Active</span>
                  </div>
                  This interface simulates a live transaction. No real funds will be charged.
                </div>

                <div className="mb-6 flex flex-col gap-3 font-mono text-xs text-smoke">
                  <div className="flex justify-between border-b border-ink/5 pb-2">
                    <span>Order Reference</span>
                    <span className="font-semibold text-ink">{simulatorOrderId}</span>
                  </div>
                  <div className="flex justify-between border-b border-ink/5 pb-2">
                    <span>Integrator Method</span>
                    <span className="font-semibold text-ink">Razorpay SDK Call</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleSimulatorSuccess}
                    className="w-full rounded-2xl bg-emerald-600 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.98]"
                  >
                    Simulate Payment Success ✓
                  </button>
                  <button
                    onClick={handleSimulatorFailure}
                    className="w-full rounded-2xl border border-rose-200 bg-rose-50/50 py-4 text-sm font-bold uppercase tracking-wider text-rose-700 transition-all hover:bg-rose-50 active:scale-[0.98]"
                  >
                    Simulate Payment Failure ✗
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-center gap-2 border-t border-ink/5 bg-stone/20 py-4 text-[10px] uppercase tracking-widest text-smoke font-mono">
                <span>🛡️ PCI-DSS Compliant</span>
                <span>•</span>
                <span>256-Bit SSL Secured</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
