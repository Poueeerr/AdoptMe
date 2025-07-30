import { useState, useRef } from "react";
import api from '../api';
import TagsInput from "./TagsInput";

function CreatePost() {
  const [postForm, setPostForm] = useState({
    title: '',
    tags: [],
    content: '',
  });
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [allowForm, setAllowForm] = useState(false);

  const setTags = (tags) => {
    setPostForm(prev => ({ ...prev, tags }));
  };

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  const handleFileChange = (e) => {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = [];
      const invalidFiles = [];

      selectedFiles.forEach(file => {
        if (allowedTypes.includes(file.type.toLowerCase())) {
          validFiles.push(file);
        } else {
          invalidFiles.push(file.name);
        }
      });

      if (invalidFiles.length > 0) {
        alert(`Os seguintes arquivos não são permitidos:\n${invalidFiles.join('\n')}`);
        clearFiles();
      }

      setImages(validFiles);
  };




  const clearFiles = () => {
    setImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = null; 
    }
  };

  const handlePostForm = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', postForm.title);
      formData.append('content', postForm.content);
      formData.append('tags', postForm.tags.join(','));

      for (const file of images) {
        formData.append('files', file); 
      }

      const response = await api.post('/posts/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(response.data);

      setPostForm({ title: '', tags: [], content: '' });
      clearFiles();
    } catch (e) {
      console.error(e);
      alert('Erro ao criar post');
    }
  };

  const checkLogged = async () => {
    try {
      await api.get('/validate');
      setAllowForm(true); 
    } catch (e) {
      alert("Você precisa estar logado para realizar uma postagem");
      setAllowForm(false);
    }
  };

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
                onChange={e => setPostForm({ ...postForm, title: e.target.value })}
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
                onChange={e => setPostForm({ ...postForm, content: e.target.value })}
                placeholder="Conteúdo do post"
                required
                rows={6}
              />
            </div>

            <div>
              <label>Imagens (.jpg/.png):</label><br />
              <input
                type="file"
                accept=".png, .jpg"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <button type="button" onClick={clearFiles}>Limpar arquivos</button>
            </div>

            <button type="submit">Criar Post</button>
          </form>
        </div>
      ) : (
        <button onClick={checkLogged}>Divulgar Adoção</button>
      )}
    </>
  );
}

export default CreatePost;
