import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/PostList.module.css';
import PaginationButton from '../components/PaginationButton';
import PostCreateModal from '../components/PostCreateModal';
import Loading from '../setting/Loading';
import { axiosInstance, axiosNonAuthorization, handleApiCall } from '../setting/api';
import { GoSearch } from "react-icons/go";

const PostList = ({ category }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [nicknameSearch, setNicknameSearch] = useState('');
    const [titleSearch, setTitleSearch] = useState('');
    const [searchVisible, setSearchVisible] = useState(false);
    const postsPerPage = 10;

    // 상태를 초기화하는 함수
    const resetState = () => {
        setSearchVisible(false);
        setCurrentPage(1);
        setNicknameSearch('');
        setTitleSearch('');
    };

    // 위치 객체나 카테고리 변경 시 상태를 초기화합니다.
    useEffect(() => {
        resetState();
    }, [category, location.key]);

    useEffect(() => {
        fetchPosts();
    }, [currentPage, category]);

    const fetchPosts = async () => {
        setLoading(true);
        const apiCall = () => axiosNonAuthorization.get('/api/posts', {
            params: {
                page: currentPage,
                pageSize: postsPerPage,
                sortBy: 'createdAt,desc',
                category: category,
                status: 'ACTIVE',
                nickname: nicknameSearch || undefined,
                title: titleSearch || undefined
            }
        });
        try {
            const response = await handleApiCall(apiCall, navigate);
            const { content, totalPages, totalElements } = response.data.data;
            setPosts(transformPostData(content));
            setTotalPages(totalPages);
            setTotalElements(totalElements);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const transformPostData = (data) => {
        const categoryMapping = {
            "BOAST": "자랑하기",
            "FREEDOM": "자유게시판"
        };
        return data.map(post => ({
            id: post.id,
            category: categoryMapping[post.category] || post.category,
            title: post.title,
            content: post.content,
            nickname: post.nickname,
            createdTime: new Date(post.createdAt).toLocaleDateString(),
            likes: post.likeCount,
        }));
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const navigateToPost = (post) => {
        const targetPath = post.category === '자랑하기' ? `/pet/${post.id}` : `/posts/${post.id}`;
        navigate(targetPath);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSave = async (postData) => {
        const { title, content, category, files } = postData;
        const formData = new FormData();
        formData.append('requestDto', new Blob([JSON.stringify({ title, content })], { type: 'application/json' }));
        formData.append('category', category);
        files.forEach(file => {
            formData.append('files', file);
        });

        setLoading(true);

        const apiCall = () => axiosInstance.post('/api/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        try {
            const response = await handleApiCall(apiCall, navigate);
            const postId = response.data.data.id;
            const targetPath = category === 'BOAST' ? `/pet/${postId}` : `/posts/${postId}`;
            navigate(targetPath);
            closeModal();
        } catch (error) {
            console.error('Error creating post:', error);
            alert('게시물 작성 중 오류가 발생했습니다. 다시 시도해 주세요.');
        } finally {
            setLoading(false);
        }
    };

    const toggleSearchVisibility = () => {
        setSearchVisible(!searchVisible);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            fetchPosts();
        }
    };

    return (
        <div className={styles.container}>
            {loading && <Loading />}
            <div className={styles.header}>
                <h2 className={styles.heading}>{category === '' ? '통합 게시판' : (category === 'BOAST' ? '자랑하기 게시판' : '자유게시판')}</h2>
            </div>
            <div>
                <div className={styles.search}>
                    <GoSearch onClick={toggleSearchVisibility} className={styles.searchIcon} />
                    {searchVisible && (
                        <>
                            <label>제목 : &nbsp;</label>
                            <input
                                type="text"
                                placeholder="제목 검색"
                                value={titleSearch}
                                onChange={(e) => setTitleSearch(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className={styles.searchInput}
                            />
                            <label>작성자 : &nbsp;</label>
                            <input
                                type="text"
                                placeholder="작성자 검색"
                                value={nicknameSearch}
                                onChange={(e) => setNicknameSearch(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className={styles.searchInput}
                            />
                            <button onClick={() => fetchPosts()} className={styles.searchButton}>검색</button>
                        </>
                    )}
                </div>
                <button onClick={openModal} className={styles.button}>+ 게시글 작성</button>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>카테고리</th>
                        <th>제목</th>
                        <th>좋아요 수</th>
                        <th>작성자</th>
                        <th>작성일자</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <tr key={post.id} onClick={() => navigateToPost(post)} className={styles.clickableRow}>
                                <td>{post.category}</td>
                                <td>{post.title}</td>
                                <td>{post.likes}</td>
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

            {isModalOpen && (
                <PostCreateModal
                    category={category}
                    onSave={handleSave}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default PostList;