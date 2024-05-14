"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './Header.module.css';
import Link from 'next/link';
import Phonesidebar from '../phonesidebar/phonesidebar';
import { useTranslations } from "next-intl"
import Switcher from '../switcher/Switcher';

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
        <div>
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
      <a className={styles.menuItem} href="/cabinet/cards">
        <Image
          src="https://i.ibb.co/9GnbbJz/free-icon-dollar-sign-2769269.png"
          alt="Cards"
          className={styles.icon}
          width={28}
          height={28}
        />
        {translations('Sidebar.cards')}
      </a>
      <a className={styles.menuItem} href="/cabinet/transactions">
        <Image
          src="https://i.ibb.co/XtqQc1L/free-icon-time-and-calendar-8327630.png"
          alt="Transactions"
          className={styles.icon}
          width={28}
          height={28}
        />
        {translations('Sidebar.transactions')}
      </a>
      <a className={styles.menuItem} href="/cabinet/support">
        <Image
          src="https://i.ibb.co/mSkBQM8/free-icon-question-mark-8426914.png"
          alt="Support"
          className={styles.icon}
          width={28}
          height={28}
        />
        {translations('Sidebar.support')}
      </a>
      <a className={styles.menuItem} href="/cabinet/settings">
        <Image
          src="https://i.ibb.co/zX5ftLw/free-icon-setting-4945808.png"
          alt="Settings"
          className={styles.icon}
          width={28}
          height={28}
        />
        {translations('Sidebar.settings')}
      </a>
    </nav>
      <div className={styles.controlGroup} ref={menuRef}>
      <Switcher />
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
                    <li>{translations('Header.logout')}</li>
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
                    {translations('Header.security')}
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
