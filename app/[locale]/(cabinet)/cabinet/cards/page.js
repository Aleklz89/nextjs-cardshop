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
    console.time('FetchUserId');
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
    console.timeEnd('FetchUserId');
  };

  const fetchUserCards = async (userId) => {
    console.time('FetchUserCards');
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + `/api/cabinet?id=${userId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      const cardsIds = data.user.cardsIds || [];
      console.timeEnd('FetchUserCards');
      return cardsIds;
    } catch (error) {
      console.error('Error fetching user cards:', error);
      console.timeEnd('FetchUserCards');
      return [];
    }
  };

  const fetchAllCards = async () => {
    console.time('FetchAllCards');
    let allCards = [];
    let currentPage = 1;
    const perPage = 25;

    try {
      while (true) {
        console.time(`FetchPage ${currentPage}`);
        const response = await fetch(`https://api.epn.net/card?page=${currentPage}`, {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ',
          },
        });
        console.timeEnd(`FetchPage ${currentPage}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        console.time(`ParsePage ${currentPage}`);
        const data = await response.json();
        console.timeEnd(`ParsePage ${currentPage}`);
        
        allCards = allCards.concat(data.data);

        if (data.meta.current_page * perPage >= data.meta.total) {
          break;
        }
        currentPage++;
      }
      console.timeEnd('FetchAllCards');
      return allCards;
    } catch (error) {
      console.error('Error fetching all cards:', error);
      console.timeEnd('FetchAllCards');
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      console.time('FetchData');
      await fetchUserId();
      console.timeEnd('FetchData');
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCards = async () => {
      if (userId) {
        console.time('FetchCards');
        console.time('FetchUserCardsAndAllCards');
        const cardsIds = await fetchUserCards(userId);
        const allCards = await fetchAllCards();
        console.timeEnd('FetchUserCardsAndAllCards');

        console.time('FilterUserCards');
        const userCards = allCards.filter(card => cardsIds.includes(card.external_id));
        console.timeEnd('FilterUserCards');

        console.time('FilterActiveCards');
        const activeCards = userCards.filter(card => card.blocked_at === null);
        console.timeEnd('FilterActiveCards');

        setCards(activeCards);
        setCardsCount(activeCards.length);
        console.timeEnd('FetchCards');
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
