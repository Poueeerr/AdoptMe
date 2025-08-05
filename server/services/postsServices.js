import postsRepository from "../repositories/postsRepository.js";
import jwt from "jsonwebtoken";

const createPost = async (token, title, tags, content, imagesUrl, location_id) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const author_id = decoded.id;
  if (!author_id || !content)
    return { error: true, message: "author_id e content são obrigatórios" };

  const response = await postsRepository.createPost({
    author_id,
    title,
    tags:
      typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : tags,
    content,
    imagesUrl,
    location_id
  });
  return response;
};

const getPostsPage = async (page) => {
  return await postsRepository.getPostsPage(page);
};

const postsSize = async () => {
  return await postsRepository.postsSize();
};

const getUserInfo = async (postId) => {
  return await postsRepository.getUserInfo(postId);
};

async function getPostsFiltered({ page = 1, state, city, tags }) {
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  let filters = {};

  if (state) filters["location.state"] = state;
  if (city) filters["location.city"] = city;
  if (tags.length > 0) {
    filters.tags = {
      hasSome: tags,
    };
  }
  filters = convertDotNotationFilters(filters)
  const posts = await postsRepository.findPosts({ filters, skip, take: pageSize });
  return posts;
}


function convertDotNotationFilters(filters) {
  const prismaFilters = {};

  for (const key in filters) {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      if (!prismaFilters[parent]) prismaFilters[parent] = {};
      prismaFilters[parent][child] = filters[key];
    } else {
      prismaFilters[key] = filters[key];
    }
  }

  return prismaFilters;
}

export default { createPost, getPostsPage, postsSize, getUserInfo, getPostsFiltered };
