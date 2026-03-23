import { cookies } from 'next/headers';
import { prisma } from './prisma';

// A simple session management for demonstration purposes.
// Do not use this in production.
export async function setSession(userId: string) {
  (await cookies()).set('session', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });
}

export async function getSessionUserId() {
  const sessionUser = (await cookies()).get('session')?.value;
  return sessionUser || null;
}

export async function clearSession() {
  (await cookies()).delete('session');
}

export async function getCurrentUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      bankDetails: true,
    },
  });
  return user;
}
