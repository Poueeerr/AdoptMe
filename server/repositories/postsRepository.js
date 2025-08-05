import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({});

async function postsSize() {
  const total = await prisma.posts.count();
  return Math.ceil(total / 20);
}

async function getPostsPage(page) {
  return await prisma.posts.findMany({
    skip: (page - 1) * 20,
    take: 20,
    include: {
      location: true,
    },
  });
}

async function getUserInfo(postId) {
  return await prisma.posts.findUnique({
    where: { id: Number(postId) },
    select: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });
}

async function createPost(postData) {
  const { author_id, location_id, title, tags, content, imagesUrl } = postData;

  if (!location_id || isNaN(Number(location_id))) {
    console.log(location_id);
    throw new Error("location_id inválido ou ausente");
  }

  return prisma.posts.create({
    data: {
      title,
      tags,
      content,
      imagesUrl,
      author: {
        connect: { id: author_id },
      },
      location: {
        connect: { id: Number(location_id) },
      },
    },
  });
}

async function findPosts({ filters, skip, take }) {
  let prismaFilters = filters;
  if (prismaFilters.tags && prismaFilters.tags.hasSome) {
  } else if (prismaFilters.tags && Array.isArray(prismaFilters.tags)) {
    prismaFilters.tags = { hasSome: prismaFilters.tags };
  }

  return prisma.posts.findMany({
    where: prismaFilters,
    skip,
    take,
    include: {
      location: true,
    },
  });
}

export default { getPostsPage, createPost, postsSize, getUserInfo, findPosts };
