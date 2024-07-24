import React, { useContext, useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PostContext } from '../context/PostContext';
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
    const posts = useContext(PostContext);
    const post = posts.find(p => p.id === parseInt(id));
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isReporting, setIsReporting] = useState(false);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [userName, setUser] = useState('');
    //이부분 api 연동할때 userId도 추가해서 아래 nickname으로 보내는 부분에도 추가

    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setContent(post.content);
            setCategory(post.category);
            setUser(post.nickname);
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
                            <MdEdit className={styles.editIcon} onClick={handleEditClick} title="게시물 수정" />
                            <FaTrashAlt className={styles.deleteIcon} onClick={handleDeleteClick} title="게시물 삭제" />
                            <GoAlertFill className={styles.reportIcon} onClick={handleReportClick} title="해당 게시물 유저 신고" />
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
                                    )} <strong> {post.likes} </strong> likes
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
                            userName={userName} //이부분은 api 연동할때 userId로 수정해주세요.
                            onClose={handleCloseModal}
                            onSave={handleReportModal}
                            confirmText="삭제"
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
