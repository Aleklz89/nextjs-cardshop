"use client";

import React, { useState, useEffect } from 'react';
import styles from './Fullcards.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from "next-intl"

const Fullcards = () => {
  const translations = useTranslations()
  const [userId, setUserId] = useState(null);
  const [userCards, setUserCards] = useState([]);
  const [cardsData, setCardsData] = useState([]);

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

  const fetchAllCards = async () => {
    try {
      const response = await fetch('https://api.epn.net/card', {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ',
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

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId !== null) {
      fetchUserCards(userId).then(setUserCards);
    }
  }, [userId]);

  useEffect(() => {
    fetchAllCards();
  }, []);


  const filteredCards = cardsData.filter((card) => userCards.includes(card.external_id));

  return (
    <div className={styles.assetsContainer}>
      <div className={styles.header}>
        <h2 className={styles.amount}>{translations('Fullcards.cards')} {filteredCards.length}</h2>
      </div>

      <div className={styles.cardsContainer}>
        {filteredCards.map((card) => (
          <Link
            href={`/cabinet/cards/${card.uuid}`}
            style={{ textDecoration: 'none' }}
            passHref
            key={card.uuid}
          >
            <div className={styles.card}>
              <div className={styles.cardImageContainer}>
                <img
                  src="https://i.ibb.co/k1LcxWK/Screenshot-1124-removebg-preview.png"
                  className={styles.cardImage}
                />
                <div className={styles.cardDetailsOverlay}>
                  <h3 className={styles.cardNumber}>{card.mask}</h3>
                  <p className={styles.cardBalance}>${card.account.balance.toFixed(2)}</p>
                </div>
              </div>
              <h3 className={styles.cardTitle}>{card.holder_name}</h3>
              <p className={styles.cardDescription}>{card.tariff.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Fullcards;