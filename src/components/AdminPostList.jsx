import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance, handleApiCall } from '../setting/api';
import styles from '../styles/PostList.module.css';
import PaginationButton from './PaginationButton';
import PostStatusModal from './PostStatusModal';

const AdminPostList = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const postsPerPage = 10;

    useEffect(() => {
        fetchPosts(currentPage, statusFilter);
    }, [currentPage, statusFilter]);

    const fetchPosts = async (page, status) => {
        try {
            const response = await handleApiCall(() => axiosInstance.get('/api/admin/post-manage', {
                params: {
                    page: currentPage,
                    pageSize: postsPerPage,
                    sortBy: 'createdAt,desc',
                    postStatus: status
                }
            }), navigate);
            const { content, totalPages } = response.data.data;
            setPosts(transformPostData(content));
            setTotalPages(totalPages);
        } catch (error) {
            console.error("Failed to fetch posts", error);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const navigateToPost = (post) => {
        const targetPath = post.category === '자랑하기' ? `/pet/${post.id}` : `/posts/${post.id}`;
        navigate(targetPath);
    };

    const openStatusModal = (post) => {
        setSelectedPost(post);
        setIsStatusModalOpen(true);
    };

    const handleStatusSave = async (newStatus) => {
        try {
            await handleApiCall(() => axiosInstance.put(`/api/admin/post-manage/${selectedPost.id}/post-status`, {
                postStatus: newStatus
            }), navigate);
            setIsStatusModalOpen(false);
            fetchPosts(currentPage, statusFilter);
        } catch (error) {
            console.error("Failed to update post status", error);
            alert("동일 상태로는 변경이 불가능합니다.");
        }
    };

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
        setCurrentPage(1);
    };

    const transformPostData = (data) => {
        const categoryMapping = {
            "BOAST": "자랑하기",
            "FREEDOM": "자유게시판"
        };

        const statusMapping = {
            "ACTIVE": "공개",
            "INACTIVE": "비공개"
        };

        return data.map(post => ({
            id: post.id,
            category: categoryMapping[post.category] || post.category,
            title: post.title,
            content: post.content,
            nickname: post.nickname,
            createdTime: new Date(post.createdAt).toLocaleDateString(),
            postStatusName: statusMapping[post.postStatus] || post.postStatus,
            postStatus: post.postStatus
        }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.heading}>상태별 게시물 관리</h2>
            </div>
            <select className={styles.option} value={statusFilter} onChange={handleStatusFilterChange}>
                <option value="ALL">전체</option>
                <option value="ACTIVE">공개</option>
                <option value="INACTIVE">비공개</option>
            </select>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>카테고리</th>
                        <th>제목</th>
                        <th>게시물 상태</th>
                        <th>작성자</th>
                        <th>작성일자</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <tr key={post.id}>
                                <td>{post.category}</td>
                                <td onClick={() => navigateToPost(post)} className={styles.adminPost}>{post.title}</td>
                                <td className={styles.adminPost} onClick={() => openStatusModal(post)}>{post.postStatusName}</td>
                                <td>{post.nickname}</td>
                                <td>{post.createdTime}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">게시물이 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <PaginationButton
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {isStatusModalOpen && (
                <PostStatusModal
                    status={selectedPost.postStatus}
                    onSave={handleStatusSave}
                    onClose={() => setIsStatusModalOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminPostList;
