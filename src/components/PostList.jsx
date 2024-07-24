// src/components/PostList.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostContext } from '../context/PostContext';
import styles from '../styles/PostList.module.css';

const PostList = () => {
    const navigate = useNavigate();
    const posts = useContext(PostContext); // 데이터 컨텍스트에서 가져오기

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10; // Number of posts per page

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(posts.length / postsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                    {currentPosts.map(post => (
                        <tr key={post.id} onClick={() => navigateToPost(post)} className={styles.clickableRow}>
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
