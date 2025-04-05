import bcrypt from 'bcrypt';
import crypto from 'crypto';

import User from "../models/user.model.js";
import { generateCookieToken } from '../utils/generateCookieToken.js';
import { sendPasswordResetConfirmEmail, sendPasswordResetEmail, sendVerificationEmail, sendWelcomeEmail } from '../config/mailtrap/emails.js';
import { CLIENT_URL } from '../config/env.js';

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        res.status(200).json({
            message: "User authenticated successfully.",
            success: true,
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: `Internal server error in checkAuth route: ${error.message}.`,
            success: false,
        });
    }
}

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            // throw new Error("All fields are required");
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        const findIfUserExists = await User.findOne({ email });
        if (findIfUserExists) {
            return res.status(400).json({
                message: "User already exists. Please login.",
                success: false
            });
        }

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hashedPassword) => {
                const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
                const createUser = await User.create({
                    name,
                    email,
                    password: hashedPassword,
                    verificationToken,
                    verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 1 day validity
                });

                generateCookieToken(res, createUser._id); // Set cookie token for the user
                await sendVerificationEmail(createUser.email, verificationToken); // Send email to user for successfully registering and try to authenticate the user using the verification token.

                if (createUser) {
                    return res.status(201).json({
                        message: "User created succesfully.",
                        success: true,
                        user: {
                            ...createUser._doc,
                            password: undefined
                        }
                    });
                }
            });
        });

    } catch (error) {
        return res.status(500).json({
            message: `Internal server error in register route: ${error.message}.`,
            success: false,
        });
    }

}

export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        if (!code) {
            return res.status(400).json({
                message: "Verification code is required.",
                success: false
            });
        }

        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired verification code.",
                success: false
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();

        // Send a success email to the user
        // await sendWelcomeEmail(user.email, user.name);

        return res.status(200).json({
            message: "Email verified successfully.",
            success: true,
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: `Internal server error in verifyEmail route: ${error.message}.`,
            success: false,
        });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false

            });
        }

        const findUser = await User.findOne({ email });
        if (!findUser) {
            return res.status(400).json({
                message: "Invalid email or password.",
                debug: "no user found",
                success: false
            });
        }



        bcrypt.compare(password, findUser.password, async (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: `Error comparing passwords: ${err.message}`,
                    success: false
                });
            } else {
                if (!result) {
                    return res.status(400).json({
                        message: "Invalid email or password.",
                        debug: "password or email was wrong",
                        success: false
                    });
                } else {
                    generateCookieToken(res, findUser._id); // Set cookie token for the user

                    findUser.lastLogin = new Date(); // Update the last login field to now
                    await findUser.save();

                    return res.status(200).json({
                        message: "User Logged in successfully.",
                        success: true,
                        user: {
                            ...findUser._doc,
                            password: undefined
                        }
                    });
                }
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: `Internal server error in login route: ${error.message}`,
            success: false,
        });
    }
}

export const logout = async (req, res) => {
    // res.cookie('token, '');
    res.clearCookie("token"); // Clear the cookie
    res.status(200).json({
        message: "User logged out successfully.",
        success: true
    });
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({
                message: "Email is required.",
                success: false
            });
        }

        const findUser = await User.findOne({ email });
        if (!findUser) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        const resetPasswordToken = crypto.randomBytes(32).toString("hex");
        const resetPasswordTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        findUser.resetPasswordToken = resetPasswordToken;
        findUser.resetPasswordTokenExpiresAt = resetPasswordTokenExpiresAt;
        await findUser.save();

        await sendPasswordResetEmail(findUser.email, `${CLIENT_URL}/reset-password/${resetPasswordToken}`); // Send email to user for resetting password

        return res.status(200).json({
            message: "Password reset email sent successfully.",
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: `Internal server error in forgotPassword route: ${error.message}`,
            success: false,
        });
    }

}

export const resetPassword = async (req, res) => {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;

    try {

        const findUserWithToken = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiresAt: { $gt: Date.now() }
        });

        if (!findUserWithToken) {
            return res.status(400).json({
                message: "Invalid or expired password reset token.",
                success: false
            });
        }

        if (!password || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        if (password.length !== confirmPassword.length || password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match.",
                success: false
            });
        }

        const compareOldAndNewPassword = await bcrypt.compare(password, findUserWithToken.password);
        if (compareOldAndNewPassword) {
            return res.status(400).json({
                message: "New password cannot be the same as the old password.",
                success: false
            });
        }

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({
                        message: `Error hashing password: ${err.message}`,
                        success: false
                    });
                }

                findUserWithToken.password = hashedPassword;
                findUserWithToken.resetPasswordToken = undefined;
                findUserWithToken.resetPasswordTokenExpiresAt = undefined;

                await findUserWithToken.save();

                await sendPasswordResetConfirmEmail(findUserWithToken.email); // Send email to user for successfully resetting password

                return res.status(200).json({
                    message: "Password reset successfully.",
                    success: true,
                });
            });
        });


    } catch (error) {
        return res.status(500).json({
            message: `Internal server error in resetPassword route: ${error.message}`,
            success: false,
        });
    }
}