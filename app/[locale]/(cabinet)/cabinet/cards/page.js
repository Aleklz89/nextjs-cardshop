"use client";

import React, { useEffect, useState } from 'react';
import Dashboard from "../../../components/dashboard/Dashboard";
import Cardslist from "../../../components/cardlist/Cardslist";
import Fullcards from "../../../components/Fullcards/Fullcards";
import styles from './cards.css';
import '../globals.css';

export default function Cards() {
  const [userId, setUserId] = useState(null);
  const [cardsCount, setCardsCount] = useState(0);

  // Function to set the theme
  const applyTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Fetch User ID
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

  // Fetch User Cards
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

  useEffect(() => {
    // Apply the theme before rendering the component
    applyTheme();

    // Fetch user data
    const fetchData = async () => {
      await fetchUserId();
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCards = async () => {
      if (userId) {
        const ids = await fetchUserCards(userId);
        setCardsCount(ids.length);
      }
    };

    fetchCards();
  }, [userId]);

  return (
    <main className={styles.mainContainer}>
      <Dashboard />
      {cardsCount > 0 ? <Fullcards /> : <Cardslist />}
    </main>
  );
}
