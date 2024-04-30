import React from 'react';
import Dashboard from "../../components/dashboard/Dashboard";
import Cardslist from "../../components/cardlist/Cardslist";
import Fullcards from "../../components/Fullcards/Fullcards";
import styles from './cards.css';
import cardsdata from '../../cardsdata.json'


export default function Cards() {
  const cards = cardsdata;

  return (
    <main className={styles.mainContainer}>
      <Dashboard />
      {cards.length > 0 ? <Fullcards cards={cards} /> : <Cardslist />}
    </main>
  );
}
