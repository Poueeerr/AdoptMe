import postsRepository from "../repositories/postsRepository.js";
import jwt from "jsonwebtoken";

const createPost = async (token, tags, content, imagesUrl) =>{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log("decoded:", decoded);


    const author_id = decoded.id;
    if (!author_id || !content)  return { error: true, message: "author_id e content são obrigatórios" };
    
    const response = await postsRepository.createPost({author_id, tags, content, imagesUrl})
    return response
}

const getPostsPage = async (page) =>{
    return await postsRepository.getPostsPage(page);
}

const postsSize = async () =>{
    return await postsRepository.postsSize();
}

export default {createPost, getPostsPage, postsSize}