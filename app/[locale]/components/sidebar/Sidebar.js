"use client"

import React from 'react'
import styles from './Sidebar.module.css';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from "next-intl"
import '../globals.css'

function Sidebar() {
  const translations = useTranslations()

  const pathname = usePathname();

  const isActive = (path) => {
    const isActivePath = pathname === path;
    return isActivePath;
  };

  return (
    <aside className={styles.sidebar}>
      <ul className={styles.navList}>
      <li className={isActive('/cabinet/cards') ? styles.active : styles.navItem}>
          <Link href="/cabinet/cards" passHref>
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
            {translations('Sidebar.cards')}
          </Link>
        </li>
        <li className={isActive('/cabinet/transactions') ? styles.active : styles.navItem}>
          <Link href="/cabinet/transactions" passHref>
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
            {translations('Sidebar.transactions')}
          </Link>
        </li>
        <li className={isActive('/cabinet/support') ? styles.active : styles.navItem}>
          <Link href="/cabinet/support">
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
            {translations('Sidebar.support')}
          </Link>
        </li>
        <li className={isActive('/cabinet/settings') ? styles.active : styles.navItem}>
          <Link href="/cabinet/settings">
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
            {translations('Sidebar.settings')}
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar;