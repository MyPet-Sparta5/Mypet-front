import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import IndexImage from './assets/index_picture.png';
import Header from './components/Header';
import AdminHeader from './components/AdminHeader';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PostListPage from './pages/PostListPage';
import PostDetailPage from './pages/PostDetailPage';
import PetCardPostPage from './pages/PetCardPostPage';
import FacilityFinderPage from './pages/FacilityFinderPage';
import AdminUserListPage from './pages/Admin/AdminUserListPage';
import AdminReportListPage from './pages/Admin/AdminReportListPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 메인 애플리케이션 경로 */}
          <Route path="/" element={<><Header /><HomePage /></>} />
          <Route path="/login" element={<><Header /><LoginPage /></>} />
          <Route path="/signup" element={<><Header /><SignupPage /></>} />
          <Route path="/community" element={<><Header /><PostListPage category="DEFAULT" /></>} />
          <Route path="/gallery" element={<><Header /><PostListPage category="BOAST" /></>} />
          <Route path="/freedom" element={<><Header /><PostListPage category="FREEDOM" /></>} />
          <Route path="/pet/:id" element={<><Header /><PetCardPostPage /></>} />
          <Route path="/posts/:id" element={<><Header /><PostDetailPage /></>} />
          <Route path="/facility-finder" element={<><Header /><FacilityFinderPage /></>} />

          {/* 백오피스 경로 */}
          <Route path="/admin/*" element={<><AdminHeader /><Routes>
            <Route path="users-manager" element={<AdminUserListPage />} />
            <Route path="reports-view" element={<AdminReportListPage />} />
          </Routes></>} />
        </Routes>
      </div>
    </Router>
  );
}

// 홈 페이지
function HomePage() {
  return (
    <div>
      <h1>나만, 펫</h1>
      <img src={IndexImage} alt="대표이미지" className="index-image" />
    </div>
  );
}

export default App;
