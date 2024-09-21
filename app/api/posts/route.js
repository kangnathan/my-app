import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

async function getUserName(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });
    return user ? user.name : 'Unknown User';
  } catch (error) {
    console.error('Error fetching user name:', error);
    return 'Unknown User';
  }
}

async function getPostsByUser({ userId, startDate, endDate, showDeleted, title }) {
  try {
    const filter = { authorId: userId };

    if (startDate) {
      filter.createdAt = { gte: new Date(startDate) };
    }

    if (endDate) {
      filter.createdAt = { lte: new Date(endDate) };
    }

    filter.deleted = showDeleted === 'show';

    if (title) {
      filter.title = { contains: title, mode: 'insensitive' };
    }

    const posts = await prisma.post.findMany({
      where: filter,
      include: {
        author: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts.map(post => ({
      ...post,
      authorName: post.author ? post.author.name : 'Unknown',
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function GET(request) {
  try {
    const cookie = cookies().get('mycrudapp');
    const theCookie = cookie ? cookie.value : null;

    if (theCookie) {
      const jwtSecret = process.env.JSWTOKEN;

      if (!jwtSecret) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
      }

      const decoded = jwt.verify(theCookie, jwtSecret);
      const userId = decoded.userId;

      const url = new URL(request.url);
      const startDate = url.searchParams.get('startDate');
      const endDate = url.searchParams.get('endDate');
      const showDeleted = url.searchParams.get('showDeleted');
      const title = url.searchParams.get('title');

      const posts = await getPostsByUser({ userId, startDate, endDate, showDeleted, title });
      const userName = await getUserName(userId); // Get the user's name

      return NextResponse.json({ posts, userName }); // Return both posts and user name
    }

    return NextResponse.json({ error: 'No token provided' }, { status: 400 });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
