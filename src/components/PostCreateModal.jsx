import React, { useState } from 'react';
import styles from '../styles/Modal.module.css';

function PostCreateModal({ category, onSave, onClose }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(category === '' ? '' : category);
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');

    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/avi'];

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const validFiles = selectedFiles.filter(file => allowedFileTypes.includes(file.type));
        if (validFiles.length + files.length > 5) {
            setError('최대 5개의 파일만 첨부할 수 있습니다.');
            return;
        }
        setFiles(prevFiles => [...prevFiles, ...validFiles]);
        setError('');
    };

    const handleRemoveFile = (fileName) => {
        setFiles(files.filter(file => file.name !== fileName));
    };

    const handleSave = () => {
        if (files.length > 5) {
            setError('최대 5개의 파일만 첨부할 수 있습니다.');
            return;
        }

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
                        disabled={category !== ''}
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
                            accept=".jpg, .jpeg, .png, .gif, .mp4, .avi"
                        />
                        {files.length > 0 && (
                            <div className={styles.fileList}>
                                {files.map((file, index) => (
                                    <div key={index} className={styles.fileItem}>
                                        <p>{file.name}</p>
                                        <button
                                            className={styles.removeFileButton}
                                            onClick={() => handleRemoveFile(file.name)}
                                        >
                                            X
                                        </button>
                                    </div>
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
