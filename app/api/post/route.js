import { PrismaClient } from '@prisma/client';
import { formatDateTime } from '@/utils/formatDateTime';

const prisma = new PrismaClient();

export async function POST(req) {
    const { title, content } = await req.json();
    try {
        const newPost = await prisma.post.create({
            data: { title, content },
        });
        newPost.createdAt = formatDateTime(newPost.createdAt);
        newPost.updatedAt = formatDateTime(newPost.updatedAt);
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
