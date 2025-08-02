import { Routes, Route } from "react-router-dom";
import Adotar from "./AdoptPage";
import Layout from "../layout/layout";
import AuthPage from "./AuthPage";
import CreatePostPage from "./CreatePostPage";
import Home from "./HomePage";

function AppRoutes(){
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<Home/>} />
                <Route path="/auth" element={<AuthPage/>}/>
                <Route path="/divulgar" element={<CreatePostPage/>}/>
                <Route path="/adotar" element={<Adotar/>}/>
                
            </Route>
        </Routes>
    );
}

export default AppRoutes;
