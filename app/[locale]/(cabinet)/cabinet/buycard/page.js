"use client";

import React, { useState, useEffect } from 'react';
import styles from './buycard.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from "next-intl";
import '../globals.css';

const Dashboard = () => {
  const translations = useTranslations();
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
      setUserId(3);
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

        const filteredCards = result.data.filter(card => {
          const binString = String(card.bin);
          return card.available_on_grade === 0 &&
            !binString.startsWith('537100') &&
            !binString.startsWith('532942') &&
            !binString.startsWith('542093') &&
            !binString.startsWith('424605') &&
            !binString.startsWith('489607');
        });

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
            <Link href={`/cabinet/buycard/${card.id}`} style={{ textDecoration: 'none' }} passHref key={card.id}>
              <div className={styles.visa} key={card.id}>
                <div className={styles.overlay}>
                  {translations('BuyCard.buy')}
                </div>
                <div className={styles.imgblock}>
                  <Image
                    src="/lot.svg"
                    alt="Visa Card"
                    height="100"
                    width="150"
                    className={styles.image}
                  />
                </div>
                <div className={styles.cardblock}>
                  <h3 className={styles.h3} >{String(card.bin).startsWith('5') ? 'Master' : 'Visa'}</h3>
                  <p className={styles.cardnumber}>{card.bin}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
