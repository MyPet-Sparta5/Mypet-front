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

    const handleLogoutWithAlert = async () => {
        await handleLogout(navigate);
        toggleMenu();
        alert('로그아웃 되었습니다!');
        navigate('/');
        window.location.reload();
    };

    return (
        <div className={styles.dropdownMenu} ref={menuRef}>
            <button onClick={toggleMenu} className={styles.button}>{nickname}</button>
            <div className={`${styles.dropdownContent} ${isOpen ? styles.show : ''}`}>
                <NavLink to="/profile" onClick={toggleMenu}>MyPage</NavLink>
                {(role === 'ROLE_ADMIN' || role === 'ROLE_MANAGER') && (
                    <NavLink to="/admin/user-list" onClick={toggleMenu}>BackOffice</NavLink>
                )}
                <button onClick={handleLogoutWithAlert} className={styles.logoutButton}>LogOut</button>
            </div>
        </div>
    );
}

export default DropdownMenu;
