"use server";

import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function uploadProofAction(winnerId: string, formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });
  if (!dbUser) throw new Error("User not found");

  // Verify the winner record belongs to this user
  const winner = await prisma.winner.findFirst({
    where: { id: winnerId, userId: dbUser.id },
  });
  if (!winner) throw new Error("Winner record not found");

  if (winner.verificationStatus !== "PENDING") {
    throw new Error("This claim has already been reviewed");
  }

  const file = formData.get("proof") as File | null;
  if (!file) throw new Error("No file provided");

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("File must be an image (JPEG, PNG, WebP, or GIF)");
  }

  // Validate file size — max 5MB
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File size must be under 5MB");
  }

  const serviceClient = await createServiceClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `winner-proofs/${dbUser.id}/${winnerId}.${fileExt}`;

  const { error: uploadError } = await serviceClient.storage
    .from("winner-proofs")
    .upload(fileName, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data: urlData } = serviceClient.storage
    .from("winner-proofs")
    .getPublicUrl(fileName);

  await prisma.winner.update({
    where: { id: winnerId },
    data: { proofUrl: urlData.publicUrl },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getUserWinnings() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });
  if (!dbUser) return [];

  return prisma.winner.findMany({
    where: { userId: dbUser.id },
    include: { draw: { select: { month: true, year: true } } },
    orderBy: { createdAt: "desc" },
  });
}