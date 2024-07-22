// src/components/PostList.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/PostList.module.css';

const PostList = () => {
    const navigate = useNavigate();

    // Sample data
    const posts = [
        { id: 1, category: "자랑하기", title: "첫 번째 게시물", content: "내용 1", nickname: "test", createdTime: "2024-07-20", likes: 10 },
        { id: 2, category: "자유게시판", title: "두 번째 게시물", content: "내용 2", nickname: "test", createdTime: "2024-07-21", likes: 20 },
        { id: 3, category: "자랑하기", title: "세 번째 게시물", content: "내용 3", nickname: "test", createdTime: "2024-07-22", likes: 30 },
        { id: 4, category: "자랑하기", title: "네 번째 게시물", content: "내용 4", nickname: "test", createdTime: "2024-07-23", likes: 40 },
        { id: 5, category: "자유게시판", title: "다섯 번째 게시물", content: "내용 5", nickname: "test", createdTime: "2024-07-24", likes: 50 },
        { id: 6, category: "자랑하기", title: "여섯 번째 게시물", content: "내용 6", nickname: "test", createdTime: "2024-07-25", likes: 60 },
        { id: 7, category: "자랑하기", title: "7번째 게시물", content: "내용 7", nickname: "test", createdTime: "2024-07-23", likes: 40 },
        { id: 8, category: "자유게시판", title: "8번째 게시물", content: "내용 8", nickname: "test", createdTime: "2024-07-24", likes: 50 },
        { id: 9, category: "자랑하기", title: "9번째 게시물", content: "내용 9", nickname: "test", createdTime: "2024-07-25", likes: 60 },
        { id: 10, category: "자랑하기", title: "10번째 게시물", content: "내용 10", nickname: "test", createdTime: "2024-07-23", likes: 40 },
        { id: 11, category: "자유게시판", title: "11번째 게시물", content: "내용 11", nickname: "test", createdTime: "2024-07-24", likes: 50 },
        { id: 12, category: "자랑하기", title: "12번째 게시물", content: "내용 12", nickname: "test", createdTime: "2024-07-25", likes: 60 }
    ];

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10; // Number of posts per page

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(posts.length / postsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const navigateToPost = (postId) => {
        navigate(`/posts/${postId}`);
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
                    {currentPosts.map(post => (
                        <tr key={post.id} onClick={() => navigateToPost(post.id)} className={styles.clickableRow}>
                            <td>{post.category}</td>
                            <td>{post.title}</td>
                            <td>{post.likes}</td>
                            <td>{post.nickname}</td>
                            <td>{post.createdTime}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={currentPage === index + 1 ? styles.active : ''}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PostList;
