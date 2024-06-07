import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import Editor from "./pages/editor.pages";
import Homepage from "./pages/home.page";
import SearchPage from "./pages/search.page";
import PageNotFound from "./pages/404.page";
import ProfilePage from "./pages/profile.page";
import BlogPage from "./pages/blog.page";
import Settings from "./components/settings.component";
import ChangePassword from "./pages/change-password.page";
import EditProfile from "./pages/edit-profile.page";
import Notifications from "./pages/notifications.page";
import ManageBlogs from "./pages/manage-blogs.page";
import UserBlogs from "./components/UserBlogs";

const App = () => {
    return (
        <Routes>
            <Route path="/editor" element={<Editor />} />
            <Route path="/editor/:blog_id" element={<Editor />} />
            <Route path="/" element={<Navbar />}>
                <Route index element={<Homepage />} />
                    
                <Route path="notifications" element={<Notifications />} />

                <Route path="blogs" element={<ManageBlogs />}>
                    <Route path="published-blogs" element={<UserBlogs blogType={"published"}/>} />
                    <Route path="draft-blogs" element={<UserBlogs blogType={"draft"}/>} />
                </Route>

                <Route path="settings" element={<Settings />}>
                    <Route path="edit-profile" element={<EditProfile />} />
                    <Route path="change-password" element={<ChangePassword />} />
                </Route>
                
                <Route path="/signin" element={<UserAuthForm type="sign-in" />} />
                <Route path="/signup" element={<UserAuthForm type="sign-up" />} />
                <Route path="search/:query" element={<SearchPage />} />
                <Route path="user/:id" element={<ProfilePage />} />
                <Route path="blog/:blog_id" element={<BlogPage />} />
                <Route path="*" element={<PageNotFound />} />
            </Route>

        </Routes>
    )
}

export default App;