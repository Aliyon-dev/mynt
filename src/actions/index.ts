'use server';

import { prisma } from '../lib/prisma';
import { checkChineseWallAccess } from '../lib/chineseWall';
import { setSession, getCurrentUser, clearSession } from '../lib/session';

export async function login(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user || user.password !== password) {
    return { error: 'Invalid credentials' };
  }

  await setSession(user.id);

  if (user.role === 'admin') return { redirect: '/admin/dashboard' };
  if (user.role === 'bank') return { redirect: '/bank/dashboard' };
  if (user.role === 'student') return { redirect: '/student/dashboard' };

  return { error: 'Unknown role' };
}

export async function logout() {
  await clearSession();
  return { redirect: '/' };
}

export async function getBankDashboardData() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'bank' || !currentUser.bankDetails) {
    throw new Error('Unauthorized');
  }

  const bankId = currentUser.bankDetails.id;

  const students = await prisma.user.findMany({
    where: {
      role: 'student',
      studentBankId: bankId,
    },
    orderBy: { username: 'asc' },
    include: {
      loans: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  const recentTransactions = await prisma.transaction.findMany({
    where: { bankId },
    include: { student: true },
    orderBy: { date: 'desc' },
    take: 10,
  });

  const recentLoans = await prisma.loan.findMany({
    where: { bankId },
    include: { student: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return { bank: currentUser.bankDetails, students, recentTransactions, recentLoans };
}

export async function processTransaction({
  studentId,
  amount,
  type,
}: {
  studentId: string;
  amount: number;
  type: 'loan' | 'allowance';
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'bank' || !currentUser.bankDetails) {
    return { error: 'Unauthorized' };
  }

  const isAllowed = await checkChineseWallAccess(currentUser.id, studentId, `Process ${type}`);

  if (!isAllowed) {
    return { error: 'BLOCKED BY CHINESE WALL: You are not authorized to access this student\'s records.' };
  }

  const transaction = await prisma.transaction.create({
    data: {
      type,
      amount,
      studentId,
      bankId: currentUser.bankDetails.id,
    },
  });

  return { success: true, transaction };
}

export async function addLoan({
  studentId,
  amount,
  description,
  status,
}: {
  studentId: string;
  amount: number;
  description?: string;
  status?: 'Pending' | 'Approved' | 'Rejected' | 'Disbursed';
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'bank' || !currentUser.bankDetails) {
    return { error: 'Unauthorized' };
  }

  const isAllowed = await checkChineseWallAccess(currentUser.id, studentId, 'Create Loan');
  if (!isAllowed) {
    return { error: 'BLOCKED BY CHINESE WALL: You cannot add loans for students outside your bank partition.' };
  }

  const loan = await prisma.loan.create({
    data: {
      studentId,
      bankId: currentUser.bankDetails.id,
      amount,
      description: description?.trim() || null,
      status: status || 'Pending',
    },
  });

  return { success: true, loan };
}

export async function testChineseWallAccess(targetStudentId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'bank') {
    return { error: 'Unauthorized test' };
  }

  const isAllowed = await checkChineseWallAccess(currentUser.id, targetStudentId, 'View Profile Data');
  if (!isAllowed) {
    return { error: 'BLOCKED BY CHINESE WALL: Access denied to student data.' };
  }

  const student = await prisma.user.findUnique({ where: { id: targetStudentId } });
  return { success: true, data: student?.username };
}

export async function getAdminDashboardData() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const [logs, students, transactions, banks, loans] = await Promise.all([
    prisma.accessLog.findMany({
      include: { user: true },
      orderBy: { timestamp: 'desc' },
    }),
    prisma.user.findMany({
      where: { role: 'student' },
      include: { bankIdRelation: true },
      orderBy: { username: 'asc' },
    }),
    prisma.transaction.findMany({
      include: { student: true, bank: true },
      orderBy: { date: 'desc' },
    }),
    prisma.bank.findMany({ orderBy: { name: 'asc' } }),
    prisma.loan.findMany({
      include: { student: true, bank: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return { logs, students, transactions, banks, loans };
}

export async function addBank(formData: FormData) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    return { error: 'Unauthorized' };
  }

  const bankName = formData.get('bankName') as string;
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!bankName || !username || !password) return { error: 'Missing fields' };

  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) return { error: 'Username already exists' };

    const existingBank = await prisma.bank.findUnique({ where: { name: bankName } });
    if (existingBank) return { error: 'Bank name already exists' };

    const newUser = await prisma.user.create({
      data: {
        username,
        password,
        role: 'bank',
      },
    });

    await prisma.bank.create({
      data: {
        name: bankName,
        userId: newUser.id,
      },
    });

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create bank';
    return { error: message };
  }
}

export async function addStudent(formData: FormData) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    return { error: 'Unauthorized' };
  }

  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const bankId = formData.get('bankId') as string;

  if (!username || !password) return { error: 'Missing fields' };

  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) return { error: 'Username already exists' };

    await prisma.user.create({
      data: {
        username,
        password,
        role: 'student',
        studentBankId: bankId || null,
      },
    });

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create student';
    return { error: message };
  }
}

export async function assignStudentBank(formData: FormData) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    return { error: 'Unauthorized' };
  }

  const studentId = formData.get('studentId') as string;
  const bankId = formData.get('bankId') as string;

  if (!studentId || !bankId) {
    return { error: 'Student and bank are required' };
  }

  const student = await prisma.user.findFirst({
    where: { id: studentId, role: 'student' },
  });

  if (!student) {
    return { error: 'Student not found' };
  }

  await prisma.user.update({
    where: { id: studentId },
    data: { studentBankId: bankId },
  });

  return { success: true };
}
