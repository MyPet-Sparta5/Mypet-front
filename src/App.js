import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
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

const MainLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

// Admin 페이지 헤더 지정
const AdminLayout = () => (
  <>
    <AdminHeader />
    <Outlet />
  </>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 메인 애플리케이션 경로 */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/community" element={<PostListPage category="DEFAULT" />} />
            <Route path="/gallery" element={<PostListPage category="BOAST" />} />
            <Route path="/freedom" element={<PostListPage category="FREEDOM" />} />
            <Route path="/pet/:id" element={<PetCardPostPage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/facility-finder" element={<FacilityFinderPage />} />
          </Route>

          {/* 백오피스 경로 */}
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="users-manager" element={<AdminUserListPage />} />
            <Route path="reports-view" element={<AdminReportListPage />} />
          </Route>
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
