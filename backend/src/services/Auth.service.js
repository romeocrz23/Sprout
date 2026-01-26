import bcrypt from "bcrypt";
import prisma from "../clients/prisma.client.js";

// =====================================================
// Authentication Service
// =====================================================
// Contains the business logic for user registration
// and authentication. Handles password hashing and
// credential validation using Prisma ORM.
// =====================================================

/**
 * Registers a new user account.
 * @param {string} email
 * @param {string} password
 * @returns {Object} Safe user data
 */
export const registerUser = async (email, password) => {

  // Checks if the email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("Email already in use");
  }

  // Hash password before storing
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user record
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash
    }
  });

  // Return user data
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt
  };
};

/**
 * Authenticates an existing user.
 * @param {string} email
 * @param {string} password
 * @returns {Object} Safe user data
 */
export const loginUser = async (email, password) => {

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Compare provided password with stored hash
  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt
  };
};
