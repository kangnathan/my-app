import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

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

    const { name } = await req.json();

    if (!name) {
        return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { name },
        });

        return NextResponse.json({ message: 'Name updated successfully', user: updatedUser });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating name', error: error.message }, { status: 500 });
    }
}
