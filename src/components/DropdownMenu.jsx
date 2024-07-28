import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../styles/DropdownMenu.module.css';

function DropdownMenu({ nickname, role }) {
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
            <button onClick={toggleMenu} className={styles.button}>{nickname}</button>
            <div className={`${styles.dropdownContent} ${isOpen ? styles.show : ''}`}>
                <NavLink to="/profile">MyPage</NavLink>
                {(role === 'ROLE_ADMIN' || role === 'ROLE_MANAGER') && (
                    <NavLink to="/admin/user-list">BackOffice</NavLink>
                )}
                <NavLink to="/logout">Log Out</NavLink>
            </div>
        </div>
    );
}

export default DropdownMenu;
