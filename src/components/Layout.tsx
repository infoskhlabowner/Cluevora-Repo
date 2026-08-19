import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, FolderOpen, Search, Trophy, User } from "lucide-react";
import { cn } from "../lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const NAV_ITEMS = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/cases", icon: FolderOpen, label: "Cases" },
    { path: "/evidence", icon: Search, label: "Evidence" },
    { path: "/leaderboard", icon: Trophy, label: "Ranks" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#434832] max-w-md mx-auto relative shadow-sm overflow-hidden border-x border-[#E9EDC6]">
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>
      
      <nav className="fixed bottom-0 w-full max-w-md bg-[#FDFBF7]/95 backdrop-blur border-t border-[#E9EDC6] flex justify-between px-2 pb-4 pt-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-16 gap-1 transition-colors",
                isActive ? "text-[#7D8F69]" : "text-[#434832] opacity-50 hover:opacity-100"
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  );
}
