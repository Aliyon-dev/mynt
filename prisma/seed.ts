import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('Seeding database...')

  await prisma.accessLog.deleteMany()
  await prisma.loan.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.user.deleteMany()
  await prisma.bank.deleteMany()

  const zanaco = await prisma.bank.create({ data: { name: 'Zanaco' } })
  const fnb = await prisma.bank.create({ data: { name: 'FNB' } })

  await prisma.user.create({
    data: {
      username: 'zanaco_admin',
      password: 'password',
      role: 'bank',
      bankDetails: {
        connect: { id: zanaco.id },
      },
    },
  })

  await prisma.user.create({
    data: {
      username: 'fnb_admin',
      password: 'password',
      role: 'bank',
      bankDetails: {
        connect: { id: fnb.id },
      },
    },
  })

  await prisma.user.create({
    data: {
      username: 'uni_admin',
      password: 'admin',
      role: 'admin',
    },
  })

  const alice = await prisma.user.create({
    data: {
      username: 'Alice',
      password: 'student_password',
      role: 'student',
      studentBankId: zanaco.id,
    },
  })

  const bob = await prisma.user.create({
    data: {
      username: 'Bob',
      password: 'student_password',
      role: 'student',
      studentBankId: fnb.id,
    },
  })

  await prisma.transaction.create({
    data: {
      type: 'loan',
      amount: 1000.0,
      studentId: alice.id,
      bankId: zanaco.id,
    },
  })

  await prisma.transaction.create({
    data: {
      type: 'allowance',
      amount: 500.0,
      studentId: bob.id,
      bankId: fnb.id,
    },
  })

  await prisma.loan.create({
    data: {
      studentId: alice.id,
      bankId: zanaco.id,
      amount: 1200,
      status: 'Approved',
      description: 'Tuition and books',
    },
  })

  await prisma.loan.create({
    data: {
      studentId: bob.id,
      bankId: fnb.id,
      amount: 700,
      status: 'Pending',
      description: 'Semester support',
    },
  })

  console.log('Seeding complete. Demo data ready.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
