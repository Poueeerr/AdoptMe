import { useState } from "react";
import CreatePost from "../components/CreatePost";
import DisplayPosts from "../components/DisplayPosts";
import { useEffect } from "react";
import api from "../api";

function Home() {
  const [pageAtual, setPageAtual] = useState();
  const [pageSize, setPageSize] = useState();

  useEffect(()=>{
    async function getPageSize(){
      const response = await api.get('/posts/postSize');
      setPageSize(response.data); 
      setPageAtual(1)
    }
    getPageSize()
  }, []);

  return (
    <>
    <div>
      <CreatePost/>
    </div>
    <div>
      <DisplayPosts page={pageAtual}/>
    </div>
    
    {/* Fazer footer */}
    <div style={{display: "flex", flexDirection: "row", gap: "10px" }}>
     {Array.from({ length: pageSize }, (_, index) => (
        <div
          key={index+1}
          style={{ cursor: "pointer"}}
          onClick={() => setPageAtual(index+1)}
        >
          {index+1}
        </div>
      ))}
  
    </div>    
    </>
  );
}

export default Home;
