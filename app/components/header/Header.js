"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './Header.module.css';
import Link from 'next/link';
import Phonesidebar from '../phonesidebar/phonesidebar';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [secondMenuOpen, setSecondMenuOpen] = useState(false);
    const menuRef = useRef();
    const secondMenuRef = useRef();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


    const [isMenuVisible, setIsMenuVisible] = useState(true);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);


    const handleCloseSidebar = () => {
        setIsSidebarOpen(false); 

        setTimeout(() => {
            setIsSidebarVisible(false);
        }, 500); 
    };

    const handleShowSidebar = () => {
        setIsSidebarVisible(true);
    };

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible); 
        setIsMenuVisible(!isMenuVisible); 
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
            if (secondMenuRef.current && !secondMenuRef.current.contains(event.target)) {
                setSecondMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = () => {
        if (!menuOpen && secondMenuOpen) {
            setSecondMenuOpen(false);
        }
        setMenuOpen(!menuOpen);
    };

    const toggleSecondMenu = () => {
        if (!secondMenuOpen && menuOpen) {
            setMenuOpen(false);
        }
        setSecondMenuOpen(!secondMenuOpen);
    };


    return (
        <header className={styles.header}>
            {isSidebarVisible && (
                <Phonesidebar
                    onClose={handleCloseSidebar}
                    isVisible={isSidebarOpen} 
                />
            )}
            <div className={styles.logoContainer}>
                <Link href="/cards" style={{ textDecoration: 'none' }} passHref>

                    <Image
                        src="https://i.ibb.co/FWQ7tRc/Screenshot-1043-removebg-preview.png"
                        alt="Logo"
                        height="45"
                        width="55"
                    />

                    <span className={styles.logoText}>
                        <span className={styles.logoTextCard}>Card</span>
                        <span className={styles.logoTextShop}>Shop</span>
                    </span>
                </Link>
            </div>
            <nav className={styles.nav}>
                <a className={styles.navLink}>
                    <span>Balance:</span>
                    <span className={styles.navLinkUnderline}></span>
                </a>
                <h1 className={styles.number}>$0</h1>
            </nav>
            <div className={styles.controlGroup} ref={menuRef}>
                <div className={styles.menuContainer}>
                    <div onClick={toggleMenu} className={styles.iconContainer}>
                        <div className={styles.controls}>
                            <Image
                                src="https://i.ibb.co/x7vcf4Z/8801434.png"
                                alt="Settings icon"
                                height="25"
                                width="25"
                                className={styles.hoverEffect}
                            />
                        </div>
                        {menuOpen && (
                            <div className={styles.dropdownMenu}>
                                <ul>
                                    <Link href="/level" className={styles.dropbutton} style={{ textDecoration: 'none' }} passHref>
                                        <li>
                                            Username
                                        </li>
                                    </Link>
                                    <Link href="/" className={styles.dropbutton} style={{ textDecoration: 'none' }} passHref>
                                        <li>

                                            Log Out

                                        </li>
                                    </Link>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.divider}></div>
                <div className={styles.controls} ref={secondMenuRef}>
                    <div onClick={toggleSecondMenu} className={styles.iconContainer}>
                        <Image
                            src="https://i.ibb.co/K048YRF/png-transparent-settings-gear-icon-gear-configuration-set-up-thumbnail-removebg-preview.png"
                            alt="Settings icon"
                            height="25"
                            width="25"
                            className={styles.hoverEffectwo}
                        />
                        {secondMenuOpen && (
                            <div className={styles.dropdownMenu}>
                                <ul>
                                    <li>
                                        <Link href="/level" className={styles.dropbutton} style={{ textDecoration: 'none' }} passHref>
                                            Connect Telegram
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/security" className={styles.dropbutton} style={{ textDecoration: 'none' }} passHref>
                                            Safety and security
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/notifications" className={styles.dropbutton} style={{ textDecoration: 'none' }} passHref>
                                            Notification settings
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        )}

                    </div>
                </div>
                <div className={styles.phonemenublock}>
                    <div className={styles.divider}></div>
                    <div className={styles.phonemenu} onClick={toggleSidebar}>
                        <Image
                            src="https://i.ibb.co/2M2gcpK/images.png"
                            alt="Logo"
                            height="25"
                            width="25"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;