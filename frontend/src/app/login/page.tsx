import { Suspense } from "react";
import { LoginClient } from "@/components/auth/LoginClient";
import { googleEnabled } from "@/auth";

export const metadata = { title: "Sign In — ELARA" };

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="skeleton min-h-screen" />}>
      <LoginClient googleEnabled={googleEnabled} />
    </Suspense>
  );
}
