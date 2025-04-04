import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/animations.css';
import Navbar from './components/layout/Navbar';
import Home from './components/Home';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Blogs from './components/blog/Blogs';
import BlogDetail from './components/blog/BlogDetail';
import CreateBlog from './components/blog/CreateBlog';
import EditBlog from './components/blog/EditBlog';
import Profile from './components/profile/Profile';
import ChangePassword from './components/auth/ChangePassword';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="page-transition" style={{ paddingTop: '76px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/change-password"
                element={
                  <PrivateRoute>
                    <ChangePassword />
                  </PrivateRoute>
                }
              />
              <Route
                path="/create-blog"
                element={
                  <PrivateRoute>
                    <CreateBlog />
                  </PrivateRoute>
                }
              />
              <Route
                path="/edit-blog/:id"
                element={
                  <PrivateRoute>
                    <EditBlog />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
