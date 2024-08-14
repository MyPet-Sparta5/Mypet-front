// src/components/PaginationButton.jsx
import React from 'react';
import styles from '../styles/PaginationButton.module.css'; // 스타일을 위한 CSS 모듈

const PaginationButton = ({ currentPage, totalPages, onPageChange }) => {
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
                    onClick={() => onPageChange(i)}
                    className={currentPage === i ? styles.active : ''}
                >
                    {i}
                </button>
            );
        }
        return buttons;
    };

    return (
        <div className={styles.pagination}>
            {getPaginationButtons()}
        </div>
    );
};

export default PaginationButton;
