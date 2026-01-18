"use server";

import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

// --- Product එකක් එකතු කිරීම ---
export async function createProduct(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const skuInput = formData.get("sku") as string; // මුලින්ම input එක ගන්න
  const stock = parseInt(formData.get("quantity") as string);
  const price = parseFloat(formData.get("price") as string);
  const lowStockAt = parseInt(formData.get("lowStockAt") as string);

  // 🔥 විසඳුම: SKU එක හිස් නම් (trim කළ පසු) එය NULL ලෙස සලකන්න.
  // Database එකේ Unique Constraint එක NULL අගයන්ට බලපාන්නේ නැත.
  const sku = skuInput?.trim() === "" ? null : skuInput;

  try {
    await sql`
      INSERT INTO "Product" (
        id, name, sku, price, stock, "lowStockAt", "userId", "updatedAt"
      )
      VALUES (
        ${crypto.randomUUID()}, 
        ${name}, 
        ${sku}, 
        ${price}, 
        ${stock}, 
        ${lowStockAt}, 
        ${user.id}, 
        NOW()
      )
    `;
  } catch (error: any) {
    console.error("Database Insert Error:", error);
    
    // Duplicate SKU error එකක් ආවොත් ඒක හඳුනාගෙන message එකක් යැවිය හැක
    if (error.code === '23505') {
        return { error: "This SKU is already in use. Please use a different one." };
    }
    
    return { error: "Failed to add product" };
  }

  // Inventory සහ Dashboard පිටු අලුත් කිරීම
  revalidatePath("/inventory");
  revalidatePath("/dashboard");
  redirect("/inventory");
}

// --- Product එකක් මැකීම ---
export async function deleteProduct(formData: FormData) {
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