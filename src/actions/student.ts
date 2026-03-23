'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export async function getStudentDashboardData() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'student') {
    throw new Error('Unauthorized');
  }

  const studentWithBank = await prisma.user.findUnique({
    where: { id: currentUser.id },
    include: {
      bankIdRelation: true,
      transactions: {
        include: { bank: true },
        orderBy: { date: 'desc' },
      }
    }
  });

  return studentWithBank;
}
