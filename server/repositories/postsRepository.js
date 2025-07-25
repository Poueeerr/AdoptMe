import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({})

async function postsSize() {
  const total = prisma.posts.count();
  return Math.ceil(total/20)
}

async function getPostsPage(page) {
  return await prisma.posts.findMany({
    skip: (page - 1) * 20,
    take: 20,
  });
}

async function createPost(postData){
    return prisma.posts.create({
        data: postData
    })
}

export default {getPostsPage, createPost, postsSize}
