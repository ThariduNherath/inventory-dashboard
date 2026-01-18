import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { deleteProduct } from "../../lib/actions/product"; 
import { unstable_noStore as noStore } from 'next/cache';
import Link from "next/link";

export default async function InventoryPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; page?: string }>;
}) {
    noStore();
    const user = await getCurrentUser();
    if (!user) return null;
    
    const params = await searchParams;
    const q = (params.q ?? "").trim();
    const currentPage = Number(params.page) || 1;
    const itemsPerPage = 10; // එක පේජ් එකක පෙන්වන අයිතම ගණන
    const offset = (currentPage - 1) * itemsPerPage;

    const userId = "17fb6ca78-0fda-4fe2-bbf6-cfa2bca5d83f"; 
    const searchTerm = `%${q}%`;

    // 1. Filter කළ පසු ලැබෙන මුළු අයිතම ගණන (Pagination සඳහා)
    const countRes = await sql`
        SELECT COUNT(*) as total FROM "Product" 
        WHERE "userId" = ${userId} AND name ILIKE ${searchTerm}
    `;
    const totalItems = Number(countRes[0].total);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // 2. අදාළ පේජ් එකට අයිතම ලබා ගැනීම (LIMIT & OFFSET භාවිතයෙන්)
    const products = await sql`
        SELECT id, name, sku, price, stock as quantity, "lowStockAt" 
        FROM "Product" 
        WHERE "userId" = ${userId}
        AND name ILIKE ${searchTerm}
        ORDER BY name ASC
        LIMIT ${itemsPerPage} OFFSET ${offset}
    `;

    return (
        <div className="min-h-screen bg-[#f9fafb] flex">
            <Sidebar currentPath="/inventory" />
            
            <main className="ml-64 p-12 flex-1">
                <div className="mb-10">
                    <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your products and track inventory levels.</p>
                </div>

                {/* --- Search UI --- */}
                <div className="mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <form action="/inventory" method="GET" className="flex gap-2">
                        <input
                            type="text"
                            name="q"
                            defaultValue={q}
                            placeholder="Search products..."
                            className="flex-1 px-4 py-2 border border-[#6366f1]/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50"
                        />
                        <button type="submit" className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-2 rounded-lg text-sm font-medium">
                            Search
                        </button>
                    </form>
                </div>

                {/* --- Table --- */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Name</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Sku</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Price</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Quantity</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.length > 0 ? products.map((product: any) => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-5 text-sm font-medium text-gray-700">{product.name}</td>
                                    <td className="px-8 py-5 text-sm text-gray-400">{product.sku || "-"}</td>
                                    <td className="px-8 py-5 text-sm font-bold text-gray-700">${Number(product.price).toFixed(2)}</td>
                                    <td className="px-8 py-5 text-sm text-center font-bold">{product.quantity}</td>
                                    <td className="px-8 py-5 text-right text-sm">
                                        <form action={deleteProduct}>
                                            <input type="hidden" name="id" value={product.id} />
                                            <button type="submit" className="text-red-600 hover:text-red-900 font-medium px-4 py-2 hover:bg-red-50 rounded-lg">
                                                Delete
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5} className="px-8 py-10 text-center text-gray-400 text-sm">No items found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- Pagination UI (ඔයා එවපු රූපයේ විදිහට) --- */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        {/* Previous Button */}
                        <Link
                            href={`/inventory?q=${q}&page=${currentPage - 1}`}
                            className={`px-4 py-2 rounded-lg border text-sm transition-all ${currentPage <= 1 ? 'pointer-events-none opacity-50 bg-gray-50' : 'bg-white hover:bg-gray-50'}`}
                        >
                            &lt; Previous
                        </Link>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <Link
                                key={pageNum}
                                href={`/inventory?q=${q}&page=${pageNum}`}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-medium transition-all ${
                                    currentPage === pageNum 
                                    ? 'bg-[#7c3aed] text-white border-[#7c3aed]' 
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                                }`}
                            >
                                {pageNum}
                            </Link>
                        ))}

                        {/* Next Button */}
                        <Link
                            href={`/inventory?q=${q}&page=${currentPage + 1}`}
                            className={`px-4 py-2 rounded-lg border text-sm transition-all ${currentPage >= totalPages ? 'pointer-events-none opacity-50 bg-gray-50' : 'bg-white hover:bg-gray-50'}`}
                        >
                            Next &gt;
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}