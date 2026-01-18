import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { deleteProduct } from "@/lib/actions/product"; 
import { unstable_noStore as noStore } from 'next/cache';
import Link from "next/link";

export default async function InventoryPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; page?: string }>;
}) {
    noStore();
    const user = await getCurrentUser();
    if (!user) return <div className="p-10">Access Denied.</div>;
    
    const params = await searchParams;
    const q = (params.q ?? "").trim();
    const currentPage = Number(params.page) || 1;
    const itemsPerPage = 10;
    const offset = (currentPage - 1) * itemsPerPage;

    const searchTerm = `%${q}%`;

    // 1. Count Total (සියලුම පරිශීලකයින්ගේ නිෂ්පාදන ගණනය කරයි)
    const countRes = await sql`
        SELECT COUNT(*) as total FROM "Product" 
        WHERE name ILIKE ${searchTerm}
    `;
    const totalItems = Number(countRes[0].total);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // 2. Fetch Products (සියලුම දත්ත updatedAt අනුව අලුත් ඒවා උඩට එන ලෙස ලබා ගනී)
    const products = await sql`
        SELECT id, name, sku, price, stock as quantity 
        FROM "Product" 
        WHERE name ILIKE ${searchTerm}
        ORDER BY "updatedAt" DESC
        LIMIT ${itemsPerPage} OFFSET ${offset}
    `;

    return (
        <div className="min-h-screen bg-[#f9fafb] flex">
            <Sidebar currentPath="/inventory" />
            <main className="ml-64 p-12 flex-1">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
                        <p className="text-sm text-gray-500 mt-1">Viewing all products in the system.</p>
                    </div>
                  
                </div>

                {/* Search UI */}
                <div className="mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <form action="/inventory" method="GET" className="flex gap-2">
                        <input
                            type="text"
                            name="q"
                            defaultValue={q}
                            placeholder="Search all products..."
                            className="flex-1 px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                        <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm">
                            Search
                        </button>
                    </form>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Name</th>
                                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">SKU</th>
                                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Price</th>
                                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Quantity</th>
                                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.length > 0 ? products.map((product: any) => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-4 text-sm font-medium text-gray-700">{product.name}</td>
                                    <td className="px-8 py-4 text-sm text-gray-400">{product.sku || "-"}</td>
                                    <td className="px-8 py-4 text-sm font-bold text-gray-700">${Number(product.price).toFixed(2)}</td>
                                    <td className="px-8 py-4 text-sm text-center font-bold">{product.quantity}</td>
                                    <td className="px-8 py-4 text-right">
                                        <form action={deleteProduct}>
                                            <input type="hidden" name="id" value={product.id} />
                                            <button type="submit" className="text-red-500 hover:text-red-700 text-sm font-medium">
                                                Delete
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5} className="px-8 py-10 text-center text-gray-400">No products found in database.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
{totalPages > 1 && (
    <div className="flex justify-center items-center gap-3 mt-10 pb-10">
        
        {/* Previous Button */}
        <Link 
            href={`/inventory?q=${q}&page=${currentPage - 1}`}
            className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${
                currentPage <= 1 
                ? 'pointer-events-none opacity-40 bg-gray-100 border-gray-200 text-gray-400' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
            }`}
        >
            Previous
        </Link>

        {/* Page Numbers */}
        <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link 
                    key={p} 
                    href={`/inventory?q=${q}&page=${p}`} 
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all shadow-sm ${
                        p === currentPage 
                        ? 'bg-purple-600 text-white border border-purple-600' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600'
                    }`}
                >
                    {p}
                </Link>
            ))}
        </div>

        {/* Next Button */}
        <Link 
            href={`/inventory?q=${q}&page=${currentPage + 1}`}
            className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${
                currentPage >= totalPages 
                ? 'pointer-events-none opacity-40 bg-gray-100 border-gray-200 text-gray-400' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
            }`}
        >
            Next
        </Link>
    </div>
)}
            </main>
        </div>
    );
}