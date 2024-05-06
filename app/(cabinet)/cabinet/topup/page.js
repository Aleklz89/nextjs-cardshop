"use client";

import React, { useState, useEffect } from 'react';
import styles from './topup.module.css';
import Link from 'next/link';

const Dashboard = () => {
    const [balance, setBalance] = useState(0); 
  const [userId, setUserId] = useState(null);


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
    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <div className={styles.headerContainer}>
                    <h1>Dashboard</h1>
                    <button className={styles.button}>Share</button>
                </div>
                <div className={styles.buttons}>
                    <Link href="/cabinet/cards" style={{ textDecoration: 'none' }} passHref>

                        <button className={styles.button}>My cards</button>
                    </Link>
                    <Link href="/cabinet/buycard" style={{ textDecoration: 'none' }} passHref>
                        <button className={styles.button}>Order a card</button>
                    </Link>
                    <Link href="/cabinet/topup" style={{ textDecoration: 'none' }} passHref>
                        <button className={styles.buy}>Top up</button>
                    </Link>
                </div>
            </div>
            <div className={styles.totalWorth}>
                <span>Balance</span>
                <h2>${balance}</h2>
            </div>
            <div className={styles.contactmanager}>
                <p className={styles.contactmessage}>For up-to-date requisites, please contact the manager.</p>
                <p className={styles.telegramcontact}>Telegram: <a href="tg://resolve?domain=cvv888sales">@cvv888sales</a></p>
            </div>

        </div>
    );
};

export default Dashboard;
