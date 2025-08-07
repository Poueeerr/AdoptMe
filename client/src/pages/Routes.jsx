import { Routes, Route } from "react-router-dom";
import Adotar from "./AdoptPage";
import Layout from "../layout/layout";
import AuthPage from "./AuthPage";
import CreatePostPage from "./CreatePostPage";
import Home from "./HomePage";
import ProtectedRoute from "./ProtectedRoutes";
import DisplayMyPosts from "../components/DisplayMyPosts";
import ProfilePage from "./ProfilePage";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/divulgar"
          element={
            <ProtectedRoute>
              <CreatePostPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userposts"
          element={
            <ProtectedRoute>
              <DisplayMyPosts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="/adotar" element={<Adotar />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
