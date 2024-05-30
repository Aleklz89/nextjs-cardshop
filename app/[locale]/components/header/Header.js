"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './Header.module.css';
import Link from 'next/link';
import Phonesidebar from '../phonesidebar/phonesidebar';
import { useTranslations } from "next-intl"
import Switcher from '../switcher/Switcher';
import '../globals.css'
import { useTheme } from 'next-themes';

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

  const handleLogoutClick = () => {
    window.location.href = "/";
  }

  const { theme, setTheme, resolvedTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
  };

  const handleSaveClick = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + '/api/change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          oldPassword,
          newPassword
        })
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Password successfully updated");
        setMessageType("success");
        setEditMode(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage(result.error || "Error updating password");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Error updating password");
      setMessageType("error");
      console.error('Error updating password:', error);
    }
  };



  const fetchUserEmail = async (id) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + `/api/cabinet?id=${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setEmail(data.user.email);
    } catch (error) {
      console.error('Error fetching user email:', error);
    }
  };

  useEffect(() => {
    const getEmail = async () => {
      await fetchUserId();
      if (userId) {
        await fetchUserEmail(userId);
      }
    };

    getEmail();
  }, [userId]);

  if (!mounted) return null;


  return (
    <header className={styles.header}>
      {isSidebarVisible && (
        <Phonesidebar
          onClose={handleCloseSidebar}
          isVisible={isSidebarOpen}
        />
      )}

      <div className={styles.controlGroup} ref={menuRef}>
        {/* <div className={styles.outer}>
          <label htmlFor="theme" className={styles.theme}>
            <span>Light</span>
            <span className={styles.themeToggleWrap}>
              <input
                id="theme"
                className={styles.themeToggle}
                type="checkbox"
                role="switch"
                name="theme"
                checked={resolvedTheme === 'dark'}
                onChange={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              />
              <span className={styles.themeFill}></span>
              <span className={styles.themeIcon}>
                {[...Array(9)].map((_, index) => (
                  <span key={index} className={styles.themeIconPart}></span>
                ))}
              </span>
            </span>
            <span>Dark</span>
          </label>
        </div> */}
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
                  <li onClick={handleLogoutClick}>{translations('Header.logout')}</li>
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
