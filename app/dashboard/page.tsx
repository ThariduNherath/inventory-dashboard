import Sidebar from "@/components/sidebar";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { TrendingUp, Package, AlertTriangle, DollarSign } from "lucide-react";
import InventoryChart from "../../components/inventory-chart";

export default async function DashboardPage() {
    const user = await getCurrentUser();
    if (!user) return null;
  // පරීක්ෂා කිරීම සඳහා තාවකාලිකව මෙහෙම දාන්න
const userId = "17fb6ca78-0fda-4fe2-bbf6-cfa2bca5d83f";

    // 1. Neon SQL Queries
    
    
    // Key Metrics
    const productRes = await sql`SELECT count(*) as count FROM "Product" WHERE "userId" = ${userId}`;
    const valueRes = await sql`SELECT COALESCE(SUM(price * "stock"), 0) as total_value FROM "Product" WHERE "userId" = ${userId}`;
    const lowStockRes = await sql`SELECT count(*) as count FROM "Product" WHERE "userId" = ${userId} AND "stock" < 10`;
    
    // Chart Data: පසුගිය දින 30 සඳහා (Column name: "createAt")
    const chartData = await sql`
        SELECT 
            TO_CHAR(date_trunc('day', "createAt"), 'DD Mon') as name, 
            COUNT(*)::int as value
        FROM "Product"
        WHERE "userId" = ${userId} 
            AND "createAt" >= NOW() - INTERVAL '30 days'
        GROUP BY date_trunc('day', "createAt")
        ORDER BY date_trunc('day', "createAt") ASC
    `;

    // Stock levels list
    const stockProducts = await sql`SELECT name, "stock" FROM "Product" WHERE "userId" = ${userId} ORDER BY "stock" ASC LIMIT 5`;

    const totalProducts = Number(productRes[0].count);
    const totalValue = Number(valueRes[0].total_value);
    const lowStock = Number(lowStockRes[0].count);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar currentPath="/dashboard" />
            
            <main className="ml-64 p-8 flex-1">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Inventory Dashboard</h1>
                    <p className="text-sm text-gray-500">Real-time overview of your products and stock levels.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Key Metrics Card */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            Key Metrics <TrendingUp className="text-green-500" size={18} />
                        </h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
                                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Products</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</div>
                                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Value</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-amber-600">{lowStock}</div>
                                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Low Stock</div>
                            </div>
                        </div>
                    </div>

                    {/* Inventory Growth Chart */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory Growth (30 Days)</h2>
                        <InventoryChart data={chartData} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Stock Levels List */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Critical Stock Items</h2>
                        <div className="space-y-3">
                            {stockProducts.length > 0 ? (
                                stockProducts.map((product: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-3 border border-gray-50 hover:border-purple-100 hover:bg-purple-50/30 rounded-lg transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${product.stock < 10 ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
                                            <span className="text-sm font-medium text-gray-700">{product.name}</span>
                                        </div>
                                        <span className="text-xs font-bold text-gray-500">{product.stock} in stock</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 italic text-center py-4">No products found</p>
                            )}
                        </div>
                    </div>

                    {/* Stock Health/Efficiency Circle */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col items-center justify-center">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 w-full">Inventory Health</h2>
                        <div className="relative flex items-center justify-center w-32 h-32">
                           <svg className="w-full h-full transform -rotate-90">
                               <circle cx="64" cy="64" r="58" stroke="#f3f4f6" strokeWidth="10" fill="transparent" />
                               <circle 
                                    cx="64" cy="64" r="58" 
                                    stroke="#8b5cf6" 
                                    strokeWidth="10" 
                                    fill="transparent" 
                                    strokeDasharray="364.4" 
                                    strokeDashoffset={364.4 - (364.4 * 0.67)} 
                                    strokeLinecap="round" 
                                />
                           </svg>
                           <div className="absolute text-center">
                               <span className="text-2xl font-bold block">67%</span>
                               <span className="text-[10px] text-gray-400 font-bold uppercase">Optimal</span>
                           </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}