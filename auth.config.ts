import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * NextAuth Configuration
 *
 * This file configures authentication for the application.
 * We're using Google OAuth as the authentication provider.
 *
 * Key Concepts:
 * - Provider: Where users authenticate (Google, GitHub, etc.)
 * - Callbacks: Functions that run during auth flow
 * - Session: How user data is stored between requests
 */

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login", // Custom login page (we'll create this)
  },
  callbacks: {
    // Called when user signs in
    async signIn({ user, account, profile }) {
      // You can add custom logic here (e.g., save user to database)
      console.log("User signed in:", user.email);
      return true; // Allow sign in
    },

    // Called whenever a session is checked
    async session({ session, token }) {
      // Add custom data to the session
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },

    // Called when JWT is created or updated
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
