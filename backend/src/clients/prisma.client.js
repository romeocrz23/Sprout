// Centralized Prisma client instance used across
// the backend for all database operations.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
