import { useState } from "react";
import api from '../api';
import TagsInput from "./TagsInput";


function CreatePost() {
  const [postForm, setPostForm] = useState({
    title: '',
    tags: [],
    content: '',
    imagesUrl: []
  });

  const [allowForm, setAllowForm] = useState(false);

  const setTags = (tags) => {
    setPostForm(prev => ({ ...prev, tags }));
  };

  const handlePostForm = async (e) => {
    e.preventDefault();
    try {
      await api.post('posts/create', postForm);
      console.log("Post criado com sucesso")
      setPostForm({
        title: '',
        tags: [],
        content: '',
        imagesUrl: []
      });
    } catch (e) {
      console.error(e);
      alert('Erro ao criar post');
    }
  };
  
  const checkLogged = async () =>{
    try {
          await api.get('/validate');
          setAllowForm(true); 
      } catch (e) {
          alert("Você precisa estar logado para realizar uma postagem")
          setAllowForm(false);
      }
  }

  return (
    <>
      {allowForm ? (
        <div>
          <form onSubmit={handlePostForm}>
          <div>
            <label>Título:</label><br />
            <input
              type="text"
              value={postForm.title}
              onChange={e => setPostForm({...postForm, title: e.target.value})}
              placeholder="Título do post"
              required
            />
          </div>

          <div>
            <label>Tags:</label><br />
                  <TagsInput tags={postForm.tags} setTags={setTags} />
          </div>

          <div>
            <label>Conteúdo:</label><br />
            <textarea
              value={postForm.content}
              onChange={e => setPostForm({...postForm, content: e.target.value})}
              placeholder="Conteúdo do post"
              required
              rows={6}
            />
          </div>

          <button type="submit">Criar Post</button>
        </form>
        </div>
      ) 
      :       
      (<button onClick={checkLogged}>Divulgar Adoção</button>)
      }
      
    </>
  );
}

export default CreatePost;
