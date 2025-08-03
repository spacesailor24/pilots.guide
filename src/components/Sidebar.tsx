"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    {
      section: "FLIGHT SCHOOL",
      items: [
        {
          name: "The Binary Circle",
          href: "/flight-school/the-binary-circle",
        },
        {
          name: "PIP Neutralization",
          href: "/flight-school/pip-neutralization",
        },
        {
          name: "PIP Deflection",
          href: "/flight-school/pip-deflection",
        },
      ],
    },
    {
      section: "SHIP BUILDS",
      items: [
        { name: "Overview", href: "/ship-builds" },
        { name: "Gladius", href: "/ship-builds/gladius" },
      ],
    },
  ];

  return (
    <aside className="hidden lg:flex w-64 bg-zinc-900 flex-col">
      {/* Logo/Brand */}
      <div className="p-4">
        <h1 className="text-lg font-semibold text-red-500">
          <Link href="/welcome">pilots.guide</Link>
        </h1>
        <p className="text-sm text-gray-400">The Pilot's Guide to the 'Verse</p>
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
