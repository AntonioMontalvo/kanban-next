import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { sql } from "@vercel/postgres";

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
      try {
        // Save or update user in database
        if (user.email) {
          const result = await sql`
            INSERT INTO users (email, name, image)
            VALUES (${user.email}, ${user.name}, ${user.image})
            ON CONFLICT (email) 
            DO UPDATE SET 
              name = ${user.name},
              image = ${user.image}
            RETURNING id
          `;

          // Store the database ID in the user object
          user.id = result.rows[0].id.toString();
          console.log("User saved to database:", user.email, "ID:", user.id);
        }
        return true; // Allow sign in
      } catch (error) {
        console.error("Error saving user to database:", error);
        return true; // Still allow sign in even if DB save fails
      }
    },

    // Called whenever a session is checked
    async session({ session, token }) {
      // Add database user ID to session
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },

    // Called when JWT is created or updated
    async jwt({ token, user, account }) {
      // Store user ID in JWT token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
