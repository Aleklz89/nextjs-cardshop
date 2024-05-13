"use client"

import React from 'react'
import styles from './Sidebar.module.css';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from "next-intl"

function Sidebar() {
  const translations = useTranslations()

  const pathname = usePathname();

  const isActive = (path) => {
    const isActivePath = pathname === path;
    return isActivePath;
  };

  return (
    <aside className={styles.sidebar}>
      
    </aside>
  )
}

export default Sidebar;