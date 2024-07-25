import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaRegHeart, FaHeart, FaArrowLeft } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { GoAlertFill } from "react-icons/go";
import { FaTrashAlt } from 'react-icons/fa';
import ImageSlider from "./ImageSlider";
import PostEditModal from './PostEditModal';
import DeleteModal from './DeleteModal';
import ReportModal from './ReportModal';
import styles from '../styles/PostDetail.module.css';
import '../styles/PetCardPost.css';

const PetCardPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userName, setUser] = useState('');
  const [category, setCategory] = useState('');
  const [fileUrls, setFileUrls] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/posts/${id}`);
        const postData = response.data.data;
        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
        setCategory(postData.category);
        setUser(postData.nickname);
        setFileUrls(postData.files && postData.files.length > 0 
          ? postData.files.map(file => file.url)
          : []);
        setLiked(postData.like);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    setIsDeleting(true);
  };

  const handleReportClick = () => {
    setIsReporting(true);
  }

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
    try {
      await axios.put(`http://localhost:8080/api/posts/${id}`, { category, title, content }, {
        headers: {
          'Authorization': 'Bearer your-auth-token' // 실제 토큰으로 대체
        }
      });
      setTitle(title);
      setContent(content);
      setCategory(category);
      alert(`게시물 수정 완료: ${title}`);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving post:', error);
      alert("게시물 수정에 실패했습니다.");
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(false);
    try {
      await axios.delete(`http://localhost:8080/api/posts/${id}`, {
        headers: {
          'Authorization': 'Bearer your-auth-token' // 실제 토큰으로 대체
        }
      });
      alert('게시물이 삭제되었습니다.');
      navigate('/community');
    } catch (error) {
      console.error("게시물 삭제 중 오류:", error);
      alert("게시물 삭제에 실패했습니다.");
    }
  };

  const handleReportModal = async () => {
    setIsReporting(false);
    try {
      await axios.post('http://localhost:8080/api/report', { userId: userName }, {
        headers: {
          'Authorization': 'Bearer your-auth-token' // 실제 토큰으로 대체
        }
      });
      alert('유저 신고가 접수되었습니다.');
      navigate('/community');
    } catch (error) {
      console.error("유저 신고 중 오류:", error);
      alert("유저 신고에 실패했습니다.");
    }
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  const handleBoardClick = () => {
    navigate('/community');
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <FaArrowLeft className="backButton" onClick={handleBoardClick} />
          <span className="card-title">{title}</span>
        </div>
        <div className={styles.icons}>
          <MdEdit className={styles.editIcon} onClick={handleEditClick} title="게시물 수정" />
          <FaTrashAlt className={styles.deleteIcon} onClick={handleDeleteClick} title="게시물 삭제" />
          <GoAlertFill className={styles.reportIcon} onClick={handleReportClick} title="해당 게시물 유저 신고" />
        </div>
      </div>
      {/* 파일이 있는 경우에만 ImageSlider를 렌더링합니다. */}
      {fileUrls.length > 0 && <ImageSlider fileUrls={fileUrls} />}
      <div className="card-content">
        <p>{content}</p>
      </div>
      <div className="card-footer">
        <div className="likes-container">
          {liked ? (
            <FaHeart
              className={`${styles.likeIcon} ${styles.liked}`}
              onClick={toggleLike}
            />
          ) : (
            <FaRegHeart
              className={styles.likeIcon}
              onClick={toggleLike}
            />
          )} <strong> {post && post.likeCount} </strong> likes
        </div>
      </div>
      {isEditing && (
        <PostEditModal
          title={title}
          content={content}
          category={category}
          onSave={handleSaveModal}
          onClose={handleCloseModal}
        />
      )}
      {isDeleting && (
        <DeleteModal
          title="게시물 삭제"
          content={<div><strong>"{title}"</strong><br />해당 게시물을 정말로 삭제하시겠습니까?</div>}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          confirmText="삭제"
        />
      )}
      {isReporting && (
        <ReportModal
          content={<div><strong>"{userName}"</strong> 유저 신고를 원하시나요? <br /> 아래 사유를 작성해주세요.</div>}
          userName={userName} // 이부분은 API 연동할 때 userId로 수정해주세요.
          onClose={handleCloseModal}
          onSave={handleReportModal}
          confirmText="신고"
        />
      )}
    </div>
  );
}

export default PetCardPost;
