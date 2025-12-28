import prisma from '../src/config/prisma.js';
import { hashPassword } from '../src/utils/password.js';

async function seed() {
  console.log('🌱 Starting database seed...');

  // Create a super admin user
  const adminPassword = await hashPassword('EducaCenter2025');
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@educacenter.com' },
    update: {},
    create: {
      email: 'admin@educacenter.com',
      passwordHash: adminPassword,
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✅ Super admin created:', superAdmin.email);

  // Create a sample company
  const company = await prisma.company.upsert({
    where: { cif: 'B12345678' },
    update: {},
    create: {
      name: 'Empresa Demo',
      cif: 'B12345678',
      plan: 'BASIC',
    },
  });
  console.log('✅ Sample company created:', company.name);

  // Create company admin
  const adminCompanyPassword = await hashPassword('admin123');
  const companyAdmin = await prisma.user.upsert({
    where: { email: 'admin@empresademo.com' },
    update: {},
    create: {
      email: 'admin@empresademo.com',
      passwordHash: adminCompanyPassword,
      role: 'COMPANY_ADMIN',
    },
  });
  console.log('✅ Company admin created:', companyAdmin.email);

  // Link admin to company
  await prisma.employee.upsert({
    where: { userId: companyAdmin.id },
    update: {},
    create: {
      userId: companyAdmin.id,
      companyId: company.id,
      startDate: new Date('2024-01-01'),
      workCenter: 'Sede Central',
    },
  });

  // Create a sample employee
  const employeePassword = await hashPassword('employee123');
  const employee = await prisma.user.upsert({
    where: { email: 'empleado@empresademo.com' },
    update: {},
    create: {
      email: 'empleado@empresademo.com',
      passwordHash: employeePassword,
      role: 'EMPLOYEE',
    },
  });
  console.log('✅ Sample employee created:', employee.email);

  await prisma.employee.upsert({
    where: { userId: employee.id },
    update: {},
    create: {
      userId: employee.id,
      companyId: company.id,
      startDate: new Date('2024-01-15'),
      workCenter: 'Sede Central',
    },
  });

  // Add some Spanish national holidays for 2025
  const holidays = [
    { date: new Date('2025-01-01'), name: 'Año Nuevo', region: 'ES' },
    { date: new Date('2025-01-06'), name: 'Reyes Magos', region: 'ES' },
    { date: new Date('2025-04-18'), name: 'Viernes Santo', region: 'ES' },
    { date: new Date('2025-05-01'), name: 'Día del Trabajador', region: 'ES' },
    { date: new Date('2025-08-15'), name: 'Asunción de la Virgen', region: 'ES' },
    { date: new Date('2025-10-12'), name: 'Fiesta Nacional de España', region: 'ES' },
    { date: new Date('2025-11-01'), name: 'Todos los Santos', region: 'ES' },
    { date: new Date('2025-12-06'), name: 'Día de la Constitución', region: 'ES' },
    { date: new Date('2025-12-08'), name: 'Inmaculada Concepción', region: 'ES' },
    { date: new Date('2025-12-25'), name: 'Navidad', region: 'ES' },
  ];

  for (const holiday of holidays) {
    await prisma.holiday.upsert({
      where: {
        date_region: {
          date: holiday.date,
          region: holiday.region,
        },
      },
      update: {},
      create: holiday,
    });
  }
  console.log('✅ Spanish holidays added for 2025');

  console.log('🎉 Seed completed!');
  console.log('\n📝 Test credentials:');
  console.log('Super Admin: admin@educacenter.com / EducaCenter2025');
  console.log('Company Admin: admin@empresademo.com / admin123');
  console.log('Employee: empleado@empresademo.com / employee123');
}

seed()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
