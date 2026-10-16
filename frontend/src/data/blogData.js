export const blogPosts = [
  {
    id: 1,
    slug: 'architecting-high-throughput-postgresql-schemas-prisma',
    category: 'ERP Systems',
    readTime: '6 min read',
    date: 'October 2026',
    title: 'Architecting High-Throughput PostgreSQL Relational Schemas with Prisma ORM',
    excerpt:
      'A deep dive into foreign key constraints, connection pooling, and B-tree indexing strategies for mission-critical healthcare and administrative data platforms.',
    tags: ['PostgreSQL', 'Prisma ORM', 'Database Architecture'],
    featured: true,
    content: `
When engineering data systems for healthcare facilities and high-concurrency academic platforms, data integrity is non-negotiable. This engineering post breaks down the specific schema design patterns and indexing techniques we applied:

### 1. Enforcing Referential Integrity with Strict Foreign Keys
Avoid application-level pseudo-relations. Using composite foreign keys with cascading updates ensures that orphaned records can never exist in sensitive tables like patient vitals or course prerequisites.

### 2. Connection Pooling & Prepared Statement Caching
PostgreSQL connection overhead can throttle Node.js event loops under burst traffic. By pairing PgBouncer with Prisma's connection pool tuning, transaction throughput was boosted by 3.2x while keeping p99 response times under 45ms.

### 3. Partial & B-Tree Indexing Strategies
Index only what you filter. Creating partial indexes on active records (e.g., WHERE status = 'ACTIVE') reduced index bloat by 68% and dramatically accelerated doctor triage queues.
    `,
  },
  {
    id: 2,
    slug: 'building-resilient-rest-apis-node-express-middleware',
    category: 'Web Apps',
    readTime: '5 min read',
    date: 'September 2026',
    title: 'Building Resilient REST APIs with Node.js and Express Middleware Pipelines',
    excerpt:
      'How to structure asynchronous controller boundaries, custom validation layers, and JWT authentication flows for production stability.',
    tags: ['Node.js', 'Express.js', 'JWT Auth', 'REST APIs'],
    featured: false,
    content: `
Middleware in Express is frequently underutilized. A clean pipeline should act as a series of security and transformation checkpoints:

- **Strict Schema Validation**: Sanitize payloads before any business logic executes.
- **Fail-Safe JWT Verification**: Handle token expiration gracefully with unified error responses.
- **Centralized Error Boundaries**: Never let unhandled promise rejections bring down production worker processes.
    `,
  },
  {
    id: 3,
    slug: 'android-lifecycle-management-local-sqlite-sync',
    category: 'Mobile Apps',
    readTime: '4 min read',
    date: 'August 2026',
    title: 'Android Lifecycle Management & Local SQLite Synchronization Patterns',
    excerpt:
      'Architecting offline-first mobile workflows using Android Studio, handling network reconnects, and ensuring thread-safe data synchronization.',
    tags: ['Android Studio', 'SQLite', 'Mobile Architecture', 'Offline Sync'],
    featured: false,
    content: `
In environments with intermittent connectivity, mobile apps must remain fully functional offline:

1. **Local SQLite Single Source of Truth**: UI components observe local database tables rather than direct remote API responses.
2. **WorkManager Queued Syncs**: Background jobs batch and retry outbound synchronization whenever reliable Wi-Fi or cellular networks are detected.
3. **Optimistic UI Updates**: Immediately reflect user interactions with rollback guarantees in case of conflict.
    `,
  },
  {
    id: 4,
    slug: 'designing-hospital-ehr-workflows-for-scale',
    category: 'ERP Systems',
    readTime: '7 min read',
    date: 'July 2026',
    title: 'Designing Hospital Electronic Health Record (EHR) Workflows for Scalability',
    excerpt:
      'Real-world architectural lessons from modeling patient registries, doctor scheduling pipelines, and relational audit trails.',
    tags: ['Healthcare Tech', 'EHR Systems', 'SQL', 'Database Design'],
    featured: false,
    content: `
Healthcare platforms operate under strict zero-downtime and audit compliance constraints:

- **Immutable Audit Logs**: Every diagnosis modification and prescription dispatch must append to an append-only audit trail table.
- **Concurrency Locks on Appointments**: Utilizing PostgreSQL row-level locks (\`SELECT FOR UPDATE\`) eliminates double-booking hazards during peak shift handovers.
- **Role-Based Access Control (RBAC)**: Segregate clinical views so laboratory technicians, head nurses, and attending physicians only access necessary patient data fields.
    `,
  },
  {
    id: 5,
    slug: 'relational-vs-document-stores-when-sql-wins',
    category: 'Desktop Apps',
    readTime: '5 min read',
    date: 'June 2026',
    title: 'Relational vs Document Stores: When Strict Schemas & SQL Win',
    excerpt:
      'An engineering breakdown contrasting ACID-compliant relational databases like PostgreSQL with flexible document stores in enterprise software.',
    tags: ['PostgreSQL', 'MongoDB', 'System Design', 'ACID Compliance'],
    featured: false,
    content: `
While NoSQL document stores offer schemaless velocity during early prototyping, relational databases provide structural guarantees essential for complex data:

- **ACID Transactions Across Boundaries**: Modifying inventory, charging balances, and writing receipts must succeed or roll back atomically.
- **Normalized Queries without Duplication**: Avoid stale denormalized data by leveraging declarative SQL joins.
- **Structured Schema Migrations**: Prisma and PostgreSQL provide version-controlled schema evolution with zero data ambiguity.
    `,
  },
];

export const blogCategories = [
  'All Posts',
  'Web Apps',
  'Mobile Apps',
  'Desktop Apps',
  'ERP Systems',
  'Other',
];
