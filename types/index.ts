export type UserRole             = "PUBLIC" | "SUBSCRIBER" | "ADMIN";
export type SubscriptionStatus   = "ACTIVE" | "INACTIVE" | "CANCELLED" | "LAPSED";
export type SubscriptionPlan     = "MONTHLY" | "YEARLY";
export type DrawStatus           = "PENDING" | "SIMULATED" | "PUBLISHED";
export type PaymentStatus        = "PENDING" | "PAID";
export type VerificationStatus   = "PENDING" | "APPROVED" | "REJECTED";

export interface UserProfile {
  id:         string;
  supabaseId: string;
  email:      string;
  name:       string | null;
  avatarUrl:  string | null;
  role:       UserRole;
  createdAt:  Date;
}

export interface ScoreEntry {
  id:         string;
  value:      number;
  datePlayed: Date;
}