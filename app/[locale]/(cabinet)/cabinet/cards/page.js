"use client";

import React, { useEffect, useState } from 'react';
import Dashboard from "../../../components/dashboard/Dashboard";
import Fullcards from "../../../components/Fullcards/Fullcards";
import Cardslist from "../../../components/cardlist/Cardslist";
import styles from './cards.css';
import '../globals.css';

export default function Cards() {
  const [userId, setUserId] = useState(null);
  const [cards, setCards] = useState([]);
  const [cardsCount, setCardsCount] = useState(0);

  const fetchUserId = async () => {
    console.time('FetchUserId');
    try {
      console.log('Fetching user ID...');
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + '/api/token');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setUserId(17);
      console.log('User ID fetched:', data.userId);
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
    console.timeEnd('FetchUserId');
  };

  const fetchUserCards = async (userId) => {
    console.time('FetchUserCards');
    try {
      console.log('Fetching user cards...');
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + `/api/cabinet?id=${userId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      const cardsIds = data.user.cardsIds || [];
      console.log('User cards fetched:', cardsIds);
      console.timeEnd('FetchUserCards');
      return cardsIds;
    } catch (error) {
      console.error('Error fetching user cards:', error);
      console.timeEnd('FetchUserCards');
      return [];
    }
  };

  const fetchCardById = async (cardId) => {
    console.log(`Fetching card with ID: ${cardId}`);
    try {
      const response = await fetch(`https://api.epn.net/card?external_id=${cardId}`, {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ',
          'X-CSRF-TOKEN': '',
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log(`Card fetched:`, data.data);
      return data.data;
    } catch (error) {
      console.error(`Error fetching card with ID ${cardId}:`, error);
      return null;
    }
  };

  const fetchAllCardsByIds = async (cardIds) => {
    console.time('FetchAllCardsByIds');
    let allCards = [];

    try {
      const cardFetchPromises = cardIds.map(cardId => fetchCardById(cardId));
      const cardsData = await Promise.all(cardFetchPromises);
      allCards = cardsData.flat().filter(card => card !== null);

      console.log('All cards fetched by IDs:', allCards);
      console.timeEnd('FetchAllCardsByIds');
      return allCards;
    } catch (error) {
      console.error('Error fetching all cards by IDs:', error);
      console.timeEnd('FetchAllCardsByIds');
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
        const allCards = await fetchAllCardsByIds(cardsIds);
        console.timeEnd('FetchUserCardsAndAllCards');

        console.time('FilterActiveCards');
        const activeCards = allCards.filter(card => card.blocked_at === null);
        console.log('Filtered active cards:', activeCards);
        console.timeEnd('FilterActiveCards');

        setCards(activeCards);
        setCardsCount(activeCards.length);
        console.log('Active cards set:', activeCards);
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
