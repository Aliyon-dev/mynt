import { prisma } from './prisma';

/**
 * Checks if a bank user is authorized to access a student's data.
 * The Chinese Wall policy stipulates that a bank can only view data
 * of students that are actively assigned to that bank.
 *
 * @param bankUserId The ID of the bank user requesting access
 * @param studentId The ID of the student being accessed
 * @param action A brief description of the action (e.g., 'View Profile', 'Issue Loan')
 * @returns boolean true if access is allowed, false if blocked
 */
export async function checkChineseWallAccess(
  bankUserId: string,
  studentId: string,
  action: string
): Promise<boolean> {
  try {
    // 1. Get the bank user's associated bank ID
    const bankUser = await prisma.user.findUnique({
      where: { id: bankUserId },
      include: { bankDetails: true },
    });

    if (!bankUser || bankUser.role !== 'bank' || !bankUser.bankDetails) {
      // Not a valid bank user
      await logAccessAttempt(bankUserId, action, studentId, 'Blocked');
      return false;
    }

    const assignedBankId = bankUser.bankDetails.id;

    // 2. Get the student's assigned bank ID
    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student || student.role !== 'student') {
      // Not a valid student
      await logAccessAttempt(bankUserId, action, studentId, 'Blocked');
      return false;
    }

    // 3. Evaluate Chinese Wall condition
    const isAllowed = student.studentBankId === assignedBankId;

    // 4. Log the access attempt
    await logAccessAttempt(
      bankUserId,
      action,
      studentId,
      isAllowed ? 'Allowed' : 'Blocked'
    );

    return isAllowed;
  } catch (error) {
    console.error('Error checking Chinese Wall access:', error);
    return false;
  }
}

/**
 * Helper strictly for logging access attempts per the requirements
 */
export async function logAccessAttempt(
  userId: string,
  action: string,
  targetId: string,
  status: 'Allowed' | 'Blocked'
) {
  try {
    await prisma.accessLog.create({
      data: {
        action,
        targetId,
        status,
        userId,
      },
    });
  } catch (error) {
    console.error('Failed to log access attempt:', error);
  }
}
