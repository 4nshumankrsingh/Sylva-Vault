"use server";

import { resend } from "@/lib/resend";
import {
  drawResultsTemplate,
  winnerVerifiedTemplate,
  paymentSentTemplate,
  welcomeEmailTemplate,
} from "@/lib/email/templates";

const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@sylvavault.com";

export async function sendDrawResultsEmail({
  to,
  userName,
  month,
  year,
  drawnNumbers,
  matchCount,
  prizeAmount,
  isWinner,
}: {
  to: string;
  userName: string;
  month: number;
  year: number;
  drawnNumbers: number[];
  matchCount?: number;
  prizeAmount?: number;
  isWinner: boolean;
}) {
  const monthName = new Date(year, month - 1, 1).toLocaleString("en-GB", {
    month: "long",
  });

  try {
    await resend.emails.send({
      from: `Sylva Vault <${FROM}>`,
      to,
      subject: isWinner
        ? `You won in the ${monthName} ${year} draw — Sylva Vault`
        : `${monthName} ${year} Draw Results — Sylva Vault`,
      html: drawResultsTemplate({
        userName,
        month,
        year,
        drawnNumbers,
        matchCount,
        prizeAmount,
        isWinner,
      }),
    });
  } catch (error) {
    console.error("Failed to send draw results email:", error);
  }
}

export async function sendVerificationEmail({
  to,
  userName,
  matchCount,
  prizeAmount,
  status,
}: {
  to: string;
  userName: string;
  matchCount: number;
  prizeAmount: number;
  status: "APPROVED" | "REJECTED";
}) {
  try {
    await resend.emails.send({
      from: `Sylva Vault <${FROM}>`,
      to,
      subject:
        status === "APPROVED"
          ? "Your prize claim has been approved — Sylva Vault"
          : "Your prize claim could not be verified — Sylva Vault",
      html: winnerVerifiedTemplate({ userName, matchCount, prizeAmount, status }),
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }
}

export async function sendPaymentEmail({
  to,
  userName,
  prizeAmount,
  matchCount,
}: {
  to: string;
  userName: string;
  prizeAmount: number;
  matchCount: number;
}) {
  try {
    await resend.emails.send({
      from: `Sylva Vault <${FROM}>`,
      to,
      subject: "Your prize payment has been sent — Sylva Vault",
      html: paymentSentTemplate({ userName, prizeAmount, matchCount }),
    });
  } catch (error) {
    console.error("Failed to send payment email:", error);
  }
}

export async function sendWelcomeEmail({
  to,
  userName,
  plan,
}: {
  to: string;
  userName: string;
  plan: "MONTHLY" | "YEARLY";
}) {
  try {
    await resend.emails.send({
      from: `Sylva Vault <${FROM}>`,
      to,
      subject: "Welcome to Sylva Vault — your subscription is active",
      html: welcomeEmailTemplate({ userName, plan }),
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}