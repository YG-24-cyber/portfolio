import { Role, ProjectStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../src/config/prisma.js';

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Master Super Admin
  const adminPasswordHash = await bcrypt.hash('admin1234', 10);
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {
      passwordHash: adminPasswordHash,
      displayName: 'Tamrat G/her',
      email: 'admin@tamrat.dev',
      role: Role.SUPER_ADMIN,
    },
    create: {
      username: 'admin',
      email: 'admin@tamrat.dev',
      passwordHash: adminPasswordHash,
      displayName: 'Tamrat G/her',
      role: Role.SUPER_ADMIN,
    },
  });
  console.log(`✅ Admin account configured: ${admin.username} (${admin.displayName})`);

  // 2. Seed Projects
  const projects = [
    {
      title: 'Hospital Management System',
      slug: 'hospital-management-system',
      category: 'Healthcare',
      description:
        'Enterprise EHR platform providing role-based clinical tracking, patient telemetry integration, and relational audit logging.',
      techStack: ['React', 'Node.js', 'PostgreSQL', 'Prisma', 'Tailwind CSS'],
      status: ProjectStatus.ACTIVE,
      isFeatured: true,
      liveUrl: 'https://hospital.tamrat.dev',
      githubUrl: 'https://github.com/tamrat-gher/hospital-management',
      previewArchetype: 'healthcare_ehr',
      order: 1,
    },
    {
      title: 'School Database Platform',
      slug: 'school-database-platform',
      category: 'Database Solutions',
      description:
        'High-throughput academic record management engine designed around strict 3NF relational schemas and transactional integrity.',
      techStack: ['PostgreSQL', 'Prisma ORM', 'Express.js', 'TypeScript'],
      status: ProjectStatus.ACTIVE,
      isFeatured: true,
      liveUrl: 'https://school-db.tamrat.dev',
      githubUrl: 'https://github.com/tamrat-gher/school-database-engine',
      previewArchetype: 'relational_schema',
      order: 2,
    },
    {
      title: 'Automated Trading Journal',
      slug: 'automated-trading-journal',
      category: 'FinTech',
      description:
        'Analytics web application featuring Google OAuth authentication, inline trade filtering, automated risk modeling, and p99 low-latency search.',
      techStack: ['React', 'Node.js', 'Express', 'Google OAuth', 'Tailwind CSS'],
      status: ProjectStatus.PRODUCTION,
      isFeatured: true,
      liveUrl: 'https://journal.tamrat.dev',
      githubUrl: 'https://github.com/tamrat-gher/trading-journal',
      previewArchetype: 'fintech_analytics',
      order: 3,
    },
    {
      title: 'E-Commerce Platform',
      slug: 'modern-ecommerce-platform',
      category: 'E-Commerce & Web',
      description:
        'Modern storefront solution featuring responsive glassmorphism UI, client-side cart synchronization, and dynamic product catalogs.',
      techStack: ['React', 'Vite', 'Tailwind CSS', 'Node.js'],
      status: ProjectStatus.PRODUCTION,
      isFeatured: false,
      liveUrl: 'https://store.tamrat.dev',
      githubUrl: 'https://github.com/tamrat-gher/modern-ecommerce',
      previewArchetype: 'ecommerce_store',
      order: 4,
    },
  ];

  for (const proj of projects) {
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: proj,
      create: proj,
    });
  }
  console.log(`✅ Seeded ${projects.length} showcase projects`);

  // 3. Seed Technical Blog Essays
  const blogs = [
    {
      title: 'Architecting High-Throughput PostgreSQL Relational Schemas in Production',
      slug: 'architecting-high-throughput-postgresql-schemas',
      category: 'PostgreSQL & SQL',
      excerpt:
        'Deep dive into transaction isolation levels, indexing strategies, and connection pooling bottlenecks in high-volume web services.',
      body: 'Detailed engineering analysis on designing 3NF relational schemas, indexing strategies with B-Trees and GIN indexes, and handling connection pool exhaustion under load.',
      tags: ['PostgreSQL', 'Prisma ORM', 'Database Design', 'SQL'],
      readTime: '6 min read',
      isFeatured: true,
    },
    {
      title: 'Building Resilient REST APIs with Node.js and Express Middleware',
      slug: 'building-resilient-rest-apis-nodejs-express',
      category: 'Backend & APIs',
      excerpt:
        'Practical patterns for building fail-safe REST APIs using centralized error boundaries, rate limiting, and strict input validation.',
      body: 'Overview of implementing asynchronous error wrappers, JWT validation middleware, and structured API envelopes across layered backend architectures.',
      tags: ['Node.js', 'Express', 'JWT Auth', 'REST API'],
      readTime: '5 min read',
      isFeatured: false,
    },
    {
      title: 'Android Lifecycle Management & Local SQLite Sync Patterns',
      slug: 'android-lifecycle-management-sqlite-sync',
      category: 'Mobile Development',
      excerpt:
        'Architectural strategies for synchronizing local SQLite stores with cloud backends using Android WorkManager and ViewModel bindings.',
      body: 'Analysis of background sync routines, handling offline state transitions, and managing Android Activity lifecycles without leaking database cursors.',
      tags: ['Android Studio', 'Java', 'SQLite', 'Mobile Architecture'],
      readTime: '4 min read',
      isFeatured: false,
    },
  ];

  for (const blog of blogs) {
    await prisma.blogPost.upsert({
      where: { slug: blog.slug },
      update: blog,
      create: blog,
    });
  }
  console.log(`✅ Seeded ${blogs.length} technical blog essays`);

  // 4. Seed CV Releases
  const cvReleases = [
    {
      versionTag: 'v2.1 (Production)',
      fileName: 'Tamrat_Gher_Resume_v2.1.pdf',
      targetSpecialization: 'Full-Stack, PostgreSQL & Android Systems',
      fileSize: '184 KB',
      checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      changelog:
        'Added PostgreSQL schema design case studies, Android Studio projects, and updated Mekelle University leadership milestones.',
      isActive: true,
    },
    {
      versionTag: 'v2.0',
      fileName: 'Tamrat_Gher_Resume_v2.0.pdf',
      targetSpecialization: 'Full-Stack Web Architecture & Node.js Services',
      fileSize: '176 KB',
      checksumSha256: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      changelog: 'Expanded NexTech Innovators workshop metrics and trading journal deployment notes.',
      isActive: false,
    },
    {
      versionTag: 'v1.9 (Archive)',
      fileName: 'Tamrat_Gher_Resume_v1.9.pdf',
      targetSpecialization: 'Core Systems & Database Engineering',
      fileSize: '162 KB',
      checksumSha256: '1b85f11e62679e09cae2fe3a9d8b33e38f434346648f6b96df89dda901c5176b',
      changelog: 'Initial verified resume version with 3.86 GPA academic standing.',
      isActive: false,
    },
  ];

  for (const cv of cvReleases) {
    await prisma.cVRelease.upsert({
      where: { versionTag: cv.versionTag },
      update: cv,
      create: cv,
    });
  }
  console.log(`✅ Seeded ${cvReleases.length} CV release artifacts`);

  // 5. Seed System Telemetry Singleton
  const telemetry = await prisma.systemTelemetry.findFirst();
  if (!telemetry) {
    await prisma.systemTelemetry.create({
      data: {
        totalCvDownloads: 708,
        lastCvDownloadAt: new Date(),
      },
    });
    console.log('✅ Seeded baseline CV download telemetry (708 fetches)');
  }

  console.log('✨ Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
