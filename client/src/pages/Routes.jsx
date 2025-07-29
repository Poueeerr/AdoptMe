import { Routes, Route } from "react-router-dom";
import App from "./HomePage";
import Layout from "../layout/layout";
import AuthPage from "./AuthPage";

function AppRoutes(){
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<App/>} />
                <Route path="/auth" element={<AuthPage/>}/>
            </Route>
        </Routes>
    );
}

export default AppRoutes;
