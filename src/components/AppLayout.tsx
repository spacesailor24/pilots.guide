"use client";

import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Get the current page title based on the pathname
  const getPageTitle = () => {
    const pathMap: { [key: string]: string } = {
      "/welcome": "Welcome",
      "/day-one-moving-the-pip": "Day One - Moving the Pip",
      "/basic-flight-controls": "Basic Flight Controls",
      "/navigation-systems": "Navigation Systems",
      "/ship-systems": "Ship Systems",
      "/ship-database": "Ship Database",
      "/star-map": "Star Map",
    };
    return pathMap[pathname] || "Welcome";
  };

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-zinc-900 px-6 py-3">
          <div className="flex items-center justify-between">
            <nav className="text-sm text-gray-400">
              <Link
                href="/welcome"
                className="hover:text-red-400 transition-colors"
              >
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">{getPageTitle()}</span>
            </nav>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {children}

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-red-600/30">
              <p className="text-sm text-gray-500">Last updated 4 hours ago</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
