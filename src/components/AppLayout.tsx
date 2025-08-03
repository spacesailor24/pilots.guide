"use client";

import Sidebar from "./Sidebar";
import HamburgerMenu from "./HamburgerMenu";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <HamburgerMenu />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0">
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[3000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-8 mt-16 lg:mt-0">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
