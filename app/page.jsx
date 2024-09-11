import prisma from '@/lib/prisma';
import HomeClient from './components/HomeClient';
import { formatDateTime } from '@/utils/formatDateTime';

// Fetch posts with filtering parameters
async function getPosts({ startDate, endDate, showDeleted }) {
  try {
    const filter = {};

    if (startDate) {
      filter.createdAt = { ...filter.createdAt, gte: new Date(startDate) };
    }

    if (endDate) {
      filter.createdAt = { ...filter.createdAt, lte: new Date(endDate) };
    }

    if (showDeleted === 'show') {
      filter.deletedAt = { not: null };
    } else {
      filter.deletedAt = null;
    }

    const posts = await prisma.post.findMany({
      where: filter,
      include: { author: { select: { name: true } } },
    });

    return posts.map(post => ({
      ...post,
      authorName: post.author ? post.author.name : 'Unknown',
      createdAt: formatDateTime(post.createdAt),
      updatedAt: formatDateTime(post.updatedAt),
      deletedAt: post.deletedAt ? formatDateTime(post.deletedAt) : null,
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function Home({ searchParams }) {
  const { startDate, endDate, showDeleted } = searchParams;
  const posts = await getPosts({ startDate, endDate, showDeleted });
  return <HomeClient posts={posts} startDate={startDate} endDate={endDate} showDeleted={showDeleted} />;
}
