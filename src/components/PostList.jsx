import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/PostList.module.css';
import PaginationButton from '../components/PaginationButton';
import PostCreateModal from '../components/PostCreateModal';

const PostList = ({ category }) => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const postsPerPage = 10;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/posts', {
                    params: {
                        page: currentPage,
                        pageSize: postsPerPage,
                        sortBy: 'createdAt,desc',
                        category: category
                    },
                });

                const { content, totalPages, totalElements } = response.data.data;

                const transformedData = transformPostData(content);

                setPosts(transformedData);
                setTotalPages(totalPages);
                setTotalElements(totalElements);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [currentPage, category]);

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
            createdTime: new Date(post.createAt).toLocaleDateString(),
            likes: post.likeCount,
            fileUrls: post.files.map(file => file.url),
        }));
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const navigateToPost = (post) => {
        if (post.category === '자랑하기') {
            navigate(`/pet/${post.id}`);
        } else {
            navigate(`/posts/${post.id}`);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSave = (newPost) => {
        // 게시글 저장 로직 추가
        console.log('새 게시글:', newPost);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.heading}>{category === 'DEFAULT' ? '통합 게시판' : (category === 'BOAST' ? '자랑하기 게시판' : '자유게시판')}</h2>
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
