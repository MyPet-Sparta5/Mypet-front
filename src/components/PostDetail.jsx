import React, { useContext, useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PostContext } from '../context/PostContext';
import styles from '../styles/PostDetail.module.css';
import { SlArrowUpCircle } from "react-icons/sl";
import { FaRegHeart, FaHeart } from 'react-icons/fa'; // 빈 하트와 채워진 하트 아이콘
import { MdEdit, MdAddCircleOutline } from 'react-icons/md';
import { FaTrashAlt } from 'react-icons/fa';
import Comment from '../components/Comment';
import PostEditModal from './PostEditModal';

const PostDetail = () => {
    const navigate = useNavigate();
    const { postId } = useParams();
    const posts = useContext(PostContext);
    const post = posts.find(p => p.id === parseInt(postId));
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setContent(post.content);
            setCategory(post.category);
        }
    }, [post]);

    const [comments, setComments] = useState([
        "api 연동 후 가져온 댓글 리스트로 생성 해야 함",
        "댓글2",
        "댓글3"
    ]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleDeleteClick = () => {
        setIsDeleting(true);
    };

    const handleCloseModal = () => {
        setIsEditing(false);
        setIsDeleting(false);
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

    const [liked, setLiked] = useState(false); // 좋아요 상태

    const commentInput = useRef();

    const handleSendClick = () => {
        const newComment = commentInput.current.value.trim();
        if (newComment) {
            setComments([...comments, newComment]);
            commentInput.current.value = "";
        }
    };

    const handleDeleteComment = (index) => {
        setComments(comments.filter((_, i) => i !== index));
    };

    const handleBoardClick = () => {
        navigate('/community');
    };

    const toggleLike = () => {
        setLiked(!liked);
    };

    if (!post) {
        return <div>게시물을 찾을 수 없습니다.</div>;
    }

    return (
        <div className={styles.container}>
            <main className={styles.mainContent}>
                <div className={styles.postDetail}>
                    <div className={styles.postHeader}>
                        <span className={styles.postTitle}>{title}</span>
                        <div className={styles.icons}>
                            <MdEdit className={styles.editIcon} onClick={handleEditClick} />
                            <FaTrashAlt className={styles.deleteIcon} onClick={handleDeleteClick} />
                        </div>
                    </div>
                    <div className={styles.postBody}>
                        <div className={styles.postInfo}>
                            <div className={styles.dateLike}>
                                {/* <p><strong>카테고리</strong> {post.category}</p> */}
                                <span>{post.createdTime}</span>
                                <div>
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
                                    )} <strong> {post.likes} </strong> likes </div>
                            </div>
                            <p><strong>작성자</strong> {post.nickname}</p>
                            <p><strong>내용</strong> {content}</p>
                        </div>
                        <button className={styles.backButton} onClick={handleBoardClick}>게시판으로 돌아가기</button>
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
                <div className={styles.commentsSection}>
                    <h3>댓글</h3>
                    {comments.map((comment, index) => (
                        <Comment
                            key={index}
                            text={comment}
                            onDelete={() => handleDeleteComment(index)}
                        />
                    ))}
                    <div className={styles.commentInputContainer}>
                        <input
                            className={styles.commentInput}
                            placeholder="댓글 작성"
                            ref={commentInput}
                        />
                        <SlArrowUpCircle className={styles.sendIcon} onClick={handleSendClick} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PostDetail;
