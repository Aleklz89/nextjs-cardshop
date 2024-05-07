"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './id.module.css';

export default function CardPage() {
  const pathname = usePathname();
  const [uuid, setUuid] = useState(null);
  const [cardsData, setCardsData] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardDetails, setCardDetails] = useState({ number: '', cvx2: '', exp_month: '', exp_year: '' });

  const fetchAllCards = async () => {
    try {
      const response = await fetch('https://api.epn.net/card', {
        headers: {
          'accept': 'application/json',
          'Authorization': 'Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ',
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setCardsData(data.data);
    } catch (error) {
      console.error('Error fetching all cards:', error);
    }
  };

  const fetchCardDetails = async (uuid) => {
    try {
      const response = await fetch(`https://api.epn.net/card/${uuid}/showpan`, {
        headers: {
          'accept': 'application/json',
          'Authorization': 'Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ',
          'X-CSRF-TOKEN': '',
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setCardDetails({
        number: data.data.number,
        cvx2: data.data.cvx2,
        exp_month: data.data.exp_month,
        exp_year: data.data.exp_year,
      });
    } catch (error) {
      console.error('Error fetching card details:', error);
    }
  };

  useEffect(() => {
    // Извлекаем UUID из текущего маршрута
    const match = pathname.match(/\/([a-f0-9-]+)$/i);
    if (match && match[1]) {
      setUuid(match[1]);
    }
  }, [pathname]);

  useEffect(() => {
    fetchAllCards();
  }, []);

  useEffect(() => {
    if (uuid !== null && cardsData.length > 0) {
      const card = cardsData.find(card => card.uuid === uuid);
      setSelectedCard(card || null);

      if (card && card.uuid) {
        fetchCardDetails(card.uuid);
      }
    }
  }, [uuid, cardsData]);

  if (!selectedCard) {
    return <p>Card not found</p>;
  }

  return (
    <div>
      <div className={styles.dashboard}>
        <Link href="/cabinet/cards" style={{ textDecoration: 'none' }}>
          <div className={styles.backLink}>‹ Cards</div>
        </Link>
        <div className={styles.header}>
          <div className={styles.headerContainer}>
            <h2 className={styles.title}>{selectedCard.tariff.name} {selectedCard.ordered_at}</h2>
            <button className={styles.button}>Share</button>
          </div>
          <div className={styles.greyline}></div>
          <div className={styles.buttons}>
            <Link href={`/cabinet/cards/${selectedCard.uuid}`} style={{ textDecoration: 'none' }}>
              <button className={styles.buy}>Overview</button>
            </Link>
            <Link href={`/cabinet/cards/${selectedCard.uuid}/transfer`} style={{ textDecoration: 'none' }}>
              <button className={styles.button}>Transfer</button>
            </Link>
            <Link href={`/cabinet/cards/${selectedCard.uuid}/auto`} style={{ textDecoration: 'none' }}>
              <button className={styles.button}>Auto top up</button>
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.cardblock}>
        <div className={styles.card}>
          <div className={styles.cardImageContainer}>
            <img src="https://i.ibb.co/k1LcxWK/Screenshot-1124-removebg-preview.png" className={styles.cardImage} />
            <div className={styles.cardDetailsOverlay}>
              <p className={styles.cardBalance}>${selectedCard.account.balance}</p>
            </div>
          </div>
        </div>
        <div className={styles.desc}>
          <p className={styles.smalltitle}>Card requisites</p>
          <div className={styles.topblock}>
            <div className={styles.top}>
              <p className={styles.smalltext}>Card number</p>
              <p className={styles.maintext}>{cardDetails.number}</p>
            </div>
            <div className={styles.top}>
              <p className={styles.smalltext}>Card expiry date</p>
              <p className={styles.maintext}>{cardDetails.exp_month}/{cardDetails.exp_year}</p>
            </div>
            <div className={styles.top}>
              <p className={styles.smalltext}>CVC/CVV</p>
              <p className={styles.maintext}>{cardDetails.cvx2}</p>
            </div>
          </div>
          <div className={styles.bottomblock}>
            <div className={styles.bottom}>
              <p className={styles.smalltext}>Card owner</p>
              <p className={styles.maintext}>{selectedCard.holder_name}</p>
            </div>
            <div className={styles.bottom}>
              <p className={styles.smalltext}>Address</p>
              <p className={styles.maintext}>{selectedCard.holder_address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}