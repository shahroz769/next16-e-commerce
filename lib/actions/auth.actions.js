'use server';

import { redirect } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/Models';
import { createSession, deleteSession } from '@/lib/session';

export async function signUp(prevState, formData) {
    // 1. Extract all fields
    const { name, email, password, confirmPassword, callbackUrl } =
        Object.fromEntries(formData);
    console.log(name, email, password, confirmPassword);

    // 2. Comprehensive Validation
    if (!name || !email || !password || !confirmPassword) {
        return {
            success: false,
            message: 'All fields are required.',
            name,
            email,
            password,
            confirmPassword,
        };
    }
    if (password.length < 6) {
        return {
            success: false,
            message: 'Password must be at least 6 characters.',
            name,
            email,
            password,
            confirmPassword,
        };
    }
    if (password !== confirmPassword) {
        return {
            success: false,
            message: 'Passwords do not match.',
            name,
            email,
            password,
            confirmPassword,
        };
    }

    // 3. Process after validation
    try {
        await dbConnect();
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return {
                success: false,
                message: 'User already exists',
                name,
                email,
                password,
                confirmPassword,
            };
        }

        // 4. Create user with the plain-text password.
        //Mongoose 'pre-save' hook will automatically hash it.
        const user = await User.create({
            name,
            email,
            password,
        });

        await createSession(user._id.toString());
    } catch (error) {
        return {
            success: false,
            message: 'An error occurred: ' + error.message,
            name,
            email,
            password,
            confirmPassword,
        };
    }

    redirect(callbackUrl || '/');
}

export async function signIn(prevState, formData) {
    const { email, password, callbackUrl } = Object.fromEntries(formData);

    // Basic validation
    if (!email || !password) {
        return {
            success: false,
            message: 'Email and password are required.',
            email,
            password,
        };
    }

    try {
        await dbConnect();
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return {
                success: false,
                message: 'Invalid email or password',
                email,
                password,
            };
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return {
                success: false,
                message: 'Invalid email or password',
                email,
                password,
            };
        }

        await createSession(user._id.toString());
    } catch (error) {
        return {
            success: false,
            message: 'An error occurred: ' + error.message,
            email,
            password,
        };
    }

    redirect(callbackUrl || '/');
}

export async function signOut() {
    await deleteSession();
}
