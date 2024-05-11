"use client";

import React, { useState, useEffect } from 'react';
import styles from './buycard.module.css';
import Link from 'next/link';
import Image from 'next/image';

const Dashboard = () => {
  const [balance, setBalance] = useState(null); // Начальное значение - `null`
  const [userId, setUserId] = useState(null);
  const [cardsdata, setCardsdata] = useState([]);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true); // Добавлено состояние загрузки баланса

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
      setBalance(null); // При ошибке устанавливаем `null`
    } finally {
      setIsLoadingBalance(false); // Отключаем состояние загрузки
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
    async function fetchCardBins() {
      try {
        const response = await fetch('https://api.epn.net/card-bins', {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();

        // Фильтрация только тех элементов, у которых "available_on_grade": 0
        const filteredCards = result.data.filter(card => card.available_on_grade === 0);

        // Установка отфильтрованных данных в состояние
        setCardsdata(filteredCards);
      } catch (error) {
        console.error('Error fetching card bins:', error);
      }
    }

    fetchCardBins();
  }, []);

  const rootUrl = process.env.NEXT_PUBLIC_ROOT_URL;
  const shareUrl = `https://telegram.me/share/url?url=${encodeURIComponent(rootUrl)}/&text=CVV888`;

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.headerContainer}>
          <h1>Dashboard</h1>
          <a href={shareUrl} target="_blank" rel="noopener noreferrer">
            <button className={styles.button}>Share</button>
          </a>
        </div>
        <div className={styles.buttons}>
          <Link href="/cabinet/cards" style={{ textDecoration: 'none' }} passHref>
            <button className={styles.button}>My cards</button>
          </Link>
          <Link href="/cabinet/shop" style={{ textDecoration: 'none' }} passHref>
            <button className={styles.buy}>Order a card</button>
          </Link>
          <Link href="/cabinet/topup" style={{ textDecoration: 'none' }} passHref>
            <button className={styles.button}>Top up</button>
          </Link>
        </div>
      </div>
      <div className={styles.totalWorth}>
        <span>Balance</span>
        <h2>
          {isLoadingBalance ? "Loading balance..." : `$${balance}`}
        </h2>
      </div>

      <div className={styles.cardissuecontainer}>
        <div className={styles.cardissuecontent}>
          <h2>Become the owner of CVV888 card</h2>
          <p>A wide selection of cards to suit everyone's needs</p>
          <div className={styles.cardissuedetails}>
            <div className={styles.detail}>
              <span className={styles.price}>from $10/month</span>
              <span className={styles.description}>Starting next month</span>
            </div>
            <div className={styles.detail}>
              <span className={styles.price}>from 10%</span>
              <span className={styles.description}>Commission for replenishment</span>
            </div>
          </div>
        </div>
        <div>
          <Image
            src="https://i.ibb.co/Rj3mssL/imgonline-com-ua-Replace-color-fs5psh-Iw-ROo-S-removebg-preview.png"
            alt="Logo"
            height="100"
            width="100"
          />
        </div>
      </div>
      <div className={styles.advertisingcontainer}>
        <div className={styles.header}>
          <h2>Advertising <span className={styles.bincount}>BINs: {cardsdata.length}</span></h2>
          <p>Ad-cards are designed and optimized to pay for ads. We recommend choosing ad-BINs to work with, they will perform better</p>
        </div>

        <div className={styles.cardscontainer}>
          {cardsdata.map((card) => (
            <div className={styles.visa} key={card.id}>
              <div className={styles.cardblock}>
                <h3>Visa</h3>
                <p className={styles.cardnumber}>{String(card.bin).slice(0, 6)}</p>
                <Link href={`/cabinet/buycard/${card.id}`} style={{ textDecoration: 'none' }} passHref key={card.id}>
                  <button className={styles.buybutton}>Buy</button>
                </Link>
              </div>
              <div className={styles.imgblock}>
                <Image
                  src="https://i.ibb.co/k1LcxWK/Screenshot-1124-removebg-preview.png"
                  alt="Visa Card"
                  height="100"
                  width="150"
                  className={styles.image}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
