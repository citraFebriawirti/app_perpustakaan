import { PrismaClient, Role, TransactionStatus, BookCondition } from '../generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.transactionDetail.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.bookEntry.deleteMany();
  await prisma.book.deleteMany();
  await prisma.member.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  console.log(`Database cleaned up`);

  // Seed Admin and Staff Users
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin Library',
      email: 'admin@library.com',
      password: passwordHash,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      name: 'Staff Member',
      email: 'staff@library.com',
      password: passwordHash,
      role: Role.STAFF,
      emailVerified: new Date(),
    },
  });

  console.log(`Created users: ${adminUser.email}, ${staffUser.email}`);

  // Create Staff Records
  const adminStaff = await prisma.staff.create({
    data: {
      userId: adminUser.id,
      phone: '081234567890',
    },
  });

  const libraryStaff = await prisma.staff.create({
    data: {
      userId: staffUser.id,
      phone: '089876543210',
    },
  });

  console.log(`Created staff records`);

  // Seed Members
  const [member1, member2] = await Promise.all([
    prisma.member.create({
      data: {
        studentId: 'STD001',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '081122334455',
        address: 'Jl. Perpustakaan No. 1',
      },
    }),
    prisma.member.create({
      data: {
        studentId: 'STD002',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '082233445566',
        address: 'Jl. Buku No. 2',
      },
    }),
  ]);

  console.log(`Created members: ${member1.name}, ${member2.name}`);

  // Seed Books
  const [book1, book2, book3] = await Promise.all([
    prisma.book.create({
      data: {
        isbn: '9780747532743',
        title: 'Harry Potter and the Philosopher\'s Stone',
        author: 'J.K. Rowling',
        publisher: 'Bloomsbury',
        publishYear: 1997,
        category: 'Fiction',
        pageCount: 320,
        stock: 5,
        shelf: 'Fiction-A1',
        description: 'The first book in the Harry Potter series',
      },
    }),
    prisma.book.create({
      data: {
        isbn: '9780132350884',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        publisher: 'Prentice Hall',
        publishYear: 2008,
        category: 'Programming',
        pageCount: 464,
        stock: 3,
        shelf: 'Tech-B2',
        description: 'A handbook of agile software craftsmanship',
      },
    }),
    prisma.book.create({
      data: {
        isbn: '9780451524935',
        title: '1984',
        author: 'George Orwell',
        publisher: 'Signet Classics',
        publishYear: 1949,
        category: 'Classic Literature',
        pageCount: 328,
        stock: 2,
        shelf: 'Classic-C3',
        description: 'A dystopian social science fiction novel',
      },
    }),
  ]);

  console.log(`Created books: ${book1.title}, ${book2.title}, ${book3.title}`);

  // Seed Book Entries
  await Promise.all([
    prisma.bookEntry.create({
      data: {
        bookId: book1.id,
        staffId: adminStaff.id,
        quantity: 5,
        source: 'Purchase',
        notes: 'Initial stock',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      },
    }),
    prisma.bookEntry.create({
      data: {
        bookId: book2.id,
        staffId: libraryStaff.id,
        quantity: 3,
        source: 'Donation',
        notes: 'From tech community',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      },
    }),
    prisma.bookEntry.create({
      data: {
        bookId: book3.id,
        staffId: adminStaff.id,
        quantity: 2,
        source: 'Purchase',
        notes: 'Classics collection',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
    }),
  ]);

  console.log('Created book entries');

  // Seed Transactions
  const transaction1 = await prisma.transaction.create({
    data: {
      memberId: member1.id,
      staffId: libraryStaff.id,
      borrowDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      status: TransactionStatus.BORROWED,
      notes: 'First borrowing',
    },
  });

  const transaction2 = await prisma.transaction.create({
    data: {
      memberId: member2.id,
      staffId: adminStaff.id,
      borrowDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      returnDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      status: TransactionStatus.RETURNED,
      notes: 'Returned on time',
    },
  });

  const transaction3 = await prisma.transaction.create({
    data: {
      memberId: member2.id,
      staffId: libraryStaff.id,
      borrowDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), // 40 days ago
      returnDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
      dueDate: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000), // 26 days ago
      status: TransactionStatus.RETURNED,
      fine: 5000, // Late return fine
      notes: 'Returned late, fine paid',
    },
  });

  console.log('Created transactions');

  // Seed Transaction Details
  await Promise.all([
    prisma.transactionDetail.create({
      data: {
        transactionId: transaction1.id,
        bookId: book1.id,
        bookCondition: BookCondition.GOOD,
      },
    }),
    prisma.transactionDetail.create({
      data: {
        transactionId: transaction1.id,
        bookId: book2.id,
        bookCondition: BookCondition.GOOD,
      },
    }),
    prisma.transactionDetail.create({
      data: {
        transactionId: transaction2.id,
        bookId: book3.id,
        bookCondition: BookCondition.GOOD,
      },
    }),
    prisma.transactionDetail.create({
      data: {
        transactionId: transaction3.id,
        bookId: book1.id,
        bookCondition: BookCondition.DAMAGED,
      },
    }),
  ]);

  console.log('Created transaction details');
  console.log('✅ Seed data successfully inserted');
}

main()
  .catch((e) => {
    console.error('Error seeding the database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });