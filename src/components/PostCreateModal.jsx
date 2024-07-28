import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Modal.module.css';

function getAuthTokenFromLocalStorage() {
    return localStorage.getItem('accessToken');
}

function PostCreateModal({ category, onSave, onClose }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(category === 'DEFAULT' ? '' : category);
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files).slice(0, 5));
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('requestDto', new Blob([JSON.stringify({ title, content })], { type: 'application/json' }));
        formData.append('category', selectedCategory);
        files.forEach(file => {
            formData.append('file', file);
        });
    
        try {
            const token = getAuthTokenFromLocalStorage();
            if (!token) {
                setError('로그인이 필요합니다.');
                return;
            }
    
            await axios.post('http://localhost:8080/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                }
            });
    
            // 성공적으로 게시물이 생성되면 페이지를 새로고침
            window.location.reload(); 
        } catch (error) {
            console.error('게시물 작성 중 오류:', error);
            if (error.response && error.response.status === 403) {
                setError('접근 권한이 없습니다.');
            } else {
                setError('게시물 작성 중 오류가 발생했습니다. 다시 시도해 주세요.');
            }
        }
    };
    

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>게시글 작성</h2>
                {category === 'DEFAULT' ? (
                    <div className={styles.inputGroup}>
                        <label htmlFor="postCategory">카테고리</label>
                        <select
                            id="postCategory"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className={styles.selectCategory}
                        >
                            <option value="">카테고리 선택</option>
                            <option value="BOAST">자랑하기</option>
                            <option value="FREEDOM">자유게시판</option>
                        </select>
                    </div>
                ) : (
                    <div className={styles.inputGroup}>
                        <label htmlFor="postCategory">카테고리</label>
                        <select
                            id="postCategory"
                            value={selectedCategory}
                            disabled
                            className={styles.selectCategory}
                        >
                            <option value="">{selectedCategory === 'BOAST' ? '자랑하기' : '자유게시판'}</option>
                        </select>
                    </div>
                )}
                <div className={styles.inputGroup}>
                    <label htmlFor="postTitle">게시물 제목</label>
                    <input
                        className={styles.inputTitle}
                        id="postTitle"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="postContent">게시물 내용</label>
                    <textarea
                        className={styles.textareaContent}
                        id="postContent"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                {selectedCategory === 'BOAST' && (
                    <div className={styles.inputGroup}>
                        <label htmlFor="postFiles">파일 첨부 (최대 5개)</label>
                        <input
                            type="file"
                            id="postFiles"
                            multiple
                            onChange={handleFileChange}
                        />
                        {files.length > 0 && (
                            <div>
                                {files.map((file, index) => (
                                    <p key={index}>{file.name}</p>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {error && <p className={styles.error}>{error}</p>}
                <div className={styles.modalButtons}>
                    <button className={styles.saveButton} onClick={handleSave}>저장</button>
                    <button className={styles.cancelButton} onClick={onClose}>취소</button>
                </div>
            </div>
        </div>
    );
}

export default PostCreateModal;
