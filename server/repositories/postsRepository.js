import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({})

async function postsSize() {
  return prisma.posts.count();
}

async function getPostsPage(page) {
  const total = await postsSize();
  const posts = await prisma.posts.findMany({
    skip: (page - 1) * 20,
    take: 20,
    orderBy: { createdAt: 'desc' },
  });

  return {
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    posts,
  };
}

async function createPost(postData){
    return prisma.posts.create({
        data: postData
    })
}

export default {getPostsPage, createPost, postsSize}
