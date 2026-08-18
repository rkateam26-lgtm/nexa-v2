/**
 * Nexa V2 — Shared TypeScript Definitions (Fondation technique)
 */

export interface Restaurant {
  id: string;
  name: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email?: string;
  role: 'client' | 'merchant' | 'admin';
}
