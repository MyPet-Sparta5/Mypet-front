import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './styles/App.css';
import IndexImage from './assets/index_picture.png'
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PostListPage from './pages/PostListPage';
import PostProvider from './context/PostContext';
import PostDetailPage from './pages/PostDetailPage';

function App() {
  return (
    <PostProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/community" element={<PostListPage />} />
            <Route path="/posts/:postId" element={<PostDetailPage />} />
            </Routes>
        </div>
      </Router>
    </PostProvider>
  );
}

function HomePage() {
  return (
    <div>
      <h1>나만, 펫</h1>
      <img src={IndexImage} alt="대표이미지" className="index-image" />
      </div>
  );
}

export default App;
