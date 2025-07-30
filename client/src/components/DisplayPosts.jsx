import { useState, useEffect } from "react";
import api from "../api";

function DisplayPosts({ page }) {
  const [posts, setPosts] = useState([]);
  const [contacts, setContacts] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/posts/getPage/${page}`);
        setPosts(response.data);
      } catch (e) {
        console.log(e);
      }
    }
    if (page) {
      fetchData();
    }
  }, [page]);

  const handleGetUserContact = async (id) => {
    try {
    if(await checkLogged()){
        const response = await api.get(`/posts/getUserInfo/${id}`);
        setContacts((prev) => ({ ...prev, [id]: response.data.author.phone }));
    }else{
        alert("Você precisa estar logado para entrar em contato")
    }
    } catch (e) {
      console.log(e);
    }
  };

    const checkLogged = async () => {
        try {
            await api.get('/validate');
            return true; 
        } catch (e) {
            return false;
        }
    };

  return (
    <div>
      {posts.map((post, index) => (
        <div key={index}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>

          {post.imagesUrl?.map((image, i) => (
            <img
              key={i}
              src={`http://localhost:3000/${image}`}
              alt={`Imagem ${i + 1} do post`}
            />
          ))}

          <button onClick={() => handleGetUserContact(post.id)}>
            Entrar em contato
          </button>

          {contacts[post.id] && (
            <p>Telefone para contato: {contacts[post.id]}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default DisplayPosts;
