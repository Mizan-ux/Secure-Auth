import User from "../model/User.model.js"
import crypto from "crypto";
import nodemailer from "nodemailer"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { ApiError, ApiResponse } from "../utils/apiErros.js";
import { registerSchema, loginSchema, forgotSchema, resetSchema } from "../validators/auth.validator.js";

const registerUser = async (req, res, next) => {

    try {
        registerSchema.parse(req.body); // verified
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return next(new ApiError('user already exists', 400))
        }

        const user = await User.create({
            name,
            email,
            password
        })

        if (!user) {
            return next(new ApiError('user not registered', 400))
        }

        const token = crypto.randomBytes(32).toString("hex");

        user.verificationToken = token;
        await user.save();

        //send email
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false,
            auth: {
                user: process.env.MAILTRAP_USERNAME,
                pass: process.env.MAILTRAP_PASSWORD,
            },
        });

        const mailOption = {
            from: `"Mizan" <${process.env.MAILTRAP_SENDEREMAIL}>`,
            to: user.email,
            subject: "Verify your email",
            text: `Please click on the following link:
            ${process.env.BASE_URL}/api/v1/users/verify/${token}`,
            html: `
                <h1>Welcome to Mizan's App!</h1>
            <p>Thanks for signing up. We're glad to have you on board.</p>
            <p>Click below to verify your email:</p>
            ${process.env.BASE_URL}/api/v1/users/verify/${token}
            <p>If you didn't request this, you can ignore this email.</p>
            <hr>
            <small>&copy; 2025 Mizan Corp. All rights reserved.</small>
            `
        }

        try {
            const info = await transporter.sendMail(mailOption);
            // Mail sent successfully
            return res.status(200).json(new ApiResponse(200, "Verification mail sent successfully", { info, user }));
        } catch (mailError) {
            // Mail not sent, but user is registered
            console.log('Error:', mailError);
            return res.status(200).json(new ApiResponse(200, "User registered, but verification mail not sent. Please try again."));
        }
    } catch (error) {
        return next(error);
    }
}

const verifyUser = async (req, res, next) => {
    try {
        const { token } = req.params;
        if (!token) {
            return next(new ApiError("Invalid token", 400));
        }
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return next(new ApiError("Invalid token", 400));
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
        return res.status(200).json(new ApiResponse(200, "Email verified successfully", user));
    } catch (error) {
        return next(error);
    }
}

const login = async (req, res, next) => {

    try {
        loginSchema.parse(req.body)
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ApiError("user not found", 400));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(new ApiError("user not found", 400));
        }

        const isuserVerifed = user.isVerified;
        if (!isuserVerifed) {
            return next(new ApiError("please verify you email", 400));
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.SECREATEKEY,
            {
                expiresIn: '24h'
            }
        )

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        }
        res.cookie("token", token, cookieOptions);
        res.status(200).json(new ApiResponse(200, "login successfully", {
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
            }
        }));

        if (user.resetPasswordToken !== undefined && user.resetPasswordExpiers !== undefined) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpiers = undefined;
            await user.save();
        }
    } catch (error) {
        return next(error);
    }
}

const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return next(new ApiError("User not found", 400));
        }

        res.status(200).json(new ApiResponse(200, "User fetched", user));
    } catch (error) {
        return next(error);
    }
}

const logoutUser = async (req, res, next) => {
    try {
        res.cookie('token', "", {});
        res.status(200).json(new ApiResponse(200, "Logged out successfully"));
    } catch (error) {
        return next(error);
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        forgotSchema.parse(req.body);
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ApiError("user not found", 400));
        }
        const token = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpiers = Date.now() + 10 * 60 * 1000;
        await user.save();

        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false,
            auth: {
                user: process.env.MAILTRAP_USERNAME,
                pass: process.env.MAILTRAP_PASSWORD,
            },
        });

        const mailOption = {
            from: `"Mizan" <${process.env.MAILTRAP_SENDEREMAIL}>`,
            to: user.email,
            subject: "Reset your password",
            text: `Please click on the following link to reset your password:
${process.env.BASE_URL}/api/v1/users/resetpassword/${token}`,
            html: `
                <h1>Password Reset Request</h1>
                <p>Click below to reset your password:</p>
                ${process.env.BASE_URL}/api/v1/users/resetpassword/${token}
                <p>If you didn't request this, you can ignore this email.</p>
                <hr>
                <small>&copy; 2025 Mizan Corp. All rights reserved.</small>
            `
        };

        await transporter.sendMail(mailOption);

        res.status(200).json(new ApiResponse(200, "Password reset email sent successfully", user));
    } catch (error) {
        return next(new ApiError("Failed to reset Password Session", 400));
    }
}

const resetPassword = async (req, res, next) => {
    try {
        resetSchema.parse(req.body);
        const { token } = req.params;
        const { password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return next(new ApiError("Please check the password", 400));
        }
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiers: { $gt: Date.now() },
        })
        if (!user) {
            return next(new ApiError("user not found or time expired", 400));
        }
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiers = undefined;
        await user.save();
        res.status(200).json(new ApiResponse(200, "Reset password successfully", user));
    } catch (error) {
        return next(new ApiError("Failed to reset Password", 400));
    }
}
export { registerUser, verifyUser, login, getMe, logoutUser, forgotPassword, resetPassword };