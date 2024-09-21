import { PrismaClient } from '@prisma/client';
import { formatDateTime } from '@/utils/formatDateTime';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        // retrieve the JWT from the "mycrudapp" cookie
        const cookie = cookies().get("mycrudapp");
        const token = cookie ? cookie.value : null;

        if (!token) {
            return new Response(JSON.stringify({ success: false, message: 'Unauthorized: No token provided' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // verify the JWT token
        const jwtSecret = process.env.JSWTOKEN;
        const decoded = jwt.verify(token, jwtSecret);
        if (!decoded || !decoded.userId) {
            return new Response(JSON.stringify({ success: false, message: 'Unauthorized: Invalid token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // extract the title and content from the request body
        const { title, content } = await req.json();

        // to create a new post and relate it to the authenticated user
        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                author: {
                    connect: { id: decoded.userId }, // Use userId from the decoded token
                },
            },
        });

        newPost.createdAt = formatDateTime(newPost.createdAt);
        newPost.updatedAt = formatDateTime(newPost.updatedAt);

        // return the response with the newly created post
        return new Response(JSON.stringify({ success: true, data: newPost }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {       
        return new Response(JSON.stringify({ success: false, message: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
