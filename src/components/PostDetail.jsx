import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/PostDetail.module.css';
import { SlArrowUpCircle } from "react-icons/sl";
import { MdEdit, MdAddCircleOutline } from 'react-icons/md';
import { GoAlertFill } from "react-icons/go";
import { FaTrashAlt } from 'react-icons/fa';
import Comment from '../components/Comment';
import PostEditModal from './PostEditModal';
import DeleteModal from './DeleteModal';
import ReportModal from './ReportModal';
import refreshToken from './refreshToken';
import PaginationButton from './PaginationButton';
import LikeButton from './LikeButton';

const PostDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isReporting, setIsReporting] = useState(false);

    const [userName, setUser] = useState('');

    const [comments, setComments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const commentInput = useRef();

    function getAuthTokenFromLocalStorage() {
        return localStorage.getItem('accessToken');
    }

    //#region 토큰 갱신
    const handleTokenRefresh = useCallback(async (retryFunc, ...args) => {
        try {
            await refreshToken();
            const newToken = getAuthTokenFromLocalStorage();
            return await retryFunc(newToken, ...args);
        } catch (refreshError) {
            console.error('Token refresh error:', refreshError);
            throw new Error('토큰 갱신 중 오류가 발생했습니다.');
        }
    }, []);
    //#endregion

    //#region 댓글 가져오기
    const fetchComments = useCallback(async (page) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/posts/${id}/comments?page=${page}&size=10`);
            const { comments, pageInfo } = response.data.data;
            setComments(comments);
            setCurrentPage(pageInfo.pageNumber + 1);
            setTotalPages(pageInfo.totalPages);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }, [id]);

    //#endregion

    useEffect(() => {
        const fetchPostDetails = async (token = null) => {
            try {
                if (!token) {
                    token = getAuthTokenFromLocalStorage();
                }

                const config = {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                };

                const postResponse = await axios.get(`http://localhost:8080/api/posts/${id}`, config);

                const postData = postResponse.data.data;

                // 모든 상태 업데이트를 한 번에 처리
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

            } catch (error) {
                console.error('Error fetching post details:', error);
                if (error.response && error.response.status === 401) {
                    try {
                        const newToken = await handleTokenRefresh();
                        await fetchPostDetails(newToken);
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                        alert('인증에 실패했습니다. 다시 로그인해주세요.');
                    }
                } else {
                    alert('게시물을 불러오는데 실패했습니다.');
                }
            }
        };

        fetchPostDetails();
    }, [id, handleTokenRefresh]);

    useEffect(() => {
        fetchComments(currentPage);
    }, [currentPage, fetchComments]);


    //#region 댓글 작성

    const handleSendClick = async () => {
        const newComment = commentInput.current.value.trim();
        if (!newComment) return;

        try {
            await postComment(newComment);
            commentInput.current.value = "";
            await fetchComments(currentPage);
        } catch (error) {
            console.error('Error sending comment:', error);
            alert(error.message || '댓글 작성에 실패했습니다.');
        }
    };

    const postComment = async (content) => {
        const token = getAuthTokenFromLocalStorage();
        if (!token) {
            throw new Error('로그인이 필요합니다.');
        }
        console.log(post.like);
        console.log(post.likeCount);

        try {
            await sendCommentRequest(token, content);
        } catch (error) {
            if (error.response?.status === 401) {
                await handleTokenRefresh(sendCommentRequest, content);
            } else {
                throw error;
            }
        }
    };

    const sendCommentRequest = async (token, content) => {
        await axios.post(`http://localhost:8080/api/posts/${id}/comments`,
            { content },
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
    };

    //#endregion


    // 댓글 페이지 변경
    const handlePageChange = (newPage) => {
        if (newPage !== currentPage) {
            setCurrentPage(newPage);
        }
    };

    //#region 댓글 삭제
    const handleDeleteComment = async (commentId) => {
        try {
            console.log(commentId);
            await deleteComment(commentId);
            await fetchComments(currentPage);
            alert('댓글이 삭제되었습니다.');
        } catch (error) {
            console.error('Error deleting comment:', error);
            if (error.response?.status === 400) {
                alert('본인의 댓글만 삭제할 수 있습니다.');
            } else {
                alert('댓글 삭제에 실패했습니다.');
            }
        }
    };

    const deleteComment = async (commentId) => {
        const token = getAuthTokenFromLocalStorage();
        if (!token) {
            throw new Error('로그인이 필요합니다.');
        }

        try {
            await sendDeleteRequest(token, commentId);
        } catch (error) {
            if (error.response?.status === 401) {
                await handleTokenRefresh(sendDeleteRequest, commentId);
            } else {
                throw error;
            }
        }
    };

    const sendDeleteRequest = async (token, commentId) => {
        await axios.delete(`http://localhost:8080/api/comments/${commentId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    };

    //#endregion

    const handleLikeChange = (newLiked, newLikeCount) => {
        setPost(prevPost => ({
            ...prevPost,
            like: newLiked,
            likeCount: newLikeCount
        }));
    }

    //#region Modal handler

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

    //#endregion


    const handleSaveModal = async ({ category, title, content }) => {
        if (!title || !content || !category) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        try {
            const token = getAuthTokenFromLocalStorage();
            if (!token) {
                throw new Error('로그인이 필요합니다.');
            }

            await axios.put(`http://localhost:8080/api/posts/${id}`, { category, title, content }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setPost(prevState => ({
                ...prevState,
                title,
                content,
                category,
            }));
            alert(`게시물 수정 완료: ${title}`);
            setIsEditing(false);

        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await handleTokenRefresh(handleSaveModal, { category, title, content });
                } catch (refreshError) {
                    console.error('토큰 갱신 중 오류:', refreshError);
                    alert('토큰 갱신 중 오류가 발생했습니다. 다시 로그인해 주세요.');
                    window.location.href = '/login';
                }
            } else {
                console.error('Error saving post:', error);
                alert("게시물 수정에 실패했습니다.");
            }
        }
    };


    const handleConfirmDelete = async () => {
        setIsDeleting(false);

        try {
            const token = getAuthTokenFromLocalStorage();
            if (!token) {
                throw new Error('로그인이 필요합니다.');
            }

            await axios.delete(`http://localhost:8080/api/posts/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('게시물이 삭제되었습니다.');
            navigate('/community');

        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await handleTokenRefresh(handleConfirmDelete);
                } catch (refreshError) {
                    console.error('토큰 갱신 중 오류:', refreshError);
                    alert('토큰 갱신 중 오류가 발생했습니다. 다시 로그인해 주세요.');
                    window.location.href = '/login';
                }
            } else {
                console.error('Error deleting post:', error);
                alert("게시물 삭제에 실패했습니다.");
            }
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
                        <span className={styles.postTitle}>{post.title}</span>
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
                                <LikeButton
                                    postId={id}
                                    initialLiked={post.like}
                                    initialLikeCount={post.likeCount}
                                    onLikeChange={handleLikeChange}
                                />
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>작성자</span>
                                <p className={styles.infoContent}>{post.nickname}</p>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>내용</span>
                                <p className={styles.infoContent}>{post.content}</p>
                            </div>
                        </div>
                        <button className={styles.backButton} onClick={handleBoardClick}>게시판으로 돌아가기</button>
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
                            text={comment.content}
                            onDelete={() => handleDeleteComment(comment.id)}
                        />
                    ))}
                    <PaginationButton
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
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
