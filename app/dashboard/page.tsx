import Sidebar from "@/components/sidebar";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import InventoryChart from "@/components/inventory-chart";
import { unstable_noStore as noStore } from 'next/cache';

export default async function DashboardPage() {
    noStore();
    const user = await getCurrentUser();
    if (!user) return null;
    const userId = "17fb6ca78-0fda-4fe2-bbf6-cfa2bca5d83f";

    // දත්ත ලබා ගැනීම
    const allProducts = await sql`SELECT name, stock, price, "createAt" FROM "Product" WHERE "userId" = ${userId}`;
    
    // Logic from image_bac689.png
    const totalProducts = allProducts.length;
    const totalValue = Math.round(allProducts.reduce((acc, p) => acc + (Number(p.price) * Number(p.stock)), 0));
    
    const inStockCount = allProducts.filter((p: any) => Number(p.stock) > 5).length;
    const lowStockCount = allProducts.filter((p: any) => Number(p.stock) <= 5 && Number(p.stock) >= 1).length;
    const outOfStockCount = allProducts.filter((p: any) => Number(p.stock) === 0).length;

    // Percentages as per image_bac689.png
    const inStockP = totalProducts > 0 ? Math.round((inStockCount / totalProducts) * 100) : 0;
    const lowStockP = totalProducts > 0 ? Math.round((lowStockCount / totalProducts) * 100) : 0;
    const outOfStockP = totalProducts > 0 ? Math.round((outOfStockCount / totalProducts) * 100) : 0;

    // Chart Data Fix (image_bb3303.png හි පෙනුම සඳහා)
    const chartData = await sql`
        SELECT 
            TO_CHAR(date_trunc('day', "createAt"), 'MM/DD') as name, 
            COUNT(*)::int as products
        FROM "Product" 
        WHERE "userId" = ${userId} AND "createAt" >= NOW() - INTERVAL '30 days'
        GROUP BY date_trunc('day', "createAt") 
        ORDER BY date_trunc('day', "createAt") ASC
    `;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar currentPath="/dashboard" />
            
            <main className="ml-64 p-10 flex-1">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back! Here is an overview of your inventory.</p>
                </div>

                {/* Top Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Key Metrics */}
                    <div className="bg-white rounded-xl p-10 shadow-sm border border-gray-100">
                        <h2 className="text-sm font-bold text-gray-800 mb-8">Key metrics</h2>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-4xl font-bold text-gray-900">{totalProducts}</div>
                                <div className="text-xs text-gray-400 mt-2">Total Products</div>
                                <div className="text-[10px] text-gray-400 mt-1">+{totalProducts} ↗</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-gray-900">${totalValue.toLocaleString()}</div>
                                <div className="text-xs text-gray-400 mt-2">Total Value</div>
                                <div className="text-[10px] text-gray-400 mt-1">+${totalValue} ↗</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-gray-900">{lowStockCount}</div>
                                <div className="text-xs text-gray-400 mt-2">Low Stock</div>
                                <div className="text-[10px] text-gray-400 mt-1">+{lowStockCount} ↗</div>
                            </div>
                        </div>
                    </div>

                    {/* New products chart */}
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                        <h2 className="text-sm font-bold text-gray-800 mb-6">New products per week</h2>
                        <div className="h-48">
                            <InventoryChart data={chartData} />
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Stock Levels */}
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                        <h2 className="text-sm font-bold text-gray-800 mb-6">Stock levels</h2>
                        <div className="space-y-4">
                            {allProducts.slice(0, 5).map((p: any, i: number) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2.5 h-2.5 rounded-full ${p.stock > 10 ? 'bg-green-500' : p.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                                        <span className="text-sm text-gray-600 font-medium">{p.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-amber-600">
                                        {p.stock} <span className="text-gray-400 font-normal">units</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Efficiency */}
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                        <h2 className="text-sm font-bold text-gray-800 mb-4">Efficiency</h2>
                        <div className="flex items-center justify-around h-full pb-8">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                    <div className="w-2.5 h-2.5 rounded-full bg-purple-600"></div> In Stock ({inStockP}%)
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                    <div className="w-2.5 h-2.5 rounded-full bg-purple-400"></div> Low Stock ({lowStockP}%)
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div> Out of Stock ({outOfStockP}%)
                                </div>
                            </div>
                            <div className="relative w-36 h-36 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="72" cy="72" r="64" stroke="#f3f4f6" strokeWidth="10" fill="transparent" />
                                    <circle 
                                        cx="72" cy="72" r="64" 
                                        stroke="#8b5cf6" strokeWidth="10" fill="transparent" 
                                        strokeDasharray="402" 
                                        strokeDashoffset={402 - (402 * inStockP / 100)} 
                                        strokeLinecap="round" 
                                    />
                                </svg>
                                <div className="absolute text-center">
                                    <div className="text-3xl font-bold text-gray-900">{inStockP}%</div>
                                    <div className="text-[10px] text-gray-400 uppercase font-bold">In Stock</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}