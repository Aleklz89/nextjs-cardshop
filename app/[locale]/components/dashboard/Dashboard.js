"use client";

import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import Link from 'next/link';
import { useTranslations } from "next-intl"
import '../globals.css'


const Dashboard = () => {
  const translations = useTranslations()
  const [balance, setBalance] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true); 

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
      setBalance(null); 
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

  const rootUrl = process.env.NEXT_PUBLIC_ROOT_URL;
  const shareUrl = `https://telegram.me/share/url?url=${encodeURIComponent(rootUrl)}/&text=CVV888`;

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.headerContainer}>
          <h1>{translations('Dashboard.dashboard')}</h1>
          <a href={shareUrl} target="_blank" rel="noopener noreferrer">
            <button className={styles.button}>{translations('Dashboard.share')}</button>
          </a>
        </div>
        <div className={styles.buttons}>
          <Link href="/cabinet/cards" style={{ textDecoration: 'none' }} passHref>
            <button className={styles.buy}>{translations('Dashboard.cards')}</button>
          </Link>
          <Link href="/cabinet/buycard" style={{ textDecoration: 'none' }} passHref>
            <button className={styles.button}>{translations('Dashboard.order')}</button>
          </Link>
          <Link href="/cabinet/topup" style={{ textDecoration: 'none' }} passHref>
            <button className={styles.button}>{translations('Dashboard.topup')}</button>
          </Link>
        </div>
      </div>
      <div className={styles.totalWorth}>
        <span>{translations('Dashboard.balance')}</span>
        <h2>
          {isLoadingBalance ? `${translations('Cardlist.loading')}` : `$${balance}`}
        </h2>
      </div>
    </div>
  );
};

export default Dashboard;
