import postsServices from "../services/postsServices.js";

const createPost = async (req, res) =>{
    try{
        const authHeader = req.headers.authorization;
        const {title, tags, content, location_id} = req.body;
        const token = authHeader.split(' ')[1];
        
        const imagesUrl = req.files?.map(file => file.path) || [];

        const response = await postsServices.createPost(token,title, tags, content, imagesUrl, location_id);
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

async function getPostsFiltered(req, res) {
  try {
    const { page, state, city, tags } = req.query;

    const tagsArray = tags ? tags.split(",") : [];

    const posts = await postsServices.getPostsFiltered({
      page: Number(page) || 1,
      state,
      city,
      tags: tagsArray,
    });

    return res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar posts" });
  }
}

const getByUser = async (req, res) => {
    try{
        const {id} = req.params;
        const posts = await postsServices.getByUser(id);
        res.status(200).json(posts); 
    }catch(e){
        res.status(500).json({ err: e.message })
    }
}

const deletePost = async (req, res) => {
    try{
        const {id} = req.params;
        const response = await postsServices.deletePost(id);
        res.status(200).json(response); 
    }catch(e){
        res.status(500).json({ err: e.message })
    }
}


export default {createPost, getPostsPage, getSize, getUserInfo, getPostsFiltered, getByUser, deletePost}