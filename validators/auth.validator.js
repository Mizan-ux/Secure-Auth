// validators/auth.validator.js 
import z from 'zod'
import { email, minimum } from 'zod/v4-mini';
const registerSchema = z.object({
    name: z.string().min(2, 'Name is too short'),
    email: z.string().email('Invalid email format'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});


const resetSchema = z.object({
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
    confirmPassword: z.string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
})

const forgotSchema = z.object({
    email: z.string().email('Invalid email format'),
})


export { registerSchema, loginSchema, resetSchema, forgotSchema };