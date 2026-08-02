"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useUI } from "@/lib/store";
import { Marquee } from "../Marquee";

type Mode = "signin" | "signup";

export function LoginClient({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/account";
  const toast = useUI((s) => s.toast);

  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogle = async () => {
    if (!googleEnabled) {
      toast("Add Google keys to .env.local to enable — see .env.example");
      return;
    }
    setLoading(true);
    await signIn("google", { callbackUrl: params.get("callbackUrl") || "/" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "signup") {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create account.");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email or password is incorrect.");
      setLoading(false);
      return;
    }

    toast("Welcome to the Maison — a note is on its way to your inbox ✱");
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* ── Editorial panel ─────────────────────────── */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-frame p-10 text-paper lg:flex">
        <Link href="/" className="font-serif text-3xl italic">elara</Link>

        <div>
          <p className="eyebrow-dot font-mono text-[10px] uppercase tracking-[0.3em] text-paper/60">
            Members Atelier
          </p>
          <h1 className="display-mega mt-4 text-6xl leading-[0.9]">
            Carry the<br />extraordinary.
          </h1>
          <p className="mt-6 max-w-sm font-serif text-xl italic text-paper/70">
            Sign in for early access to new drops, private events, and atelier
            exclusives — and a lifetime repair promise on every piece.
          </p>
        </div>

        <div className="-mx-10 -mb-10">
          <Marquee
            items={["Hand-finished in small ateliers", "Lifetime repairs", "Carry the extraordinary", "Est. 2026"]}
            dark
          />
        </div>
      </div>

      {/* ── Form panel ──────────────────────────────── */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="font-serif text-3xl italic lg:hidden">elara</Link>

          <div className="mt-8 flex gap-2" role="tablist">
            {(["signin", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => {
                  setMode(m);
                  setError(null);
                }}
                className={`pill ${mode === m ? "!border-ink !bg-ink !text-paper" : ""}`}
              >
                {m === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <h2 className="display-mega mt-6 text-4xl">
            {mode === "signin" ? "Welcome back" : "Join Elara"}
          </h2>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-ink/20 bg-paper py-3.5 text-sm font-medium transition-colors hover:border-ink disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" fill="#4285F4" />
              <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.96v2.34A9 9 0 0 0 9 18Z" fill="#34A853" />
              <path d="M3.98 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.02-2.34Z" fill="#FBBC05" />
              <path d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.94l3.02 2.34C4.68 5.16 6.66 3.58 9 3.58Z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-smoke">
            <span className="h-px flex-1 bg-ink/15" />
            or with email
            <span className="h-px flex-1 bg-ink/15" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <AnimatePresence>
              {mode === "signup" && (
                <motion.label
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="block overflow-hidden"
                >
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    autoComplete="name"
                    className="w-full rounded-2xl border border-ink/20 bg-paper px-4 py-3.5 text-sm focus:border-ink focus:outline-none"
                  />
                </motion.label>
              )}
            </AnimatePresence>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              autoComplete="email"
              className="w-full rounded-2xl border border-ink/20 bg-paper px-4 py-3.5 text-sm focus:border-ink focus:outline-none"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              className="w-full rounded-2xl border border-ink/20 bg-paper px-4 py-3.5 text-sm focus:border-ink focus:outline-none"
            />

            {error && (
              <p className="font-mono text-xs text-accent" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-3 rounded-full bg-ink py-4 text-sm font-bold uppercase tracking-[0.2em] text-paper transition-colors hover:bg-accent disabled:opacity-50"
            >
              {loading ? (
                <motion.span
                  className="h-4 w-4 rounded-full border-2 border-paper/30 border-t-paper"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                />
              ) : mode === "signin" ? (
                "Sign In →"
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-widest text-smoke">
            {mode === "signin" ? "New to Elara? " : "Already a member? "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-accent hover:underline"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>

          <Link href="/" className="mt-8 block text-center font-mono text-[10px] uppercase tracking-widest text-smoke hover:text-ink">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
