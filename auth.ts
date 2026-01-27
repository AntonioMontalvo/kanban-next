import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * NextAuth Instance
 *
 * This exports the main NextAuth functions we'll use throughout the app:
 * - auth: Check if user is authenticated
 * - signIn: Sign in a user
 * - signOut: Sign out a user
 * - handlers: API route handlers for /api/auth/*
 */

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig);
