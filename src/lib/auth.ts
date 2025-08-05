/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth/next";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions = {
  adapter: {
    ...PrismaAdapter(prisma),
    createUser: (user: any) => {
      console.log("🔍 Creating user with adapter:", user);
      return prisma.user.create({
        data: {
          username: user.name,
          image: user.image,
          claimed: false,
        },
      });
    },
  },
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      console.log("🔍 SignIn callback triggered", { user: user.name, provider: account?.provider });
      
      // Remove email to maintain privacy (we only want Discord username)
      if (account?.provider === "discord") {
        user.email = null;
      }
      
      // Store the username and displayName for later use (PrismaAdapter will create the user after this callback)
      if (account?.provider === "discord" && user.name) {
        user.username = user.name;
        user.displayName = user.name; // Set displayName to match seeded accounts
      }
      
      console.log("✅ SignIn callback completed successfully");
      return true;
    },
    session: async ({ session, token }: { session: any; token: any }) => {
      console.log("🔍 Session callback triggered", { userId: token?.sub, userName: session?.user?.name });
      
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
        // Ensure email is not included in session for privacy
        session.user.email = null;
        
        // Fetch user permissions from database and handle account claiming
        try {
          const userWithPermissions = await prisma.user.findUnique({
            where: { id: token.sub },
            include: {
              permissions: {
                include: {
                  permission: true
                }
              }
            }
          });
          
          if (userWithPermissions) {
            // Check if this user needs to claim an account (unclaimed and no permissions)
            if (!userWithPermissions.claimed && userWithPermissions.permissions.length === 0 && userWithPermissions.username) {
              console.log("🔍 Checking for unclaimed account to claim for:", userWithPermissions.username);
              
              // Look for unclaimed user account with matching displayName
              const unclaimedUser = await prisma.user.findFirst({
                where: {
                  displayName: userWithPermissions.username,
                  claimed: false,
                  username: null, // These are seeded players
                  id: { not: userWithPermissions.id }, // Don't match self
                },
                include: {
                  permissions: {
                    include: {
                      permission: true
                    }
                  }
                }
              });

              if (unclaimedUser) {
                console.log("✅ Found matching unclaimed account, transferring data");
                
                // Transfer the unclaimed user's data to the Discord user
                await prisma.$transaction(async (tx) => {
                  // Update the Discord user with the player's displayName and claimed status
                  await tx.user.update({
                    where: { id: userWithPermissions.id },
                    data: {
                      displayName: unclaimedUser.displayName,
                      claimed: true,
                    },
                  });

                  // Transfer permissions
                  for (const userPermission of unclaimedUser.permissions) {
                    await tx.userPermission.create({
                      data: {
                        userId: userWithPermissions.id,
                        permissionId: userPermission.permissionId,
                        grantedBy: userPermission.grantedBy,
                      },
                    });
                  }

                  // Transfer builds that were created under the player's displayName
                  await tx.build.updateMany({
                    where: {
                      creator: unclaimedUser.displayName,
                      userId: null,
                    },
                    data: {
                      userId: userWithPermissions.id,
                    },
                  });

                  // Transfer any tournament participations
                  await tx.tournamentPlayer.updateMany({
                    where: {
                      userId: unclaimedUser.id,
                    },
                    data: {
                      userId: userWithPermissions.id,
                    },
                  });

                  // Delete the old unclaimed user account
                  await tx.user.delete({
                    where: { id: unclaimedUser.id },
                  });
                });
                
                console.log(`✅ Successfully claimed account for ${userWithPermissions.username} with ${unclaimedUser.permissions.length} permissions`);
                
                // Refetch user with updated permissions
                const updatedUser = await prisma.user.findUnique({
                  where: { id: token.sub },
                  include: {
                    permissions: {
                      include: {
                        permission: true
                      }
                    }
                  }
                });
                
                if (updatedUser) {
                  session.user.permissions = updatedUser.permissions.map(
                    (up) => up.permission.name
                  );
                  session.user.isAdmin = updatedUser.permissions.some(
                    (up) => up.permission.name === "ADMIN"
                  );
                  session.user.displayName = updatedUser.displayName;
                }
              } else {
                // No unclaimed account found, set default permissions
                session.user.permissions = [];
                session.user.isAdmin = false;
                session.user.displayName = userWithPermissions.displayName;
              }
            } else {
              // User already has permissions or is already claimed
              session.user.permissions = userWithPermissions.permissions.map(
                (up) => up.permission.name
              );
              session.user.isAdmin = userWithPermissions.permissions.some(
                (up) => up.permission.name === "ADMIN"
              );
              session.user.displayName = userWithPermissions.displayName;
            }
            
            console.log("✅ User permissions loaded:", session.user.permissions, "isAdmin:", session.user.isAdmin);
          } else {
            session.user.permissions = [];
            session.user.isAdmin = false;
            console.log("⚠️ No user found in database for session");
          }
        } catch (error) {
          console.error("❌ Failed to fetch user permissions:", error);
          session.user.permissions = [];
          session.user.isAdmin = false;
        }
      }
      console.log("✅ Session callback completed");
      return session;
    },
    jwt: async ({ user, token }: { user: any; token: any }) => {
      console.log("🔍 JWT callback triggered", { hasUser: !!user, tokenSub: token?.sub });
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};

export async function getSession() {
  return await getServerSession(authOptions);
}