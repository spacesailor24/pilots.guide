"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import UserMenu from "./UserMenu";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

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
        ...(session ? [{ name: "Submit Build", href: "/submit-build" }] : []),
      ],
    },
  ];

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 left-4 z-50 p-2 rounded-md bg-zinc-900 border border-red-600/30 text-red-400 lg:hidden"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile menu panel */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-900 z-40 transform transition-transform lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-4 mt-16">
            <h1 className="text-lg font-semibold text-red-500">pilots.guide</h1>
            <p className="text-sm text-gray-400">
              The Pilot's Guide to the 'Verse
            </p>
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
                            onClick={() => setIsOpen(false)}
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

          {/* User Menu at bottom of mobile menu */}
          <div className="p-4 border-t border-zinc-800">
            <UserMenu />
          </div>
        </div>
      </div>
    </>
  );
}
