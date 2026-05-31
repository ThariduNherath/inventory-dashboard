"use server";

import { sql } from "@/lib/db"; 
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

// FIX: prevState එක සම්පූර්ණයෙන්ම අයින් කර formData එක පළමු parameter එක ලෙස සැකසීම.
// එවිට Server Component එකක සිට direct action එකක් ලෙස භාවිතා කළ හැක.
export async function createProduct(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const skuInput = formData.get("sku") as string; 
  const quantity = parseInt(formData.get("quantity") as string) || 0;
  const price = parseFloat(formData.get("price") as string) || 0;
  const lowStockAt = parseInt(formData.get("lowStockAt") as string) || 0;

  // SKU එක හිස් නම් unique key error එකක් නොවීමට NULL කිරීම
  const sku = skuInput?.trim() === "" ? null : skuInput;
  let isSuccess = false;

  try {
    await sql`
      INSERT INTO "Product" (
        id, name, sku, price, quantity, "lowStockAt", "userId", "updatedAt"
      )
      VALUES (
        ${crypto.randomUUID()}, 
        ${name}, 
        ${sku}, 
        ${price}, 
        ${quantity}, 
        ${lowStockAt}, 
        ${user.id}, 
        NOW()
      )
    `;
    isSuccess = true;
  } catch (error: any) {
    console.error("Database Insert Error:", error);
    // Unique Constraint (Duplicate SKU) Error එකක් ආවොත් handle කිරීම
    if (error.code === '23505') {
        throw new Error("This SKU is already in use. Please use a different one.");
    }
    throw new Error("Failed to add product. Please try again.");
  }

  // Next.js 16 වල redirect කරන්නේ try-catch එකෙන් පිටතයි
  if (isSuccess) {
    revalidatePath("/inventory");
    revalidatePath("/dashboard");
    redirect("/inventory");
  }
}

// --- Product එකක් මැකීම ---
export async function deleteProduct(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  const user = await getCurrentUser();
  if (!user || !id) return;

  try {
    await sql`
        DELETE FROM "Product" 
        WHERE id = ${id} AND "userId" = ${user.id}
    `;
    revalidatePath("/inventory");
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Database Delete Error:", error);
  }
}