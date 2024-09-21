import { PrismaClient } from '@prisma/client';
import { formatDateTime } from '@/utils/formatDateTime';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

// Authentication helper function
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

export async function GET(req, { params }) {
    const { id } = params; // Get the ID from the route parameters
    const authResult = await authenticateUser();

    if (!authResult.success) {
        return new Response(JSON.stringify(authResult), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const post = await prisma.post.findUnique({ 
            where: { id: id, deleted: false } 
        });
        if (!post) {
            return new Response(JSON.stringify({ success: false, message: "Post not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        post.createdAt = formatDateTime(post.createdAt);
        post.updatedAt = formatDateTime(post.updatedAt);
        return new Response(JSON.stringify({ success: true, data: post }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function PUT(req, { params }) {
    const { id } = params;
    const { title, content } = await req.json();
    const authResult = await authenticateUser();

    if (!authResult.success) {
        return new Response(JSON.stringify(authResult), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const updatedPost = await prisma.post.update({
            where: { id: id },
            data: { title, content },
        });
        updatedPost.createdAt = formatDateTime(updatedPost.createdAt);
        updatedPost.updatedAt = formatDateTime(updatedPost.updatedAt);
        return new Response(JSON.stringify({ success: true, data: updatedPost }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function DELETE(req, { params }) {
    const { id } = params;
    const authResult = await authenticateUser();

    if (!authResult.success) {
        return new Response(JSON.stringify(authResult), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const deletedPost = await prisma.post.update({
            where: { id: id },
            data: {
                deleted: true,
                deletedAt: new Date(),
            },
        });
        deletedPost.createdAt = formatDateTime(deletedPost.createdAt);
        deletedPost.updatedAt = formatDateTime(deletedPost.updatedAt);
        deletedPost.deletedAt = formatDateTime(deletedPost.deletedAt);
        return new Response(JSON.stringify({ success: true, data: deletedPost }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
