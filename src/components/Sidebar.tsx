"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import UserMenu from "./UserMenu";
import { useShips } from "@/contexts/ShipsContext";
import { useTournaments } from "@/contexts/TournamentsContext";
import LinkWithTransition from "./LinkWithTransition";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { shipsWithBuilds } = useShips();
  const { activeTournaments } = useTournaments();

  // Active tournaments subsection state - persisted across navigation
  const [isActiveTournamentsOpen, setIsActiveTournamentsOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeTournamentsOpen") === "true";
    }
    return false;
  });

  // Persist toggle state to localStorage
  const toggleActiveTournaments = () => {
    const newState = !isActiveTournamentsOpen;
    setIsActiveTournamentsOpen(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem("activeTournamentsOpen", newState.toString());
    }
  };

  const isAdmin = (session?.user as { isAdmin?: boolean })?.isAdmin || false;

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
    // Tournaments section - visible to everyone
    {
      section: "TOURNAMENTS",
      items: [
        { name: "Overview", href: "/tournaments" },
        ...(isAdmin ? [{ name: "Create Tournament", href: "/tournaments/create" }] : []),
        { name: "Player Rankings", href: "/rankings" },
        { name: "Completed Tournaments", href: "/tournaments/completed" },
      ],
    },
    // Admin section - only show to admins
    ...(isAdmin
      ? [
          {
            section: "ADMIN",
            items: [{ name: "Manage Players", href: "/admin/players" }],
          },
        ]
      : []),
  ];

  return (
    <aside className="hidden lg:flex w-64 bg-zinc-900 flex-col">
      {/* Logo/Brand */}
      <div className="p-4">
        <LinkWithTransition href="/welcome" className="block">
          <div className="flex items-center space-x-3">
            <Image
              src="/images/logo.png"
              alt="Spacebook Logo"
              width={48}
              height={48}
              className="w-11 h-11"
            />
            <div>
              <h1 className="text-lg font-semibold text-red-500">
                pilots.guide
              </h1>
              <p className="text-sm text-gray-400">
                The Pilot's Guide to the 'Verse
              </p>
            </div>
          </div>
        </LinkWithTransition>
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
                {/* Render Overview and Create Tournament first for Tournaments section */}
                {section.section === "TOURNAMENTS" && (
                  <>
                    {/* Overview */}
                    {section.items
                      .filter((item) => item.name === "Overview")
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

                    {/* Create Tournament */}
                    {section.items
                      .filter((item) => item.name === "Create Tournament")
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

                {/* Active Tournaments Subsection for Tournaments */}
                {section.section === "TOURNAMENTS" &&
                  activeTournaments.length > 0 && (
                    <li>
                      <button
                        onClick={toggleActiveTournaments}
                        className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide hover:text-gray-300 transition-colors"
                      >
                        <span>Active Tournaments</span>
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            isActiveTournamentsOpen ? "rotate-90" : ""
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

                      {isActiveTournamentsOpen && (
                        <ul className="space-y-1 ml-4">
                          {activeTournaments.map((tournament) => {
                            const tournamentPath = `/tournaments/${tournament.id}`;
                            const isTournamentActive =
                              pathname === tournamentPath;
                            return (
                              <li key={tournament.id}>
                                <LinkWithTransition
                                  href={tournamentPath}
                                  className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                                    isTournamentActive
                                      ? "text-red-400 bg-red-900/20 font-medium border border-red-600/30"
                                      : "text-gray-300 hover:bg-red-900/10 hover:text-red-400"
                                  }`}
                                >
                                  <span
                                    className="truncate"
                                    title={tournament.name}
                                  >
                                    {tournament.name}
                                  </span>
                                </LinkWithTransition>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  )}

                {/* Render remaining items (or all items for non-Tournaments sections) */}
                {section.section === "TOURNAMENTS"
                  ? section.items
                      .filter(
                        (item) =>
                          item.name !== "Overview" &&
                          item.name !== "Create Tournament"
                      )
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
                    })}
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
