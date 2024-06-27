"use client";

import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import Link from 'next/link';
import { useTranslations } from "next-intl"
import '../globals.css'


const Dashboard = () => {
  const translations = useTranslations()
  const [balance, setBalance] = useState(null);
  const [holdBalance, setHoldBalance] = useState(null);
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
    }
  };

  const fetchAllCards = async () => {
    let allCards = [];
    let currentPage = 1;
    const perPage = 25;

    try {
      while (true) {
        const response = await fetch(`https://api.epn.net/card?page=${currentPage}`, {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ',
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        allCards = allCards.concat(data.data);

        if (data.meta.current_page * perPage >= data.meta.total) {
          break;
        }
        currentPage++;
      }
      return allCards;
    } catch (error) {
      console.error('Error fetching all cards:', error);
    }
  };

  const fetchUserCards = async (userId) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + `/api/cabinet?id=${userId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data.user.cardsIds || [];
    } catch (error) {
      console.error('Error fetching user cards:', error);
      return [];
    }
  };

  const fetchCardTransactions = async (cardId) => {
    let allTransactions = [];
    let currentPage = 1;

    try {
      while (true) {
        const response = await fetch(`https://api.epn.net/transaction`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ',
            'X-CSRF-TOKEN': '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'output,output_transfer',
            account_uuid: cardId,
            page: currentPage
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error: ${response.status}, ${errorText}`);
        }

        const data = await response.json();
        allTransactions = allTransactions.concat(data.data);

        if (!data.links.next) {
          break;
        }
        currentPage++;
      }


    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);


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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
