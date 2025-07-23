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
      "/ship-builds": "Ship Builds Overview",
      "/ship-builds/gladius-fighter": "Gladius Fighter Build",
      "/ship-builds/arrow-interceptor": "Arrow Interceptor Build",
      "/ship-builds/f8c-lightning": "F8C Lightning Build",
      "/ship-builds/hornet-ghost": "Hornet Ghost Build",
      "/ship-builds/hornet-super": "Hornet Super Build",
      "/ship-builds/guardian-mx": "Guardian MX Build",
      "/ship-builds/guardian-qi": "Guardian QI Build",
      "/basic-flight-controls": "Basic Flight Controls",
      "/navigation-systems": "Navigation Systems",
      "/ship-systems": "Ship Systems",
      "/ship-database": "Ship Database",
      "/star-map": "Star Map",
    };
    return pathMap[pathname] || "Welcome";
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0">
        {/* Top Bar */}
        <header className="bg-zinc-900 px-6 py-3 flex-shrink-0">
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
          <div className="max-w-7xl mx-auto px-8 py-8">
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
