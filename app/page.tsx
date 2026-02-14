import Link from "next/link";
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8faff] flex items-center justify-center relative overflow-hidden">
      {/* Minimal decorative elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
      
      <div className="container mx-auto px-4 py-16 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-full px-4 py-2 mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-medium text-slate-600">
              Smart Inventory Tracking
            </span>
          </div>
          
          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            Inventory{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              Management
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Streamline your inventory tracking with our powerful, easy-to-use management system. 
            Track products, monitor stock levels, and gain valuable insights.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/sign-in"
              className="group bg-indigo-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-indigo-700 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-200 flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#"
              className="text-slate-700 px-8 py-3.5 rounded-full font-semibold hover:bg-slate-100 transition-colors"
            >
              Learn More →
            </Link>
          </div>

          {/* Simple stat */}
          <div className="mt-12 text-sm text-slate-500">
            Trusted by 500+ businesses worldwide
          </div>
        </div>
      </div>
    </div>
  );
}