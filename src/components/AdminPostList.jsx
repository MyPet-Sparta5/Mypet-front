import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance, handleApiCall } from '../setting/api';
import styles from '../styles/PostList.module.css';
import PaginationButton from './PaginationButton';
import PostStatusModal from './PostStatusModal';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';

registerLocale('ko', ko);

const AdminPostList = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [nicknameSearch, setNicknameSearch] = useState('');
    const [titleSearch, setTitleSearch] = useState('');
    const [statusSearch, setStatusSearch] = useState('');
    const [categorySearch, setCategorySearch] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const postsPerPage = 10;

    useEffect(() => {
        fetchPosts(currentPage);
    }, [currentPage]);

    const fetchPosts = async (page) => {
        try {
            const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : undefined;
            const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : undefined;

            const response = await handleApiCall(() => axiosInstance.get('/api/admin/post-manage', {
                params: {
                    page: currentPage,
                    pageSize: postsPerPage,
                    sortBy: 'createdAt,desc',
                    nickname: nicknameSearch || undefined,
                    category: categorySearch || undefined,
                    status: statusSearch || undefined,
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                    title: titleSearch || undefined
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
            fetchPosts(currentPage);
        } catch (error) {
            console.error("Failed to update post status", error);
            alert("동일 상태로는 변경이 불가능합니다.");
        }
    };

    const transformPostData = (data) => {
        const categoryMapping = {
            "BOAST": "자랑하기",
            "FREEDOM": "자유게시판"
        };

        const statusMapping = {
            "ACTIVE": "공개",
            "INACTIVE": "비공개",
            "DELETED": "삭제됨"
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
                <h2 className={styles.heading}>게시물 관리</h2>
            </div>
            <div className={styles.searchContainer}>
                <div >
                    <label>카테고리 : </label>
                    <select className={styles.searchInput} value={categorySearch} onChange={(e) => {
                        const value = e.target.value === '전체' ? '' : e.target.value;
                        setCategorySearch(value);
                    }}>
                        <option>전체</option>
                        <option value="BOAST">자랑하기</option>
                        <option value="FREEDOM">자유게시판</option>
                    </select>
                    <label>상태 : </label>
                    <select className={styles.searchInput} value={statusSearch} onChange={(e) => {
                        const value = e.target.value === '전체' ? '' : e.target.value;
                        setStatusSearch(value);
                    }}>
                        <option>전체</option>
                        <option value="ACTIVE">공개</option>
                        <option value="INACTIVE">비공개</option>
                        <option value="DELETED">삭제됨</option>
                    </select>
                    <label>제목 : </label>
                    <input
                        type="text"
                        placeholder="제목 검색"
                        value={titleSearch}
                        onChange={(e) => setTitleSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                    <label>작성자 : </label>
                    <input
                        type="text"
                        placeholder="작성자 검색"
                        value={nicknameSearch}
                        onChange={(e) => setNicknameSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                    <label>기간 조회 : </label>
                    <DatePicker
                        className={styles.searchDate}
                        locale="ko"
                        dateFormat='yyyy-MM-dd'
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                            setDateRange(update);
                        }}
                        isClearable
                    />
                </div>
                <div>
                    <button onClick={() => fetchPosts(1)} className={styles.searchButton}>검색</button>
                </div>
            </div>
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
