import React, { useState } from 'react';
import styles from '../styles/Modal.module.css';

function PostCreateModal({ category, onSave, onClose }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(category === 'DEFAULT' ? '' : category);
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files).slice(0, 5));
    };

    const handleSave = () => {
        const postData = {
            title,
            content,
            category: selectedCategory,
            files: files // 직접 파일 객체를 전달하지 않고, 파일 이름만 전달
        };

        onSave(postData);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>게시글 작성</h2>
                <div className={styles.inputGroup}>
                    <label htmlFor="postCategory">카테고리</label>
                    <select
                        id="postCategory"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={styles.selectCategory}
                        disabled={category !== 'DEFAULT'}
                    >
                        <option value="">카테고리 선택</option>
                        <option value="BOAST">자랑하기</option>
                        <option value="FREEDOM">자유게시판</option>
                    </select>
                </div>
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
