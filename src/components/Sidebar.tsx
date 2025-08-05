"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import UserMenu from "./UserMenu";
import { useShips } from "@/contexts/ShipsContext";
import { useMatches } from "@/contexts/MatchesContext";
import LinkWithTransition from "./LinkWithTransition";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { shipsWithBuilds } = useShips();
  const { activeMatches } = useMatches();
  const [isActiveMatchesOpen, setIsActiveMatchesOpen] = useState(false);
  
  const isAdmin = (session?.user as any)?.isAdmin || false;

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
        { name: "Submit Build", href: "/submit-build" },
        ...shipsWithBuilds.map((ship) => ({
          name: ship.name,
          href: `/ship-builds/${ship.shipId}`,
        })),
      ],
    },
    // Only show Match Making and Admin sections to admins
    ...(isAdmin ? [
      {
        section: "MATCH MAKING",
        items: [
          { name: "Create Match", href: "/matchmaking/create-match" },
          { name: "Completed Matches", href: "/matchmaking/completed" },
        ],
      },
      {
        section: "ADMIN",
        items: [
          { name: "Manage Players", href: "/admin/players" },
        ],
      },
    ] : []),
  ];

  return (
    <aside className="hidden lg:flex w-64 bg-zinc-900 flex-col">
      {/* Logo/Brand */}
      <div className="p-4">
        <h1 className="text-lg font-semibold text-red-500">
          <LinkWithTransition href="/welcome">pilots.guide</LinkWithTransition>
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
                {/* Render Create Match first for Match Making section */}
                {section.section === "MATCH MAKING" && (
                  <>
                    {section.items
                      .filter(item => item.name === "Create Match")
                      .map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <li key={item.href}>
                            <LinkWithTransition
                              href={item.href}
                              className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                                isActive
                                  ? "text-red-400 bg-red-900/20 font-medium border border-red-600/30"
                                  : "text-gray-300 hover:bg-red-900/10 hover:text-red-400"
                              }`}
                            >
                              {item.name}
                            </LinkWithTransition>
                          </li>
                        );
                      })}
                  </>
                )}

                {/* Active Matches Subsection for Match Making */}
                {section.section === "MATCH MAKING" && isAdmin && activeMatches.length > 0 && (
                  <li>
                    <button
                      onClick={() => setIsActiveMatchesOpen(!isActiveMatchesOpen)}
                      className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide hover:text-gray-300 transition-colors"
                    >
                      <span>Active Matches</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          isActiveMatchesOpen ? "rotate-90" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                    
                    {isActiveMatchesOpen && (
                      <ul className="space-y-1 ml-4">
                        {activeMatches.map((match) => {
                          const matchPath = `/matchmaking/match/${match.id}`;
                          const isMatchActive = pathname === matchPath;
                          return (
                            <li key={match.id}>
                              <LinkWithTransition
                                href={matchPath}
                                className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                                  isMatchActive
                                    ? "text-red-400 bg-red-900/20 font-medium border border-red-600/30"
                                    : "text-gray-300 hover:bg-red-900/10 hover:text-red-400"
                                }`}
                              >
                                <span className="truncate" title={match.name}>
                                  {match.name}
                                </span>
                              </LinkWithTransition>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                )}

                {/* Render remaining items (or all items for non-Match Making sections) */}
                {section.section === "MATCH MAKING" 
                  ? section.items
                      .filter(item => item.name !== "Create Match")
                      .map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <li key={item.href}>
                            <LinkWithTransition
                              href={item.href}
                              className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                                isActive
                                  ? "text-red-400 bg-red-900/20 font-medium border border-red-600/30"
                                  : "text-gray-300 hover:bg-red-900/10 hover:text-red-400"
                              }`}
                            >
                              {item.name}
                            </LinkWithTransition>
                          </li>
                        );
                      })
                  : section.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <li key={item.href}>
                          <LinkWithTransition
                            href={item.href}
                            className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                              isActive
                                ? "text-red-400 bg-red-900/20 font-medium border border-red-600/30"
                                : "text-gray-300 hover:bg-red-900/10 hover:text-red-400"
                            }`}
                          >
                            {item.name}
                          </LinkWithTransition>
                        </li>
                      );
                    })
                }
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* User Menu at bottom of sidebar */}
      <div className="p-4 border-t border-zinc-800">
        <UserMenu />
      </div>
    </aside>
  );
}
