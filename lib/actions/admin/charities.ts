"use server";

import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function createCharityAction(data: {
  name: string;
  description: string;
  slug: string;
  website?: string;
  featured?: boolean;
  active?: boolean;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const adminUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { role: true },
  });
  if (!adminUser || adminUser.role !== "ADMIN") throw new Error("Forbidden");

  await prisma.charity.create({
    data: {
      name: data.name,
      description: data.description,
      slug: data.slug,
      website: data.website,
      featured: data.featured ?? false,
      active: data.active ?? true,
    },
  });

  revalidatePath("/admin/charities");
}

export async function updateCharityAction(
  id: string,
  data: {
    name: string;
    description: string;
    slug: string;
    website?: string;
    featured?: boolean;
    active?: boolean;
  }
) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const adminUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { role: true },
  });
  if (!adminUser || adminUser.role !== "ADMIN") throw new Error("Forbidden");

  await prisma.charity.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      slug: data.slug,
      website: data.website,
      featured: data.featured,
      active: data.active,
    },
  });

  revalidatePath("/admin/charities");
}

export async function deleteCharityAction(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const adminUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { role: true },
  });
  if (!adminUser || adminUser.role !== "ADMIN") throw new Error("Forbidden");

  await prisma.charity.delete({ where: { id } });

  revalidatePath("/admin/charities");
}