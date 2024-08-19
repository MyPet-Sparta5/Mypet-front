import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance, axiosNonAuthorization, handleApiCall } from '../setting/api';
import styles from '../styles/PostDetail.module.css';
import { SlArrowUpCircle } from "react-icons/sl";
import { MdEdit } from 'react-icons/md';
import { GoAlertFill } from "react-icons/go";
import { FaTrashAlt } from 'react-icons/fa';
import Comment from '../components/Comment';
import PostEditModal from './PostEditModal';
import DeleteModal from './DeleteModal';
import ReportModal from './ReportModal';
import PaginationButton from './PaginationButton';
import LikeButton from './LikeButton';

const getFromLocalStorage = key => localStorage.getItem(key);
const getAuthTokenFromLocalStorage = () => getFromLocalStorage('accessToken');
const getUserId = () => Number(getFromLocalStorage('userId'));
const getUserRole = () => getFromLocalStorage('userRole');


const PostDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isReporting, setIsReporting] = useState(false);

    const [comments, setComments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const userRole = getUserRole();
    const currentUserId = getUserId();

    const commentInput = useRef();

    //#region 댓글 가져오기
    const fetchComments = useCallback(async (page) => {
        try {
            const response = await handleApiCall(() => axiosNonAuthorization.get(`/api/posts/${id}/comments?page=${page}&size=10`), navigate);
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
        const fetchPostDetails = async () => {
            try {
                const token = getAuthTokenFromLocalStorage();

                let postResponse;
                if (token) { // 로그인 상태
                    postResponse = await handleApiCall(() => axiosInstance.get(`/api/posts/${id}`), navigate);
                } else if (!token) { // 비 로그인 상태
                    postResponse = await handleApiCall(() => axiosNonAuthorization.get(`/api/posts/${id}`), navigate);
                }

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
                alert('게시물을 불러오는데 실패했습니다.');
            }
        };

        fetchPostDetails();
    }, [id]);

    useEffect(() => {
        fetchComments(currentPage);
    }, [currentPage, fetchComments]);


    //#region 댓글 작성
    const handleSendClick = async () => {
        const newComment = commentInput.current.value.trim();
        if (!newComment) return;

        if (newComment.length > 255) {
            alert('댓글은 255자를 초과할 수 없습니다.');
            return;
        }

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
        try {
            await sendCommentRequest(content);
        } catch (error) {
            throw error;
        }
    };

    const sendCommentRequest = async (content) => {
        await handleApiCall(() => axiosInstance.post(`/api/posts/${id}/comments`,
            { content }
        ), navigate);
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
            await sendDeleteRequest(commentId);
        } catch (error) {
            throw error;
        }
    };

    const sendDeleteRequest = async (commentId) => {
        await handleApiCall(() => axiosInstance.delete(`/api/comments/${commentId}`), navigate);
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
    const handleEditClick = () => setIsEditing(true);
    const handleDeleteClick = () => setIsDeleting(true);
    const handleReportClick = () => setIsReporting(true);
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

            await handleApiCall(() => axiosInstance.put(`/api/posts/${id}`, { category, title, content }), navigate);

            setPost(prevState => ({
                ...prevState,
                title,
                content,
                category,
            }));
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
            const token = getAuthTokenFromLocalStorage();
            if (!token) {
                throw new Error('로그인이 필요합니다.');
            }

            await handleApiCall(() => axiosInstance.put(`/api/posts/${id}/delete`), navigate);

            alert('게시물이 삭제되었습니다.');
            navigate('/community');

        } catch (error) {
            console.error('Error deleting post:', error);
            alert("게시물을 삭제할 권한이 없습니다.");
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
            const token = getAuthTokenFromLocalStorage();
            if (!token) {
                throw new Error('로그인이 필요합니다.');
            }
            await handleApiCall(() => axiosInstance.post(
                `/api/reports/posts/${id}`, // 게시물 신고 엔드포인트
                { reportIssue: text }, // 신고 사유를 포함한 요청 본문
            ), navigate);

            alert('게시물 신고가 접수되었습니다.');
            navigate('/community'); // 신고 후 이동할 페이지
        } catch (error) {
            console.error("게시물 신고 중 오류:", error);
            alert("게시물 신고에 실패했습니다.");
        }
    };


    const handleBoardClick = () => {
        navigate(-1);
    };

    const isPostOwner = post && post.postUserId === currentUserId;

    const shouldShowEditIcon = userRole && isPostOwner;
    const shouldShowDeleteIcon = userRole && (userRole === "ROLE_ADMIN" || userRole === "ROLE_MANAGER" || isPostOwner);
    const shouldShowReportIcon = userRole && !(userRole === "ROLE_ADMIN" || userRole === "ROLE_MANAGER" || isPostOwner);
    const isLoggedIn = !!getAuthTokenFromLocalStorage();

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
                        <button className={styles.backButton} onClick={handleBoardClick}>뒤로 돌아가기</button>
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
                            placeholder={isLoggedIn ? "댓글 작성" : "로그인 후 작성 가능"}
                            ref={commentInput}
                            disabled={!isLoggedIn}
                        />
                        <SlArrowUpCircle
                            className={`${styles.sendIcon} ${!isLoggedIn ? styles.disabled : ''}`}
                            onClick={isLoggedIn ? handleSendClick : null}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PostDetail;