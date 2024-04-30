"use client"

import React from 'react'
import styles from './phonesidebar.module.css';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Phonesidebar = ({ onClose, isVisible }) => {

  const pathname = usePathname();

  const isActive = (path) => {
    const isActivePath = pathname === path;
    return isActivePath;
  };


  return (
    <div
      className={`${styles.sidebar} ${isVisible ? styles.sidebarOpen : styles.sidebarClosed}`}
      onClick={onClose}
    >
      <ul className={styles.navList}>
        <li className={isActive('/cards') ? styles.active : styles.navItem}>
          <Link href="/cards" passHref>
            <span className={styles.icon}></span>
            <span className={styles.icon}>
              <Image
                src="https://i.ibb.co/9GnbbJz/free-icon-dollar-sign-2769269.png"
                alt="Description"
                className="icon"
                width={28}
                height={28}

              />
            </span>
            Cards
          </Link>
        </li>
        <li className={isActive('/transactions') ? styles.active : styles.navItem}>
          <Link href="/transactions" passHref>
            <span className={styles.icon}></span>
            <span className={styles.icon}>
              <Image
                src="https://i.ibb.co/XtqQc1L/free-icon-time-and-calendar-8327630.png"
                alt="Description"
                className="icon"
                width={28}
                height={28}

              />
            </span>
            Transactions
          </Link>
        </li>
        <li className={isActive('/support') ? styles.active : styles.navItem}>
          <Link href="/support">
            <span className={styles.icon}></span>
            <span className={styles.icon}>
              <Image
                src="https://i.ibb.co/mSkBQM8/free-icon-question-mark-8426914.png"
                alt="Description"
                className="icon"
                width={28}
                height={28}

              />
            </span>
            Support
          </Link>
        </li>
        <li className={isActive('/settings') ? styles.active : styles.navItem}>
          <Link href="/settings">
            <span className={styles.icon}></span>
            <span className={styles.icon}>
              <Image
                src="https://i.ibb.co/zX5ftLw/free-icon-setting-4945808.png"
                alt="Description"
                className="icon"
                width={28}
                height={28}

              />
            </span>
            Settings
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Phonesidebar;