import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/PostList.module.css';

const PostList = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const postsPerPage = 10; // Number of posts per page

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Fetch data with page parameter
                const response = await axios.get(`http://localhost:8080/api/posts?page=${currentPage}`);

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
    }, [currentPage]);

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

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const getPaginationButtons = () => {
        const maxButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = startPage + maxButtons - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        const buttons = [];
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => paginate(i)}
                    className={currentPage === i ? styles.active : ''}
                >
                    {i}
                </button>
            );
        }
        return buttons;
    };

    const navigateToPost = (post) => {
        if (post.category === '자랑하기') {
            navigate(`/pet/${post.id}`);
        } else {
            navigate(`/posts/${post.id}`);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>통합 게시판</h2>
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

            <div className={styles.pagination}>
                {getPaginationButtons()}
            </div>
        </div>
    );
};

export default PostList;
