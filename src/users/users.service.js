import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Generate JWT token
export const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Hash password
export const hashPassword = async (password) => {
    if (!password) {
        throw new Error('Password is required for hashing');
    }
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
};

// Compare password
export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Create new user
export const createUser = async (userData) => {
    try {
        const { name, email, passwordHash, role = 'customer', gender, dob } = userData;

        // Validate required fields
        if (!email) {
            throw new Error('Email is required');
        }
        if (!passwordHash) {
            throw new Error('Password is required');
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await hashPassword(passwordHash);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
                role,
                gender,
                dob: dob ? new Date(dob) : null
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                gender: true,
                dob: true,
                createdAt: true,
                updatedAt: true
            }
        });

        // Generate token
        const token = generateToken(user.id);

        return {
            user,
            token
        };
    } catch (error) {
        throw error;
    }
};

// Login user
export const loginUser = async (credentials) => {
    try {
        const { email, password } = credentials;

        // Validate required fields
        if (!email) {
            throw new Error('Email is required');
        }
        if (!password) {
            throw new Error('Password is required');
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Check if user has password (for OAuth users)
        if (!user.passwordHash) {
            throw new Error('Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.passwordHash);

        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Generate token
        const token = generateToken(user.id);

        // Return user data without password
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            gender: user.gender,
            dob: user.dob,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        return {
            user: userData,
            token
        };
    } catch (error) {
        throw error;
    }
};

// Get all users (with pagination)
export const getAllUsers = async (page = 1, limit = 10, search = '') => {
    try {
        const skip = (page - 1) * limit;
        
        const where = search ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ]
        } : {};

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    gender: true,
                    dob: true,
                    createdAt: true,
                    updatedAt: true
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.count({ where })
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            users,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        };
    } catch (error) {
        throw error;
    }
};

// Get user by ID
export const getUserById = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                gender: true,
                dob: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    } catch (error) {
        throw error;
    }
};

// Update user
export const updateUser = async (userId, updateData) => {
    try {
        const { name, email, role, gender, dob } = updateData;

        // Check if email is being updated and if it already exists
        if (email) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    email,
                    id: { not: userId }
                }
            });

            if (existingUser) {
                throw new Error('Email already exists');
            }
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(name && { name }),
                ...(email && { email }),
                ...(role && { role }),
                ...(gender && { gender }),
                ...(dob && { dob: new Date(dob) })
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                gender: true,
                dob: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return user;
    } catch (error) {
        throw error;
    }
};

// Change password
export const changePassword = async (userId, currentPassword, newPassword) => {
    try {
        // Get user with password hash
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new Error('User not found');
        }

        if (!user.passwordHash) {
            throw new Error('User does not have a password set');
        }

        // Verify current password
        const isCurrentPasswordValid = await comparePassword(currentPassword, user.passwordHash);

        if (!isCurrentPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        // Hash new password
        const hashedNewPassword = await hashPassword(newPassword);

        // Update password
        await prisma.user.update({
            where: { id: userId },
            data: { passwordHash: hashedNewPassword }
        });

        return { message: 'Password updated successfully' };
    } catch (error) {
        throw error;
    }
};

// Delete user
export const deleteUser = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new Error('User not found');
        }

        await prisma.user.delete({
            where: { id: userId }
        });

        return { message: 'User deleted successfully' };
    } catch (error) {
        throw error;
    }
};

// Get user profile (current user)
export const getUserProfile = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                gender: true,
                dob: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    } catch (error) {
        throw error;
    }
};
