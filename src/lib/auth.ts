/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth/next";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions = {
  adapter: {
    ...PrismaAdapter(prisma),
    createUser: async (user: any) => {
      console.log("🔍 Creating user with adapter:", user);
      
      // If user already has an ID, it means we handled the merge in signIn callback
      if (user.id) {
        console.log("✅ User already exists with ID:", user.id, "- returning existing user");
        const existingUser = await prisma.user.findUnique({ where: { id: user.id } });
        if (existingUser) {
          return {
            id: existingUser.id,
            email: null,
            emailVerified: null,
            name: existingUser.username,
            image: existingUser.image,
          };
        }
      }
      
      // Otherwise, create new user normally
      const newUser = await prisma.user.create({
        data: {
          username: user.name,
          email: user.email || null,
          emailVerified: user.emailVerified || null,
          image: user.image,
          claimed: false,
        },
      });
      
      return {
        id: newUser.id,
        email: newUser.email,
        emailVerified: newUser.emailVerified,
        name: newUser.username,
        image: newUser.image,
      };
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
      
      // Handle Discord sign-in by checking for existing unclaimed account
      if (account?.provider === "discord" && user.name) {
        try {
          // Look for existing unclaimed user with matching displayName
          const existingUser = await prisma.user.findFirst({
            where: {
              displayName: user.name,
              claimed: false,
              username: null, // Seeded accounts have null username
            }
          });

          if (existingUser) {
            console.log("🔍 Found existing unclaimed account, updating with Discord info");
            
            // Update the existing user with Discord information
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                username: user.name,
                image: user.image,
                claimed: true
              }
            });

            // Create the account record manually to link Discord to existing user
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                token_type: account.token_type,
                scope: account.scope,
              }
            });

            // Update the user object to use the existing user's ID so PrismaAdapter won't create new user
            user.id = existingUser.id;
            user.email = null; // Ensure no email is stored
            
            console.log("✅ Merged Discord account with existing user and created account link");
          } else {
            // No existing account found, proceed with normal flow
            user.email = null; // Remove email for privacy
            user.username = user.name;
            user.displayName = user.name;
            console.log("🔍 No matching unclaimed account found, creating new user");
          }
        } catch (error) {
          console.error("❌ Error during sign-in account check:", error);
          // Fall back to normal flow if there's an error
          user.email = null;
          user.username = user.name;
          user.displayName = user.name;
        }
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
        
        // Fetch user permissions from database
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
            // Load user permissions and info
            session.user.permissions = userWithPermissions.permissions.map(
              (up) => up.permission.name
            );
            session.user.isAdmin = userWithPermissions.permissions.some(
              (up) => up.permission.name === "ADMIN"
            );
            session.user.displayName = userWithPermissions.displayName;
            
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