import Link from "next/link";
import { BarChart3, Package, Plus, Settings, LayoutDashboard } from "lucide-react";
import { UserButton } from "@stackframe/stack";

export default function Sidebar({
  currentPath = "/dashboard",
}: {
  currentPath: string;
}) {
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Add Product", href: "/add-product", icon: Plus },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="fixed left-0 top-0 bg-[#0f172a] text-slate-300 w-64 min-h-screen flex flex-col border-r border-slate-800 z-50">
      
      {/* Brand Identity */}
      <div className="p-6 mb-4">
        <div className="flex items-center space-x-3 bg-gradient-to-br from-purple-500/10 to-transparent p-3 rounded-xl border border-purple-500/20">
          <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-purple-500/20">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold tracking-tight text-lg">Inventory Pro</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5">
        <div className="px-3 mb-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            Main Menu
          </p>
        </div>
        
        {navigation.map((item, key) => {
          const IconComponent = item.icon;
          const isActive = currentPath === item.href;
          return (
            <Link
              href={item.href}
              key={key}
              className={`flex items-center space-x-3 py-2.5 px-4 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20" 
                  : "hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <IconComponent className={`w-5 h-5 transition-colors ${
                isActive ? "text-white" : "text-slate-500 group-hover:text-purple-400"
              }`} />
              <span className="text-sm font-medium">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 mt-auto border-t border-slate-800/60 bg-slate-900/30">
        <div className="bg-slate-800/40 p-3 rounded-2xl hover:bg-slate-800 transition-colors border border-slate-700/50">
          <div className="flex items-center justify-between scale-95 origin-left">
              <UserButton showUserInfo />
          </div>
        </div>
       
      </div>
    </div>
  );
}