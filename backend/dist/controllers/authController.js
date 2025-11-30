import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import { sendWelcomeEmail, sendResetPasswordEmail, sendPasswordChangedEmail, } from "../utils/email.js";
import crypto from "crypto";
// Signup controller
export const signup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required",
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long",
            });
        }
        if (confirmPassword && password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }
        const emailClean = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email: emailClean });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email",
            });
        }
        const user = await User.create({
            name: name.trim(),
            email: emailClean,
            password,
        });
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        try {
            await sendWelcomeEmail(user.email, user.name);
        }
        catch {
            return res.status(200).json({
                success: true,
                message: "User created but welcome email could not be sent.",
                user: {
                    token,
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });
        }
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email",
            });
        }
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: errors.join(", "),
            });
        }
        return res.status(500).json({
            success: false,
            message: "Signup failed",
        });
    }
};
// Login controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }
        const emailClean = email.toLowerCase().trim();
        const user = await User.findOne({ email: emailClean });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
};
// Logout controller
export const logout = (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            expires: new Date(0), // delete immediately
            path: "/",
        });
        return res.json({
            success: true,
            message: "Logout successful",
        });
    }
    catch {
        return res.status(500).json({
            success: false,
            message: "Logout failed",
        });
    }
};
// Forgot Password controller
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || typeof email !== "string") {
            return res.status(400).json({
                success: false,
                message: "Valid email is required",
            });
        }
        const cleanEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: cleanEmail });
        if (!user) {
            return res.json({
                success: true,
                message: "If an account with that email exists, a password reset link has been sent",
            });
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();
        try {
            await sendResetPasswordEmail(user.email, resetToken);
        }
        catch {
            return res.status(404).json({
                success: false,
                message: "Failed to send reset password email.",
            });
        }
        return res.json({
            success: true,
            message: "If an account with that email exists, a password reset link has been sent",
        });
    }
    catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }
        return res.status(500).json({
            success: false,
            message: "Failed to process forgot password request",
        });
    }
};
// Reset Password controller
export const resetPassword = async (req, res) => {
    try {
        const { resetToken, password, confirmPassword } = req.body;
        if (!resetToken || !password) {
            return res.status(400).json({
                success: false,
                message: "Reset token and new password are required",
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long",
            });
        }
        if (confirmPassword && password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }
        const user = await User.findOne({
            resetToken,
            resetTokenExpiry: { $gt: new Date() },
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token",
            });
        }
        user.password = password;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();
        try {
            await sendPasswordChangedEmail(user.email, user.name);
        }
        catch {
            return res.status(500).json({
                success: false,
                message: "Password changed but confirmation email could not be sent.",
            });
        }
        return res.json({
            success: true,
            message: "Password reset successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Reset password failed",
        });
    }
};
// Get Current User controller
export const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated",
            });
        }
        const user = await User.findById(req.user.userId).select("-password -resetToken -resetTokenExpiry");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    }
    catch {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve user",
        });
    }
};
//# sourceMappingURL=authController.js.map