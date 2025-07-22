"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    {
      section: "SCHOLA VOLANDI",
      items: [
        { name: "Welcome", href: "/welcome", icon: "🚀" },
        {
          name: "Day One - Moving the Pip",
          href: "/day-one-moving-the-pip",
          icon: "📚",
        },
      ],
    },
    {
      section: "FLIGHT TRAINING",
      items: [
        {
          name: "Basic Flight Controls",
          href: "/basic-flight-controls",
          icon: "✈️",
        },
        { name: "Navigation Systems", href: "/navigation-systems", icon: "🎯" },
        { name: "Ship Systems", href: "/ship-systems", icon: "⚙️" },
      ],
    },
    {
      section: "REFERENCE",
      items: [
        { name: "Ship Database", href: "/ship-database", icon: "📖" },
        { name: "Star Map", href: "/star-map", icon: "🌟" },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-zinc-900 flex flex-col">
      {/* Logo/Brand */}
      <div className="p-4">
        <h1 className="text-lg font-semibold text-red-500">pilots.guide</h1>
        <p className="text-sm text-gray-400">The Pilot's Guide to the 'Verse</p>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-3 py-2 bg-black border border-red-600/30 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((section) => (
            <div key={section.section} className="mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {section.section}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                          isActive
                            ? "text-red-400 bg-red-900/20 font-medium border border-red-600/30"
                            : "text-gray-300 hover:bg-red-900/10 hover:text-red-400"
                        }`}
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}
