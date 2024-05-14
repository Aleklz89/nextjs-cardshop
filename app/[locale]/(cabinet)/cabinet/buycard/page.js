"use client";

import React, { useState, useEffect } from 'react';
import styles from './buycard.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from "next-intl"

const Dashboard = () => {
  const translations = useTranslations()
  const [balance, setBalance] = useState(null);
  const [userId, setUserId] = useState(null);
  const [cardsdata, setCardsdata] = useState([]);
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

        const filteredCards = result.data.filter(card => card.available_on_grade === 0);


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
          <h1>{translations('BuyCard.dashboard')}</h1>
          <a href={shareUrl} target="_blank" rel="noopener noreferrer">
            <button className={styles.button}>{translations('BuyCard.share')}</button>
          </a>
        </div>
        <div className={styles.buttons}>
          <Link href="/cabinet/cards" style={{ textDecoration: 'none' }} passHref>
            <button className={styles.button}>{translations('BuyCard.cards')}</button>
          </Link>
          <Link href="/cabinet/buycard" style={{ textDecoration: 'none' }} passHref>
            <button className={styles.buy}>{translations('BuyCard.order')}</button>
          </Link>
          <Link href="/cabinet/topup" style={{ textDecoration: 'none' }} passHref>
            <button className={styles.button}>{translations('BuyCard.topup')}</button>
          </Link>
        </div>
      </div>
      <div className={styles.totalWorth}>
        <span>{translations('BuyCard.balance')}</span>
        <h2>
          {isLoadingBalance ? "Loading balance..." : `$${balance}`}
        </h2>
      </div>

      <div className={styles.cardissuecontainer}>
        <div className={styles.cardissuecontent}>
          <h2>{translations('BuyCard.become')}</h2>
          <p>{translations('BuyCard.wide')}</p>
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
          <h2>{translations('BuyCard.market')} <span className={styles.bincount}>{translations('BuyCard.bin')}: {cardsdata.length}</span></h2>
          <p>{translations('BuyCard.design')}</p>
        </div>

        <div className={styles.cardscontainer}>
          {cardsdata.map((card) => (
            <div className={styles.visa} key={card.id}>
              <div className={styles.cardblock}>
                <h3>Visa</h3>
                <p className={styles.cardnumber}>{String(card.bin).slice(0, 6)}</p>
                <Link href={`/cabinet/buycard/${card.id}`} style={{ textDecoration: 'none' }} passHref key={card.id}>
                  <button className={styles.buybutton}>{translations('BuyCard.buy')}</button>
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
