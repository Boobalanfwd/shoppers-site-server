import { 
    createUser, 
    loginUser, 
    getAllUsers, 
    getUserById, 
    updateUser, 
    changePassword, 
    deleteUser, 
    getUserProfile 
} from './users.service.js';

// Register new user
export const register = async (req, res) => {
    try {
        const { name, email, passwordHash, gender, dob } = req.body;

        const result = await createUser({
            name,
            email,
            passwordHash,
            role: 'customer', // Default role for registration
            gender,
            dob
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result
        });
    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.message === 'User with this email already exists') {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        if (error.message === 'Email is required' || error.message === 'Password is required') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, passwordHash } = req.body;

        const result = await loginUser({
            email,
            passwordHash
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result
        });
    } catch (error) {
        console.error('Login error:', error);
        
        if (error.message === 'Invalid email or password') {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }

        if (error.message === 'Email is required' || error.message === 'Password is required') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all users (admin only)
export const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;

        const result = await getAllUsers(
            parseInt(page),
            parseInt(limit),
            search
        );

        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: result
        });
    } catch (error) {
        console.error('Get all users error:', error);
        
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get user by ID
export const getUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await getUserById(userId);

        res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            data: user
        });
    } catch (error) {
        console.error('Get user by ID error:', error);
        
        if (error.message === 'User not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get current user profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await getUserProfile(userId);

        res.status(200).json({
            success: true,
            message: 'Profile retrieved successfully',
            data: user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        
        if (error.message === 'User not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update user
export const updateUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const updateData = req.body;

        const user = await updateUser(userId, updateData);

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        console.error('Update user error:', error);
        
        if (error.message === 'User not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        if (error.message === 'Email already exists') {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update current user profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updateData = req.body;

        const user = await updateUser(userId, updateData);

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        console.error('Update profile error:', error);
        
        if (error.message === 'User not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        if (error.message === 'Email already exists') {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Change password
export const changeUserPassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        const result = await changePassword(userId, currentPassword, newPassword);

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.error('Change password error:', error);
        
        if (error.message === 'User not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        if (error.message === 'Current password is incorrect') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        if (error.message === 'User does not have a password set') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete user
export const deleteUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await deleteUser(userId);

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.error('Delete user error:', error);
        
        if (error.message === 'User not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete current user account
export const deleteProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await deleteUser(userId);

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.error('Delete profile error:', error);
        
        if (error.message === 'User not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Create user (admin only)
export const createUserByAdmin = async (req, res) => {
    try {
        const { name, email, passwordHash, role = 'customer', gender, dob } = req.body;

        const result = await createUser({
            name,
            email,
            passwordHash,
            role,
            gender,
            dob
        });

        res.status(201).json(result);
    } catch (error) {
        console.error('Create user error:', error);
        
        if (error.message === 'User with this email already exists') {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        if (error.message === 'Email is required' || error.message === 'Password is required') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
