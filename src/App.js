import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import IndexImage from './assets/index_picture.png'
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PostListPage from './pages/PostListPage';
import PostDetailPage from './pages/PostDetailPage';
import PetCardPostPage from './pages/PetCardPostPage';
import FacilityFinderPage from './pages/FacilityFinderPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/community" element={<PostListPage />} />
          <Route path="/pet/:id" element={<PetCardPostPage />} />
              <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/facility-finder" element={<FacilityFinderPage />} />
          </Routes>
      </div>
    </Router>
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
