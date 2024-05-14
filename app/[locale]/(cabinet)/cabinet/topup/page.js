"use client";

import React, { useState, useEffect } from 'react';
import styles from './topup.module.css';
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
          <h1>{translations('Topup.dashboard')}</h1>
          <a href={shareUrl} target="_blank" rel="noopener noreferrer">
            <button className={styles.button}>{translations('Topup.share')}</button>
          </a>
        </div>
        <div className={styles.buttons}>
          <Link href="/cabinet/cards" style={{ textDecoration: 'none' }} passHref>
            <button className={styles.button}>{translations('Topup.cards')}</button>
          </Link>
          <Link href="/cabinet/buycard" style={{ textDecoration: 'none' }} passHref>
            <button className={styles.button}>{translations('Topup.order')}</button>
          </Link>
          <Link href="/cabinet/topup" style={{ textDecoration: 'none' }} passHref>
            <button className={styles.buy}>{translations('Topup.topup')}</button>
          </Link>
        </div>
      </div>
      <div className={styles.totalWorth}>
        <span>{translations('Topup.balance')}</span>
        <h2>{isLoadingBalance ? `${translations('BuyCardId.loading')}` : `$${balance}`}</h2>
      </div>
      <div className={styles.contactmanager}>
        <p className={styles.contactmessage}>{translations('Topup.date')}</p>
        <p className={styles.telegramcontact}>{translations('Topup.telegram')} <a href="tg://resolve?domain=cvv888sales">@cvv888sales</a></p>
      </div>
    </div>
  );
};

export default Dashboard;
