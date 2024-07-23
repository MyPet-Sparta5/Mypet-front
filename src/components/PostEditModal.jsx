import React, { useState } from 'react';
import styles from '../styles/Modal.module.css';

function PostEditModal({ category, title, content, onSave, onClose }) {
  const [titleValue, setTitle] = useState(title);
  const [contentValue, setContent] = useState(content);
  const [categoryValue, setCategory] = useState(category);

  const handleSave = () => {
    onSave({ title: titleValue, content: contentValue, category: categoryValue });
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>게시글 수정</h2>
        <div>
          <label htmlFor="postCategory">카테고리</label><br />
          <select className={styles.selectCategory} id="category-select" value={category} onChange={(e) => setCategory(e.target.value)} disabled>
            <option value="">{category}</option>
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="postTitle">게시물 제목</label>
          <input
            className={styles.inputTitle}
            id="postTitle"
            type="text"
            value={titleValue}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="postContent">게시물 내용</label>
          <textarea
            className={styles.textareaContent}
            id="postContent"
            value={contentValue}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className={styles.modalButtons}>
          <button onClick={handleSave}>수정</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}

export default PostEditModal;
