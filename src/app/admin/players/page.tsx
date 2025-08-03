"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";

interface UnclaimedAccount {
  id: string;
  displayName: string | null;
  claimed: boolean;
}

interface DiscordUser {
  id: string;
  username: string | null;
  displayName: string | null;
  claimed: boolean;
  image: string | null;
}

interface AdminData {
  unclaimedAccounts: UnclaimedAccount[];
  discordUsers: DiscordUser[];
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [linkingAccounts, setLinkingAccounts] = useState<Set<string>>(new Set());

  // Redirect if not admin
  useEffect(() => {
    if (status !== "loading" && (!session?.user?.isAdmin)) {
      router.push("/");
    }
  }, [session, status, router]);

  // Fetch admin data
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.isAdmin) return;

      try {
        const response = await fetch("/api/admin/accounts");
        if (!response.ok) {
          throw new Error("Failed to fetch admin data");
        }
        const adminData = await response.json();
        setData(adminData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.user?.isAdmin]);

  const handleLinkAccount = async (discordUserId: string, playerAccountId: string) => {
    const linkKey = `${discordUserId}-${playerAccountId}`;
    setLinkingAccounts(prev => new Set([...prev, linkKey]));

    try {
      const response = await fetch("/api/admin/link-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          discordUserId,
          playerAccountId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to link accounts");
      }

      const result = await response.json();
      alert(result.message);

      // Refresh data
      const refreshResponse = await fetch("/api/admin/accounts");
      if (refreshResponse.ok) {
        const refreshedData = await refreshResponse.json();
        setData(refreshedData);
      }
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : "Failed to link accounts"}`);
    } finally {
      setLinkingAccounts(prev => {
        const newSet = new Set(prev);
        newSet.delete(linkKey);
        return newSet;
      });
    }
  };

  if (status === "loading" || loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading admin data...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!session?.user?.isAdmin) {
    return null; // Router will redirect
  }

  if (error) {
    return (
      <AppLayout>
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-red-400 mb-2">Error</h1>
          <p className="text-gray-300">{error}</p>
        </div>
      </AppLayout>
    );
  }

  if (!data) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-gray-400">No data available</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
          <h1 className="text-4xl font-semibold text-white mb-3">
            Admin Panel
          </h1>
          <p className="text-gray-300">
            Manage user accounts and link Discord profiles to player accounts.
          </p>
        </div>

        {/* Unclaimed Player Accounts */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Unclaimed Player Accounts ({data.unclaimedAccounts.length})
          </h2>
          <p className="text-gray-400 mb-6">
            These are player profiles that have not been linked to Discord accounts yet.
          </p>
          
          {data.unclaimedAccounts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No unclaimed accounts found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.unclaimedAccounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-zinc-800 rounded-lg p-4 border border-gray-600"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {account.displayName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">
                        {account.displayName}
                      </h3>
                    </div>
                  </div>
                  <div className="text-xs text-orange-400 bg-orange-900/20 px-2 py-1 rounded">
                    Unclaimed
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Discord Users */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Discord Users ({data.discordUsers.length})
          </h2>
          <p className="text-gray-400 mb-6">
            These are users who have signed in with Discord. Link them to player profiles.
          </p>
          
          {data.discordUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No Discord users found
            </div>
          ) : (
            <div className="space-y-4">
              {data.discordUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-zinc-800 rounded-lg p-4 border border-gray-600"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.username || "User"}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {user.username?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-white">
                          {user.username}
                        </h3>
                        {user.displayName && (
                          <p className="text-sm text-gray-400">
                            Display: {user.displayName}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {user.claimed ? (
                        <div className="text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded">
                          Claimed
                        </div>
                      ) : (
                        <>
                          <div className="text-xs text-orange-400 bg-orange-900/20 px-2 py-1 rounded">
                            Unclaimed
                          </div>
                          {data.unclaimedAccounts.length > 0 && (
                            <select
                              className="bg-zinc-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleLinkAccount(user.id, e.target.value);
                                  e.target.value = ""; // Reset select
                                }
                              }}
                              disabled={linkingAccounts.size > 0}
                            >
                              <option value="">Link to player...</option>
                              {data.unclaimedAccounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                  {account.displayName}
                                </option>
                              ))}
                            </select>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {linkingAccounts.size > 0 && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
            Linking accounts...
          </div>
        )}
      </div>
    </AppLayout>
  );
}