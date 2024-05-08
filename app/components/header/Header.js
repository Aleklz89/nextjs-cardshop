"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './Header.module.css';
import Link from 'next/link';
import Phonesidebar from '../phonesidebar/phonesidebar';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [secondMenuOpen, setSecondMenuOpen] = useState(false);
  const [balance, setBalance] = useState(0); 
  const [userId, setUserId] = useState(null); 
  const menuRef = useRef();
  const secondMenuRef = useRef();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(true);

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setTimeout(() => {
      setIsSidebarVisible(false);
    }, 500);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
    setIsMenuVisible(!isMenuVisible);
  };

  const fetchUserId = async () => {
    try {
      const response = await fetch('/api/token');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setUserId(data.userId);
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  const fetchUserBalance = async (id) => {
    try {
      const response = await fetch(`/api/cabinet?id=${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setBalance(data.user.balance);
    } catch (error) {
      console.error('Error fetching user balance:', error);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId !== null) {
      fetchUserBalance(userId);
    }
  }, [userId]);

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
        <Link href="/cabinet/cards" style={{ textDecoration: 'none' }} passHref>
          <Image
            src="https://i.ibb.co/FWQ7tRc/Screenshot-1043-removebg-preview.png"
            alt="Logo"
            height="45"
            width="55"
          />
          <span className={styles.logoText}>
            <span className={styles.logoTextCard}>CVV</span>
            <span className={styles.logoTextShop}>888</span>
          </span>
        </Link>
      </div>
      <nav className={styles.nav}>
        <a className={styles.navLink}>
          <span>Balance:</span>
          <span className={styles.navLinkUnderline}></span>
        </a>
        <h1 className={styles.number}>${balance}</h1>
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
                  <Link href="/" className={styles.dropbutton} style={{ textDecoration: 'none' }} passHref>
                    <li>Log Out</li>
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
                    <Link href="/cabinet/security" className={styles.dropbutton} style={{ textDecoration: 'none' }} passHref>
                      Safety and security
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
