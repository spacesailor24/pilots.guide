import { getSession } from "./auth";
import { prisma } from "./prisma";

export async function isAdmin(): Promise<boolean> {
  try {
    const session = await getSession();
    
    if (!session?.user?.id) {
      return false;
    }

    const userWithPermissions = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });

    return userWithPermissions?.permissions.some(
      (up) => up.permission.name === "ADMIN"
    ) || false;
  } catch (error) {
    console.error("Failed to check admin permissions:", error);
    return false;
  }
}

export async function requireAdmin(): Promise<void> {
  const adminStatus = await isAdmin();
  
  if (!adminStatus) {
    throw new Error("Admin access required");
  }
}