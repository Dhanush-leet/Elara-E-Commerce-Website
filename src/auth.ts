import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { verifyCredentials } from "@/lib/users";
import { sendEmail, welcomeEmail } from "@/lib/email";

const providers: NextAuthConfig["providers"] = [
  Credentials({
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (creds) => {
      const email = creds?.email as string | undefined;
      const password = creds?.password as string | undefined;
      if (!email || !password) return null;
      const user = await verifyCredentials(email, password);
      if (!user) return null;
      return { id: user.id, name: user.name, email: user.email };
    },
  }),
];

// Google is added only when credentials are configured, so the app
// builds and runs without them (the button shows a setup hint instead).
export const googleEnabled =
  !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

if (googleEnabled) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET || "elara-dev-secret-please-change-in-prod",
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.name = user.name;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
  events: {
    // Push a welcome email to the customer's address on every sign-in.
    async signIn({ user }) {
      if (!user?.email) return;
      const tmpl = welcomeEmail(user.name);
      try {
        await sendEmail({ to: user.email, ...tmpl });
      } catch (err) {
        console.error("[auth] welcome email failed:", err);
      }
    },
  },
});
