import React, { useContext, useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PostContext } from '../context/PostContext';
import { FaRegHeart, FaHeart, FaArrowLeft } from 'react-icons/fa'; // 빈 하트와 채워진 하트 아이콘
import { MdEdit, MdAddCircleOutline } from 'react-icons/md';
import { GoAlertFill } from "react-icons/go";
import { FaTrashAlt } from 'react-icons/fa';
import ImageSlider from "./ImageSlider";
import PostEditModal from './PostEditModal';
import '../styles/PetCardPost.css';
import styles from '../styles/PostDetail.module.css';

const PetCardPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const posts = useContext(PostContext);
  const post = posts.find(p => p.id === parseInt(id));
  const [liked, setLiked] = useState(false); // 좋아요 상태
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userName, setUser] = useState('');
  const [category, setCategory] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setCategory(post.category);
      setUser(post.nickname);
      setFileUrl(post.fileUrls);
    }
  }, [post]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
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
          <FaTrashAlt className={styles.deleteIcon} title="게시물 삭제" />
          <GoAlertFill className={styles.reportIcon} title="해당 게시물 유저 신고" />
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
    </div>
  );
}

export default PetCardPost;