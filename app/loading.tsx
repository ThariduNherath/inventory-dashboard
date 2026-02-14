import { Package } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
          
          {/* Logo */}
          <div className="relative">
            <Package className="w-16 h-16 text-indigo-500 mx-auto" />
          </div>
        </div>
        
        {/* Loading text with gradient */}
        <p className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-medium mt-4">
          Loading...
        </p>
      </div>
    </div>
  );
}