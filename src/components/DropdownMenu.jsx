import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../styles/DropdownMenu.module.css';
import handleLogout from './Logout';

function DropdownMenu({ nickname, role }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

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
                <button type='button' onClick={() => handleLogout(navigate)} className={styles.logoutButton}>Log Out</button>
            </div>
        </div>
    );
}

export default DropdownMenu;
