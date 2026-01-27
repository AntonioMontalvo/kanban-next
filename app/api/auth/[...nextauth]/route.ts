import { handlers } from "@/auth";

/**
 * NextAuth API Route Handler
 * 
 * This file handles all authentication requests:
 * - GET /api/auth/signin - Show sign-in page
 * - POST /api/auth/signin - Handle sign-in
 * - GET /api/auth/signout - Sign out
 * - GET /api/auth/callback/google - Handle OAuth callback
 * - GET /api/auth/session - Get current session
 * - etc.
 * 
 * The [...nextauth] folder name is a "catch-all" route that
 * captures all paths under /api/auth/*
 */

export const { GET, POST } = handlers;
