import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaRegHeart, FaHeart, FaArrowLeft } from 'react-icons/fa'; // 빈 하트와 채워진 하트 아이콘
import { MdEdit, MdAddCircleOutline } from 'react-icons/md';
import { GoAlertFill } from "react-icons/go";
import { FaTrashAlt } from 'react-icons/fa';
import ImageSlider from "./ImageSlider";
import PostEditModal from './PostEditModal';
import DeleteModal from './DeleteModal';
import '../styles/PetCardPost.css';
import styles from '../styles/PostDetail.module.css';
import ReportModal from './ReportModal';

const PetCardPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false); // 좋아요 상태
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userName, setUser] = useState('');
  const [category, setCategory] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/posts/${id}`);
        const postData = response.data;
        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
        setCategory(postData.category);
        setUser(postData.nickname);
        setFileUrl(postData.fileUrls);
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
    //api 연동
    setTitle(title);
    setContent(content);
    setCategory(category);
    alert(`게시물 수정 완료: ${title}`);
    setIsEditing(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(false);
    try {
      //api 연동
      alert('게시물이 삭제되었습니다.');
      navigate('/community'); // 삭제 후 보드로 돌아가기
    } catch (error) {
      console.error("게시물 삭제 중 오류:", error);
      alert("게시물 삭제에 실패했습니다.");
    }
  };

  const handleReportModal = () => {
    setIsReporting(false);
    try {
      //api 연동
      alert('유저 신고가 접수되었습니다.');
      navigate('/community'); // 신고 후 보드로 돌아가기
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
      <ImageSlider postId={parseInt(id)} />
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
          )} <strong> {post.likes} </strong> likes
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
          userName={userName} //이부분은 api 연동할때 userId로 수정해주세요.
          onClose={handleCloseModal}
          onSave={handleReportModal}
          confirmText="삭제"
        />
      )}
    </div>
  );
}

export default PetCardPost;