import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { GoAlertFill } from "react-icons/go";
import { FaTrashAlt } from 'react-icons/fa';
import ImageSlider from "./ImageSlider";
import PostEditModal from './PostEditModal';
import DeleteModal from './DeleteModal';
import ReportModal from './ReportModal';
import styles from '../styles/PostDetail.module.css';
import '../styles/PetCardPost.css';
import RefreshToken from './RefreshToken';
import LikeButton from './LikeButton';

const getFromLocalStorage = key => localStorage.getItem(key);
const getAuthToken = () => getFromLocalStorage('accessToken');
const getUserId = () => Number(getFromLocalStorage('userId'));
const getUserRole = () => getFromLocalStorage('userRole');

const PetCardPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [fileUrls, setFileUrls] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  const userRole = getUserRole();
  const currentUserId = getUserId();

  useEffect(() => {
    const fetchPost = async (token = null) => {
      try {
        if (!token) {
          token = getAuthToken();
        }
        const config = {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        };

        const postResponse = await axios.get(`http://localhost:8080/api/posts/${id}`, config);

        const postData = postResponse.data.data;

        setPost(prevState => ({
          ...prevState,
          ...postData,
          title: postData.title,
          content: postData.content,
          category: postData.category,
          nickname: postData.nickname,
          like: postData.like,
          likeCount: postData.likeCount
        }));

        setFileUrls(postData.files && postData.files.length > 0
          ? postData.files.map(file => file.url)
          : []);
      } catch (error) {
        console.error('Error fetching post:', error);
        if (error.response?.status === 401 && error.response.data.data === 'Expired-Token') {
          await handleTokenRefresh();
        }
      }
    };

    fetchPost();
  }, [id]);

  const handleTokenRefresh = async () => {
    try {
      await RefreshToken(navigate); // 리프레시 토큰으로 액세스 토큰 갱신
      window.location.reload(); // 페이지 새로고침하여 원래 요청 재시도
    } catch (refreshError) {
      console.error('Token refresh error:', refreshError);
    }
  };

  const handleEditClick = () => setIsEditing(true);
  const handleDeleteClick = () => setIsDeleting(true);
  const handleReportClick = () => setIsReporting(true);
  const handleCloseModal = () => {
    setIsEditing(false);
    setIsDeleting(false);
    setIsReporting(false);
  };

  const handleSaveModal = async ({ category, title, content }) => {
    if (!title || !content || !category) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const updatePost = async (token) => {
      await axios.put(`http://localhost:8080/api/posts/${id}`, { category, title, content }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    };

    const handleUpdatePost = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error('로그인이 필요합니다.');
        }

        await updatePost(token);

        setPost(prevState => ({
          ...prevState,
          title,
          content,
          category,
        }));
        alert(`게시물 수정 완료: ${title}`);
        setIsEditing(false);
      } catch (error) {
        if (error.response?.status === 401 && error.response.data.data === 'Expired-Token') {
          try {
            await RefreshToken(navigate);
            await handleUpdatePost();
          } catch (refreshError) {
            console.error('Token refresh error:', refreshError);
          }

        } else {
          console.error('Error saving post:', error);
          alert("게시물 수정에 실패했습니다.");
        }
      }
    };

    await handleUpdatePost();
  };


  const handleConfirmDelete = async () => {
    setIsDeleting(false);

    try {
      const token = getAuthToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      await axios.delete(`http://localhost:8080/api/posts/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      alert('게시물이 삭제되었습니다.');
      navigate('/community');

    } catch (error) {
      if (error.response?.status === 401 && error.response.data.data === 'Expired-Token') {
        await handleTokenRefresh();
      } else {
        console.error("게시물 삭제 중 오류:", error);
        alert("게시물을 삭제할 권한이 없습니다.");
      }
    }
  };


  const handleReportModal = async ({ text }) => {
    setIsReporting(false);

    // 현재 포스트의 작성자 ID를 가져오기
    const postUserId = post.postUserId;

    if (currentUserId === postUserId) {
      alert('자신의 게시물을 신고할 수 없습니다.');
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      await axios.post(`http://localhost:8080/api/reports/users/${postUserId}`,
        { reportIssue: text }, // 신고 사유를 포함한 요청 본문
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      alert('유저 신고가 접수되었습니다.');
      navigate('/community');
    } catch (error) {
      if (error.response?.status === 401 && error.response.data.data === 'Expired-Token') {
        try {
          await RefreshToken(navigate);
          await handleReportModal();
        } catch (refreshError) {
          console.error('Token refresh error:', refreshError);
        }
      } else {
        console.error("유저 신고 중 오류:", error);
        alert("유저 신고에 실패했습니다.");
      }
    }
  };

  const handleLikeChange = (newLiked, newLikeCount) => {
    setPost(prevPost => ({
      ...prevPost,
      like: newLiked,
      likeCount: newLikeCount
    }));
  }

  const handleBoardClick = () => {
    navigate('/gallery');
  };

  const isPostOwner = post && post.postUserId === currentUserId;

  const shouldShowEditIcon = userRole && isPostOwner;
  const shouldShowDeleteIcon = userRole && (userRole === "ROLE_ADMIN" || userRole === "ROLE_MANAGER" || isPostOwner);
  const shouldShowReportIcon = userRole &&  !(userRole === "ROLE_ADMIN" || userRole === "ROLE_MANAGER" || isPostOwner);


  if (!post) {
    return <div>게시물을 찾을 수 없습니다.</div>;
  }


  return (
    <div className="card">
      <div className="card-header">
        <div>
          <FaArrowLeft className="backButton" onClick={handleBoardClick} />
          <span className="card-title">{post.title}</span>
        </div>
        <div className={styles.icons}>
          {shouldShowEditIcon && (
            <MdEdit className={styles.editIcon} onClick={handleEditClick} title="게시물 수정" />
          )}
          {shouldShowDeleteIcon && (
            <FaTrashAlt className={styles.deleteIcon} onClick={handleDeleteClick} title="게시물 삭제" />
          )}
          {shouldShowReportIcon && (
            <GoAlertFill className={styles.reportIcon} onClick={handleReportClick} title="해당 게시물 유저 신고" />
          )}
        </div>
      </div>
      {/* 파일이 있는 경우에만 ImageSlider를 렌더링합니다. */}
      {fileUrls.length > 0 && <ImageSlider fileUrls={fileUrls} />}
      <div className="card-content">
        <p>{post.content}</p>
      </div>
      <div className="card-footer">
        <LikeButton
          postId={id}
          initialLiked={post.like}
          initialLikeCount={post.likeCount}
          onLikeChange={handleLikeChange}
        />
      </div>
      {isEditing && (
        <PostEditModal
          title={post.title}
          content={post.content}
          category={post.category}
          onSave={handleSaveModal}
          onClose={handleCloseModal}
        />
      )}
      {isDeleting && (
        <DeleteModal
          title="게시물 삭제"
          content={<div><strong>"{post.title}"</strong><br />해당 게시물을 정말로 삭제하시겠습니까?</div>}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          confirmText="삭제"
        />
      )}
      {isReporting && (
        <ReportModal
          userName={post.nickname}
          content={<div><strong>"{post.nickname}"</strong> 유저 신고를 원하시나요? <br /> 아래 사유를 작성해주세요.</div>}
          onClose={handleCloseModal}
          onSave={handleReportModal}
        />
      )}
    </div>
  );
}

export default PetCardPost;