import postsServices from "../services/postsServices.js";

const createPost = async (req, res) =>{
    try{
        const authHeader = req.headers.authorization;
        const {title, tags, content} = req.body;
        const token = authHeader.split(' ')[1];
        
        const imagesUrl = req.files?.map(file => file.path) || [];

        const response = await postsServices.createPost(token,title, tags, content, imagesUrl);
        res.status(201).json(response);
    }catch(e){
        console.error('[createPost ERROR]', e);

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
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({ err: e.message })
    }
}

const getUserInfo = async(req,res)=>{
    try{
        const {postId} = req.params
        const response = await postsServices.getUserInfo(parseInt(postId));
        res.status(200).json(response);
    }
    catch(e){
        res.status(500).json({ err: e.message })
    }
}
export default {createPost, getPostsPage, getSize, getUserInfo}