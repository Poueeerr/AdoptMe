import postsServices from "../services/postsServices.js";

const createPost = async (req, res) =>{
    try{
        const authHeader = req.headers.authorization;
        const {tags, content, imagesUrl} = req.body;
        const token = authHeader.split(' ')[1];

        const response = await postsServices.createPost(token, tags, content, imagesUrl);
        
        res.status(201).json(response);
    }catch(e){
        res.status(500).json({ err: e.message })
    }
}

const getPostsPage = async (req, res) =>{
    try{
        const {page} = req.params
        const response = await postsServices.getPostsPage(page);
        res.status(201).json(response);
    }catch(e){
        res.status(500).json({ err: e.message })
    }
}


const getSize = async (req, res) =>{
    try{
        const response = await postsServices.postsSize();
        res.status(201).json(response);
    }catch(e){
        res.status(500).json({ err: e.message })
    }
}

export default {createPost, getPostsPage, getSize}