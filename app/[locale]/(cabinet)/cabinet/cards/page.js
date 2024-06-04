"use client";

import React, { useEffect, useState } from 'react';
import Dashboard from "../../../components/dashboard/Dashboard";
import Cardslist from "../../../components/cardlist/Cardslist";
import Fullcards from "../../../components/Fullcards/Fullcards";
import styles from './cards.css';
import '../globals.css';

export default function Cards() {
  const [userId, setUserId] = useState(null);
  const [cards, setCards] = useState([]);
  const [cardsCount, setCardsCount] = useState(0);

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
      const cardsIds = data.user.cardsIds || [];
      console.log("User Cards IDs:", cardsIds);
      return cardsIds;
    } catch (error) {
      console.error('Error fetching user cards:', error);
      return [];
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
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserId();
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCards = async () => {
      if (userId) {
        const cardsIds = await fetchUserCards(userId);
        const allCards = await fetchAllCards();

        const userCards = allCards.filter(card => cardsIds.includes(card.external_id));
        const activeCards = userCards.filter(card => card.blocked_at === null);

        setCards(activeCards);
        setCardsCount(activeCards.length);
      }
    };

    fetchCards();
  }, [userId]);

  return (
    <main className={styles.mainContainer}>
      <Dashboard />
      {cardsCount > 0 ? <Fullcards cards={cards} /> : <Cardslist />}
    </main>
  );
}
