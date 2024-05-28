"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './Header.module.css';
import Link from 'next/link';
import Phonesidebar from '../phonesidebar/phonesidebar';
import { useTranslations } from "next-intl"
import Switcher from '../switcher/Switcher';
import '../globals.css'

const Header = () => {
  const translations = useTranslations()
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
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + '/api/token');
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
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + `/api/cabinet?id=${id}`);
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
        
      <div className={styles.controlGroup} ref={menuRef}>
        <div className={styles.menuContainer}>
          <div onClick={toggleMenu} className={styles.iconContainer}>
            <div className={styles.controls}>
              <Image
                src="/man.svg"
                alt="Settings icon"
                height="65"
                width="65"
                className={styles.hoverEffect}
              />
            </div>
            {menuOpen && (
              <div className={styles.dropdownMenu}>
                <ul>
                  <Link href="/en" className={styles.dropbutton} style={{ textDecoration: 'none' }} passHref>
                    <li>{translations('Header.logout')}</li>
                  </Link>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className={styles.phonemenublock}>
          <div className={styles.divider}></div>
          <div className={styles.phonemenu} onClick={toggleSidebar}>
            <Image
              src="https://i.ibb.co/5rjgtP6/17157052055290438-2-removebg-preview.png"
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
