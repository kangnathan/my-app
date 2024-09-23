import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function authenticateUser() {
    const cookie = cookies().get("mycrudapp");
    const token = cookie ? cookie.value : null; 

    if (!token) {
        return { success: false, message: 'Unauthorized: No token provided' };
    }

    const jwtSecret = process.env.JSWTOKEN;
    try {
        const decoded = jwt.verify(token, jwtSecret);
        if (!decoded || !decoded.userId) {
            return { success: false, message: 'Unauthorized: Invalid token' };
        }
        return { success: true, userId: decoded.userId };
    } catch (error) {
        return { success: false, message: 'Unauthorized: Invalid token' };
    }
}

export async function PUT(req) {
    const { success, userId, message } = await authenticateUser();
    if (!success) {
        return NextResponse.json({ message }, { status: 401 });
    }

    const { name, originalPassword, newPassword } = await req.json();
    const errors = {};

    if (!name && !newPassword) {
        return NextResponse.json({ message: 'Name or password is required' }, { status: 400 });
    }

    try {
        // fetch the current user
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // validate and change the password
        if (newPassword) {
            if (!originalPassword) {
                return NextResponse.json({ message: 'Original password is required to change the password' }, { status: 400 });
            }

            // verify the original password
            const isPasswordCorrect = await bcrypt.compare(originalPassword, user.password);
            if (!isPasswordCorrect) {
                return NextResponse.json({ message: 'Incorrect original password' }, { status: 400 });
            }

            //  same rules as in the registration logic
            if (newPassword.length < 12) {
                errors.password = 'Password must be at least 12 characters.';
            } else if (newPassword.length > 50) {
                errors.password = 'Password cannot exceed 50 characters.';
            }

       
            if (Object.keys(errors).length > 0) {
                return NextResponse.json({ errors, success: false }, { status: 400 });
            }

            // hash the new passwordd
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // update the password
            await prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword },
            });
        }

        // update the name if provided
        if (name) {
            await prisma.user.update({
                where: { id: userId },
                data: { name },
            });
        }

        return NextResponse.json({ message: 'User updated successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating user', error: error.message }, { status: 500 });
    }
}
