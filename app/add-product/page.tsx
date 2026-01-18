import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { createProduct } from "@/lib/actions/product";

export default async function AddProductPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar currentPath="/add-product" />
      
      <main className="ml-64 p-8 transition-all duration-300">
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Add Product
            </h1>
          </div>
          <p className="text-sm text-gray-500 pl-11">Add a new product to your inventory management system.</p>
        </div>

        <div className="max-w-2xl animate-slide-up">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-8 shadow-xl shadow-purple-100/20 hover:shadow-2xl hover:shadow-purple-100/30 transition-all duration-300">
            <form action={createProduct} className="space-y-8">
              {/* Product Name */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300/80 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    placeholder="Enter product name"
                  />
                </div>
              </div>

              {/* Quantity & Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <input 
                      type="number" 
                      name="quantity" 
                      required 
                      min="0" 
                      className="w-full pl-12 pr-4 py-3.5 border border-gray-300/80 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 font-medium transition-colors">
                      $
                    </span>
                    <input 
                      type="number" 
                      name="price" 
                      step="0.01" 
                      required 
                      min="0" 
                      className="w-full pl-12 pr-4 py-3.5 border border-gray-300/80 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* SKU */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide">
                  SKU <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  <input 
                    type="text" 
                    name="sku" 
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300/80 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    placeholder="Enter SKU or product code"
                  />
                </div>
              </div>

              {/* Low Stock Alert */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide">
                  Low Stock Alert <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <input 
                    type="number" 
                    name="lowStockAt" 
                    required 
                    min="0" 
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300/80 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    placeholder="Notify when stock falls below"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500 ml-12">
                  System will alert you when stock reaches this level
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button 
                  type="submit" 
                  className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 font-semibold shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all duration-300 flex items-center gap-2 group"
                >
                  <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Product
                </button>
                <Link 
                  href="/inventory" 
                  className="px-8 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold border border-gray-300/60 hover:border-gray-400 transition-all duration-300 flex items-center gap-2 group"
                >
                  <svg className="w-5 h-5 text-gray-500 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}