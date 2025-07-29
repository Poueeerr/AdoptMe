import { useEffect, useState } from "react"
import api from '../api'
import { useNavigate } from 'react-router-dom';

function AuthPage(){
    const [userDataLog, setUserDataLog] = useState({
        email: '',
        password: '',
    });
    const [userDataReg, setUserDataReg] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    });

    const nav = useNavigate();
    
    const isLogged = async () => {
        try {
            const response = await api.get('/validate');
            return !!response.data; 
        } catch (e) {
            console.log(e);
            return false;
        }
    };


    useEffect(() => {
        const checkLogin = async () => {
            const logged = await isLogged();
            if (logged) nav('/');
        };
        checkLogin();
    }, []);

    const loginFormValid = () => {
        const { email, password} = userDataLog;
        const fieldsFilled = [email, password].every(field => field.trim() !== '');
        return fieldsFilled;
    };

    const registerFormValid = () => {
        const { name, email,} = userDataReg;
        const fieldsFilled = [name, email].every(field => field.trim() !== '');
        return fieldsFilled;
    };

    const handleLogin = async (e) =>{
        e.preventDefault();
        try{
            if(!loginFormValid()){
                alert("Preencha todos os campos")
                return
            }
            const response = await api.post('/users/login', userDataLog);
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('name', response.data.name)
            nav('/')
        }catch(e){
            alert(e.message);
        }
    }   
     const handleRegister = async (e) =>{
        e.preventDefault();
        try{
            if(!registerFormValid()){
                alert("Preencha todos os campos")
                return
            }
            const response = await api.post('/users/register', userDataReg);
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('name', userDataReg.name)
            nav('/')
        }catch(e){
            alert(e.message);
        }
    }   
    
    
    return(
        <>
            <div>
                <form onSubmit={handleLogin}>                
                    <input type="email" value={userDataLog.email} onChange={(e) => 
                        setUserDataLog({...userDataLog, email: e.target.value})}
                        placeholder="Email"/>
                
                    <input type="password" value={userDataLog.password} onChange={(e) => 
                        setUserDataLog({...userDataLog, password: e.target.value})}
                        placeholder="Senha"/>
                    <button type="submit">Login</button>
                </form>
            </div>
            <div>
                <form onSubmit={handleRegister}>
                    <input type="text" value={userDataReg.name} onChange={(e) => 
                        setUserDataReg({...userDataReg, name: e.target.value})}
                        placeholder="Nome"/>
                  
                    <input type="email" value={userDataReg.email} onChange={(e) => 
                        setUserDataReg({...userDataReg, email: e.target.value})}
                        placeholder="Email"/>
                
                    <input type="password" value={userDataReg.password} onChange={(e) => 
                        setUserDataReg({...userDataReg, password: e.target.value})}
                        placeholder="Senha"/>

                    <input type="text" value={userDataReg.phone} onChange={(e) => 
                        setUserDataReg({...userDataReg, phone: e.target.value})}
                        placeholder="Telefone"/>
                    
                    <button type="submit">Registrar</button>
                </form>
            </div>
        </>
    )
}

export default AuthPage