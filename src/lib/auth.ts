/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth/next";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
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
      // Remove email to maintain privacy (we only want Discord username)
      if (account?.provider === "discord") {
        user.email = null;
      }
      
      // Auto-claim builds when user signs in for the first time
      if (account?.provider === "discord" && user.name) {
        try {
          // Find builds with matching creator name but no userId
          const unclaimedBuilds = await prisma.build.findMany({
            where: {
              creator: user.name,
              userId: null,
            },
          });

          // Claim the builds for this user
          if (unclaimedBuilds.length > 0) {
            await prisma.build.updateMany({
              where: {
                creator: user.name,
                userId: null,
              },
              data: {
                userId: user.id,
              },
            });
            console.log(`✅ Auto-claimed ${unclaimedBuilds.length} builds for ${user.name}`);
          }
        } catch (error) {
          console.error("Failed to auto-claim builds:", error);
        }
      }
      return true;
    },
    session: async ({ session, token }: { session: any; token: any }) => {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
        // Ensure email is not included in session for privacy
        session.user.email = null;
      }
      return session;
    },
    jwt: async ({ user, token }: { user: any; token: any }) => {
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