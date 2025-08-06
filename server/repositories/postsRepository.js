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

async function getByUser(id) {
  return prisma.posts.findMany({
    where:{
      author_id: id 
    },
        include: {
      location: true,
    },

  })
}

async function deletePost(id) {
  return await prisma.posts.delete({
    where: { id }
  })
}

async function updatePost(postId, data) {
  const updated = await prisma.posts.update({
    where: {
      id: postId,
    },
    data: {
      title: data.title,
      tags: data.tags,
      content: data.content,
      imagesUrl: data.imagesUrl,
      location_id: data.location_id,
    },
  });

  return updated;
}
export default { getPostsPage, createPost, postsSize, getUserInfo, findPosts, getByUser, deletePost, updatePost };
