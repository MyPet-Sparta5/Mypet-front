import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/PostDetail.module.css';
import { SlArrowUpCircle } from "react-icons/sl";
import { FaRegHeart, FaHeart } from 'react-icons/fa'; // 빈 하트와 채워진 하트 아이콘
import { MdEdit, MdAddCircleOutline } from 'react-icons/md';
import { GoAlertFill } from "react-icons/go";
import { FaTrashAlt } from 'react-icons/fa';
import Comment from '../components/Comment';
import PostEditModal from './PostEditModal';
import DeleteModal from './DeleteModal';
import ReportModal from './ReportModal';

const PostDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]); // 댓글 상태를 빈 배열로 초기화
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isReporting, setIsReporting] = useState(false);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [userName, setUser] = useState('');
    const [liked, setLiked] = useState(false); // 좋아요 상태

    const commentInput = useRef();

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                // 게시물 세부 정보 가져오기
                const postResponse = await axios.get(`http://localhost:8080/api/posts/${id}`);
                const postData = postResponse.data.data;
                setPost(postData);
                setTitle(postData.title);
                setContent(postData.content);
                setCategory(postData.category);
                setUser(postData.nickname);
                setLiked(postData.like);
                // 댓글은 일단 API 연동하지 않음, 빈 배열로 초기화
            } catch (error) {
                console.error('Error fetching post details:', error);
            }
        };

        fetchPostDetails();
    }, [id]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleDeleteClick = () => {
        setIsDeleting(true);
    };

    const handleReportClick = () => {
        setIsReporting(true);
    };

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

    const handleSendClick = () => {
        const newComment = commentInput.current.value.trim();
        if (newComment) {
            setComments([...comments, { text: newComment }]); // 댓글 추가
            commentInput.current.value = "";
        }
    };

    const handleDeleteComment = (index) => {
        setComments(comments.filter((_, i) => i !== index));
    };

    const toggleLike = async () => {
        try {
            await axios.post(`http://localhost:8080/api/posts/${id}/like`, {}, {
                headers: {
                    'Authorization': 'Bearer your-auth-token' // 실제 토큰으로 대체
                }
            });
            setLiked(!liked);
        } catch (error) {
            console.error('Error toggling like:', error);
            alert('좋아요 처리에 실패했습니다.');
        }
    };

    const handleBoardClick = () => {
        navigate('/community');
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
                            <MdEdit className={styles.editIcon} onClick={handleEditClick} title="게시물 수정" />
                            <FaTrashAlt className={styles.deleteIcon} onClick={handleDeleteClick} title="게시물 삭제" />
                            <GoAlertFill className={styles.reportIcon} onClick={handleReportClick} title="해당 게시물 유저 신고" />
                        </div>
                    </div>
                    <div className={styles.postBody}>
                        <div className={styles.postInfo}>
                            <div className={styles.dateLike}>
                                <span>{new Date(post.createAt).toLocaleDateString()}</span>
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
                                    )} <strong> {post.likeCount} </strong> likes
                                </div>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>작성자</span>
                                <p className={styles.infoContent}>{post.nickname}</p>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>내용</span>
                                <p className={styles.infoContent}>{content}</p>
                            </div>
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
                            userName={userName}
                            onClose={handleCloseModal}
                            onSave={handleReportModal}
                            confirmText="신고"
                        />
                    )}
                </div>
                <div className={styles.commentsSection}>
                    <h3>댓글</h3>
                    {comments.map((comment, index) => (
                        <Comment
                            key={index}
                            text={comment.text}
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
