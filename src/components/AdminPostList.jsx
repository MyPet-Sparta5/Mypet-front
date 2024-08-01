import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/PostList.module.css';
import PaginationButton from '../components/PaginationButton';

const AdminPostList = () => {
    // 예시 데이터
    const posts = [
        { id: 1, category: "자랑하기", title: "첫 번째 게시물", content: "내용 1", nickname: "test", createdTime: "2024-07-20", likes: 10, status: "active" },
        { id: 2, category: "자유게시판", title: "두 번째 게시물", content: "내용 2", nickname: "test", createdTime: "2024-07-21", likes: 20, status: "active" },
        { id: 3, category: "자랑하기", title: "세 번째 게시물", content: "내용 3", nickname: "test", createdTime: "2024-07-22", likes: 30, status: "active" },
        { id: 4, category: "자랑하기", title: "네 번째 게시물", content: "내용 4", nickname: "test", createdTime: "2024-07-23", likes: 40, status: "active" },
        { id: 5, category: "자유게시판", title: "다섯 번째 게시물", content: "내용 5", nickname: "test", createdTime: "2024-07-24", likes: 50, status: "active" },
        { id: 6, category: "자랑하기", title: "여섯 번째 게시물", content: "내용 6", nickname: "test", createdTime: "2024-07-25", likes: 60, status: "active" },
        { id: 7, category: "자랑하기", title: "7번째 게시물", content: "내용 7", nickname: "test", createdTime: "2024-07-23", likes: 40, status: "active" },
        { id: 8, category: "자유게시판", title: "8번째 게시물", content: "내용 8", nickname: "test", createdTime: "2024-07-24", likes: 50, status: "active" },
        { id: 9, category: "자랑하기", title: "9번째 게시물", content: "내용 9", nickname: "test", createdTime: "2024-07-25", likes: 60, status: "active" },
        { id: 10, category: "자랑하기", title: "10번째 게시물", content: "내용 10", nickname: "test", createdTime: "2024-07-23", likes: 40, status: "active" }
    ];

    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const navigateToPost = (postId) => {
        navigate(`/posts/${postId}`);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.heading}>상태별 게시물 관리</h2>
            </div>
            <select className={styles.option}>
                <option>전체</option>
                <option>공개</option>
                <option>비공개</option>
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
                            <tr key={post.id} onClick={() => navigateToPost(post)} className={styles.clickableRow}>
                                <td>{post.category}</td>
                                <td>{post.title}</td>
                                <td className={styles.userEdit} >{post.status}</td>
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
        </div>
    );
};

export default AdminPostList;