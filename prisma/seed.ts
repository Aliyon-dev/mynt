import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('Seeding database...')
  
  // Clear existing
  await prisma.accessLog.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.user.deleteMany()
  await prisma.bank.deleteMany()

  // 1. Create Banks
  const zanaco = await prisma.bank.create({
    data: { name: 'Zanaco' },
  })
  const fnb = await prisma.bank.create({
    data: { name: 'FNB' },
  })

  // 2. Create Bank Users
  await prisma.user.create({
    data: {
      username: 'zanaco_admin',
      password: 'password',
      role: 'bank',
      bankDetails: {
        connect: { id: zanaco.id }
      }
    }
  })
  
  await prisma.user.create({
    data: {
      username: 'fnb_admin',
      password: 'password',
      role: 'bank',
      bankDetails: {
        connect: { id: fnb.id }
      }
    }
  })

  // 3. Create University Admin
  await prisma.user.create({
    data: {
      username: 'uni_admin',
      password: 'admin',
      role: 'admin',
    }
  })

  // 4. Create Students strictly partitioned
  const alice = await prisma.user.create({
    data: {
      username: 'Alice',
      password: 'student_password',
      role: 'student',
      studentBankId: zanaco.id
    }
  })

  const bob = await prisma.user.create({
    data: {
      username: 'Bob',
      password: 'student_password',
      role: 'student',
      studentBankId: fnb.id
    }
  })

  // 5. Preload some sample transactions
  await prisma.transaction.create({
    data: {
      type: 'loan',
      amount: 1000.0,
      studentId: alice.id,
      bankId: zanaco.id
    }
  })

  await prisma.transaction.create({
    data: {
      type: 'allowance',
      amount: 500.0,
      studentId: bob.id,
      bankId: fnb.id
    }
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
