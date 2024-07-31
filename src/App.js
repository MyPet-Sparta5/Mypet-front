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
import ProfilePage from './pages/ProfilePage';
import MyPostListPage from './pages/MyPostListPage';
import AccessDeniedPage from './pages/AccessDeniedPage';
import ProtectedRoute from './ProtectedRoute';

const MainLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

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
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-post-list/:email" element={<MyPostListPage />} />
            <Route path="/access-denied" element={<AccessDeniedPage />} />
          </Route>

          {/* 백오피스 경로 */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_MANAGER']} />}>
            <Route element={<AdminLayout />}>
              <Route path="user-list" element={<AdminUserListPage />} />
              <Route path="report-list" element={<AdminReportListPage />} />
            </Route>
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
