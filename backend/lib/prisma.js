import { PrismaClient } from '../prisma/generated/prisma/index.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL || 'file:./dev.db';

const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

export default prisma;
