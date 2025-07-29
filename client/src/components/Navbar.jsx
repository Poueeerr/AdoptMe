import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
    const [name, setName] = useState("");
    const [hasName, setHasName] = useState(false);

    useEffect (()=>{
        if(localStorage.getItem('name')){
            setName(localStorage.getItem('name'))
            setHasName(true)
        }else{
            setHasName(false);
        }
    },[])
    return (
        <nav>
            <div>    
                <Link to="/">Home</Link> 
                {hasName ? <p>Bem vindo(a) {name}</p> : <Link to="/auth">Não tem uma conta? Cadastre-se</Link> }
            </div>
        </nav>
    );
}

export default Navbar;
