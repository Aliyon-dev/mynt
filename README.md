# Mynt Financial

Mynt Financial is a role-based banking and student loan management platform built with Next.js. It features a robust permission system and administrative tools to manage banking entities, students, and financial transactions. A key focus is on compliance and data partition through a "Chinese Wall" access control mechanism.

## Features

### Role-Based Access Control

The application supports three distinct user roles, each with its own dashboard and permissions:

1. **Administrator (`admin`)**
   - **Bank Management:** Create and manage banking entities.
   - **Student Management:** Register students and assign them to specific banks.
   - **Audit Logs:** View system-wide access logs, tracking actions and access control events.
   - **Overview:** Monitor total students, active loans, and transaction volumes across the entire platform.

2. **Bank / Financial Institution (`bank`)**
   - **Student Oversight:** View students specifically assigned to the bank.
   - **Loan Processing:** Issue loans and track their statuses (Pending, Approved, Rejected, Disbursed).
   - **Transaction Handling:** Process financial transactions such as loan disbursements and allowance payments.
   - **Compliance Testing:** Tools to verify the "Chinese Wall" to ensure banks cannot access data of students outside their purview.

3. **Student (`student`)**
   - **Financial Dashboard:** Track assigned bank and overall loan status.
   - **Loan History:** View details of all active and past loans.
   - **Transaction Records:** Monitor incoming transfers and allowance payouts.

### Security & Compliance ("Chinese Wall")

The platform implements a strict data boundary protocol referred to as the "Chinese Wall". Bank accounts are strictly partitioned; a bank administrator can only view profiles, process loans, and handle transactions for students explicitly assigned to their institution.

## Tech Stack

- **Framework:** Next.js (React 19)
- **Styling:** Tailwind CSS
- **Database ORM:** Prisma
- **Database:** SQLite (for local development)

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd mynt
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Initialize the database:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`.

## Demo Credentials

To explore the different roles, you can use the following default demo credentials on the login page:

| Role    | Username       | Password           |
| ------- | -------------- | ------------------ |
| Admin   | `uni_admin`    | `admin`            |
| Bank    | `zanaco_admin` | `password`         |
| Student | `Alice`        | `student_password` |

_(Note: Ensure you have populated the database with seed data if logging in for the first time on a fresh database. Depending on your configuration, running `npm run dev` might execute a seed script, or you might need to run `npx prisma db seed`)._

## Project Structure

- `src/app/`: Next.js App Router containing the main views for `/admin`, `/bank`, and `/student`.
- `src/actions/`: Server actions containing the core business logic, database queries, and role verification.
- `src/lib/`: Library utilities including the `prisma` client, session management (`session.ts`), and compliance checks (`chineseWall.ts`).
- `prisma/`: Prisma schema and database configuration.
