"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './phonesidebar.module.css';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from "next-intl";
import '../globals.css';
import Switcher from '../switcher/Switcher';

const Phonesidebar = ({ onClose, isVisible }) => {
  const translations = useTranslations();
  const pathname = usePathname();
  const [balance, setBalance] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userStatus, setUserStatus] = useState(null); // New state for user status
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const menuRef = useRef();
  const secondMenuRef = useRef();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(true);

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
      setUserStatus(data.user.status); // Set user status
    } catch (error) {
      console.error('Error fetching user balance:', error);
      setBalance(null);
      setUserStatus(null);
    } finally {
      setIsLoadingBalance(false);
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

  const isActive = (path) => {
    const isActivePath = pathname === path;
    return isActivePath;
  };

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

  const rootUrl = process.env.NEXT_PUBLIC_ROOT_URL;
  const shareUrl = `https://telegram.me/share/url?url=${encodeURIComponent(rootUrl)}/&text=CVV888`;

  return (
    <div
      className={`${styles.sidebar} ${isVisible ? styles.sidebarOpen : styles.sidebarClosed}`}
      onClick={onClose}
    >
      <div className={styles.logo}>
        <Image
          src="/logo.svg"
          alt="Description"
          className="icon"
          width={72}
          height={87}
        />
      </div>
      <div className={styles.numbox}>
        <div className={styles.inner}>
          <div className={styles.totalWorth}>
            <h6>
              {isLoadingBalance ? `${translations('Cardlist.loading')}` : `${balance}$`}
            </h6>
          </div>
          <Link href="/cabinet/topup" style={{ textDecoration: 'none' }} passHref>
            <button className={styles.button}>{translations('Dashboard.topup')}</button>
          </Link>
        </div>
      </div>
      <ul className={styles.navList}>
        <li className={isActive('/cabinet/cards') ? styles.active : styles.navItem}>
          <Link href="/cabinet/cards" passHref className={styles.txt}>
            <span className={styles.icon}></span>
            <span className={styles.icon}>
              <Image
                src="/cardlogo.svg"
                alt="Description"
                className="icon"
                width={30}
                height={30}
              />
            </span>
            {translations('Sidebar.cards')}
          </Link>
        </li>
        <li className={isActive('/cabinet/transactions') ? styles.active : styles.navItem}>
          <Link href="/cabinet/transactions" passHref>
            <span className={styles.icon}></span>
            <span className={styles.icon}>
              <Image
                src="/translogo.svg"
                alt="Description"
                className="icon"
                width={28}
                height={28}
              />
            </span>
            {translations('Sidebar.transactions')}
          </Link>
        </li>
        <li className={isActive('/cabinet/support') ? styles.active : styles.navItem}>
          <Link href="/cabinet/support">
            <span className={styles.icon}></span>
            <span className={styles.icon}>
              <Image
                src="/helplogo.svg"
                alt="Description"
                className="icon"
                width={28}
                height={28}
              />
            </span>
            {translations('Sidebar.support')}
          </Link>
        </li>
        <li className={isActive('/cabinet/settings') ? styles.active : styles.navItem}>
          <Link href="/cabinet/settings">
            <span className={styles.icon}></span>
            <span className={styles.icon}>
              <Image
                src="/gear.svg"
                alt="Description"
                className="icon"
                width={28}
                height={28}
              />
            </span>
            {translations('Sidebar.settings')}
          </Link>
        </li>
        {['owner', 'head', 'team lead'].includes(userStatus) && (
          <li className={isActive('/cabinet/team') ? styles.active : styles.navItem}>
            <Link href="/cabinet/team" passHref>
              <span className={styles.icon}></span>
              <span className={styles.icon}>
                <Image
                  src="/team.svg"
                  alt="Description"
                  className="icon"
                  width={28}
                  height={28}
                />
              </span>
              {translations('Sidebar.team')}
            </Link>
          </li>
        )}
      </ul>
      <div className={styles.numbox}>
        <Switcher />
      </div>
    </div>
  );
};

export default Phonesidebar;
