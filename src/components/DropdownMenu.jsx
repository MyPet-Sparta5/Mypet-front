import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../styles/DropdownMenu.module.css';

function DropdownMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.dropdownMenu} ref={menuRef}>
            <button onClick={toggleMenu} className={styles.button}>닉네임
                {/* 로그인한 사용자 닉네임이 나오도록함. */}
            </button>
            <div className={`${styles.dropdownContent} ${isOpen ? styles.show : ''}`}>
                <NavLink to="/profile">MyPage</NavLink>
                <NavLink to="/admin/user-list">BackOffice</NavLink>
                {/* 백오피스는 로그인한 사용자가 admin 권한일때 되도록합니다. */}
                <NavLink to="/logout">Log Out</NavLink>
            </div>
        </div>
    );
}

export default DropdownMenu;
