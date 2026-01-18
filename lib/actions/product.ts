"use server"

import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteProduct(formData: FormData) {
    const id = formData.get("id") as string;

    if (!id) {
        console.error("No product ID provided.");
        return;
    }

    try {
        // Database එකෙන් item එක මකා දැමීම
        await sql`
            DELETE FROM "Product" 
            WHERE "id"::text = ${id}::text
        `;

        console.log(`Successfully deleted product: ${id}`);

        // Table එක අලුත් (Refresh) කිරීමට මෙය අත්‍යවශ්‍යයි
        revalidatePath("/inventory");
        revalidatePath("/dashboard");
        
    } catch (error) {
        console.error("Database Delete Error:", error);
    }
}