import Sidebar from "@/components/sidebar";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import InventoryChart from "@/components/inventory-chart";
import { unstable_noStore as noStore } from 'next/cache';

export default async function DashboardPage() {
    noStore();
    const user = await getCurrentUser();
    if (!user) return null;

    // 1. දත්ත ලබා ගැනීම (updatedAt පාවිච්චි කර ඇත සහ සියලුම දත්ත පෙන්වයි)
    const allProducts = await sql`SELECT name, stock, price, "updatedAt" FROM "Product"`;
    
    // Logic Calculations
    const totalProducts = allProducts.length;
    const totalValue = Math.round(allProducts.reduce((acc, p) => acc + (Number(p.price) * Number(p.stock)), 0));
    
    // Stock status logic
    const inStockCount = allProducts.filter((p: any) => Number(p.stock) > 10).length;
    const lowStockCount = allProducts.filter((p: any) => Number(p.stock) <= 10 && Number(p.stock) >= 1).length;
    const outOfStockCount = allProducts.filter((p: any) => Number(p.stock) === 0).length;

    // Percentages
    const inStockP = totalProducts > 0 ? Math.round((inStockCount / totalProducts) * 100) : 0;
    const lowStockP = totalProducts > 0 ? Math.round((lowStockCount / totalProducts) * 100) : 0;
    const outOfStockP = totalProducts > 0 ? Math.round((outOfStockCount / totalProducts) * 100) : 0;

    // 2. Chart Data Fix (updatedAt භාවිතා කර පසුගිය දින 30 දත්ත ලබා ගැනීම)
    const chartData = await sql`
        SELECT 
            TO_CHAR(date_trunc('day', "updatedAt"), 'MM/DD') as name, 
            COUNT(*)::int as products
        FROM "Product" 
        WHERE "updatedAt" >= NOW() - INTERVAL '30 days'
        GROUP BY date_trunc('day', "updatedAt") 
        ORDER BY date_trunc('day', "updatedAt") ASC
    `;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
            <Sidebar currentPath="/dashboard" />
            
            <main className="lg:ml-64 p-4 md:p-6 lg:p-8 transition-all duration-300">
                {/* Header */}
                <div className="mb-6 md:mb-10 animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-md">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    Dashboard
                                </h1>
                                <p className="text-xs md:text-sm text-gray-500 mt-1">System-wide inventory overview and analytics</p>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                            Updated just now
                        </div>
                    </div>
                </div>

                {/* Key Metrics Cards - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                    {[
                        { 
                            title: "Total Products", 
                            value: totalProducts, 
                            icon: "📦", 
                            color: "from-blue-500 to-blue-600",
                            change: "+12%"
                        },
                        { 
                            title: "Total Value", 
                            value: `$${totalValue.toLocaleString()}`, 
                            icon: "💰", 
                            color: "from-emerald-500 to-emerald-600",
                            change: "+8%"
                        },
                        { 
                            title: "Low Stock", 
                            value: lowStockCount, 
                            icon: "⚠️", 
                            color: "from-amber-500 to-amber-600",
                            change: totalProducts > 0 ? `${Math.round((lowStockCount/totalProducts)*100)}%` : "0%"
                        },
                        { 
                            title: "In Stock", 
                            value: inStockCount, 
                            icon: "✅", 
                            color: "from-purple-500 to-purple-600",
                            change: totalProducts > 0 ? `${Math.round((inStockCount/totalProducts)*100)}%` : "0%"
                        }
                    ].map((metric, idx) => (
                        <div 
                            key={idx} 
                            className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-gray-200/60 shadow-lg hover:shadow-xl hover:shadow-gray-200/30 transition-all duration-300 animate-slide-up"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs md:text-sm font-medium text-gray-500 mb-2">{metric.title}</p>
                                    <p className="text-2xl md:text-3xl font-bold text-gray-900">{metric.value}</p>
                                </div>
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color} shadow-md`}>
                                    <span className="text-lg">{metric.icon}</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs">
                                <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md">
                                    {metric.change}
                                </span>
                                <span className="text-gray-400 ml-2">from last month</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {/* Chart Section */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 md:p-8 border border-gray-200/60 shadow-xl hover:shadow-2xl hover:shadow-purple-100/20 transition-all duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-800">Activity Overview</h2>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-gray-500">Last 30 days</span>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        <div className="h-48 md:h-60">
                            <InventoryChart data={chartData} />
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Average daily updates</span>
                                <span className="font-bold text-gray-900">
                                    {chartData.length > 0 ? Math.round(chartData.reduce((acc: number, d: any) => acc + d.products, 0) / chartData.length) : 0}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stock Health Section */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 md:p-8 border border-gray-200/60 shadow-xl hover:shadow-2xl hover:shadow-purple-100/20 transition-all duration-300">
                        <h2 className="text-lg font-bold text-gray-800 mb-6">Stock Health</h2>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            {/* Circular Chart */}
                            <div className="relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="50%" cy="50%" r="45%" stroke="#f3f4f6" strokeWidth="10" fill="transparent" />
                                    <circle 
                                        cx="50%" cy="50%" r="45%" 
                                        stroke="url(#healthGradient)" strokeWidth="10" fill="transparent" 
                                        strokeDasharray="283" 
                                        strokeDashoffset={283 - (283 * inStockP / 100)} 
                                        strokeLinecap="round" 
                                    />
                                    <defs>
                                        <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#8b5cf6" />
                                            <stop offset="100%" stopColor="#3b82f6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="text-4xl md:text-5xl font-bold text-gray-900">{inStockP}%</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-2">Healthy Stock</div>
                                    <div className="text-xs text-gray-400 mt-1">{inStockCount} of {totalProducts} items</div>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="space-y-4 flex-1 min-w-0">
                                {[
                                    { label: "In Stock", value: inStockCount, percentage: inStockP, color: "bg-gradient-to-r from-purple-600 to-blue-500" },
                                    { label: "Low Stock", value: lowStockCount, percentage: lowStockP, color: "bg-gradient-to-r from-amber-500 to-orange-500" },
                                    { label: "Out of Stock", value: outOfStockCount, percentage: outOfStockP, color: "bg-gradient-to-r from-gray-300 to-gray-400" }
                                ].map((item, idx) => (
                                    <div key={idx} className="group p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{item.value}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                <div 
                                                    className={`h-1.5 rounded-full ${item.color}`}
                                                    style={{ width: `${item.percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-gray-500 ml-3">{item.percentage}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Inventory Levels */}
                    <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl p-5 md:p-8 border border-gray-200/60 shadow-xl hover:shadow-2xl hover:shadow-purple-100/20 transition-all duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-800">Recent Inventory Levels</h2>
                            <button className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1">
                                View All
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <div className="min-w-full">
                                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 pb-3 border-b border-gray-100">
                                    <div className="col-span-5">Product Name</div>
                                    <div className="col-span-3">Stock Status</div>
                                    <div className="col-span-2">Quantity</div>
                                    <div className="col-span-2">Value</div>
                                </div>
                                <div className="space-y-3 pt-3">
                                    {allProducts.slice(0, 6).map((p: any, i: number) => {
                                        const status = Number(p.stock) > 10 ? 'In Stock' : Number(p.stock) > 0 ? 'Low Stock' : 'Out of Stock';
                                        const statusColor = Number(p.stock) > 10 ? 'bg-green-100 text-green-800' : 
                                                           Number(p.stock) > 0 ? 'bg-amber-100 text-amber-800' : 
                                                           'bg-red-100 text-red-800';
                                        const totalValue = Math.round(Number(p.price) * Number(p.stock));
                                        
                                        return (
                                            <div 
                                                key={i} 
                                                className="grid grid-cols-12 gap-4 items-center py-3 px-2 rounded-lg hover:bg-gray-50/80 transition-colors group"
                                            >
                                                <div className="col-span-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                            </svg>
                                                        </div>
                                                        <span className="font-medium text-gray-900 truncate">{p.name}</span>
                                                    </div>
                                                </div>
                                                <div className="col-span-3">
                                                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${statusColor}`}>
                                                        {status}
                                                    </span>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="font-bold text-gray-900">{p.stock}</span>
                                                    <span className="text-gray-400 text-xs ml-1">units</span>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="font-bold text-gray-900">${totalValue.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-500">
                                Showing {Math.min(allProducts.length, 6)} of {allProducts.length} products
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}