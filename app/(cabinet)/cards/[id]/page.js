"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import cardsData from '../../../cardsdata.json';
import styles from './id.module.css'
import Link from 'next/link';
import Image from 'next/image';

const CardPage = ({ params }) => {
  const router = useRouter();
  console.log(params.id)

  const card = cardsData.find(card => card.id === Number(params.id));

  if (!card) {
    return <p>Card not found</p>;
  }

  return (
    <div>
      <div className={styles.dashboard}>
        <Link href="/cards" style={{ textDecoration: 'none' }}>
          <div className={styles.backLink} >‹ Cards</div>
        </Link>
        <div className={styles.header}>
          <div className={styles.headerContainer}>
            <h2 className={styles.title}>{card.type} {card.date}</h2>
            <button className={styles.button}>Share</button>
          </div>
          <div className={styles.greyline}></div>
          <div className={styles.buttons}>
            <Link href={`/cards/${card.id}`} style={{ textDecoration: 'none' }}>
              <button className={styles.buy}>Overview</button>
            </Link>
            <Link href={`/cards/${card.id}/transfer`} style={{ textDecoration: 'none' }}>
              <button className={styles.button}>Transfer</button>
            </Link>
            <Link href={`/cards/${card.id}/auto`} style={{ textDecoration: 'none' }}>
              <button className={styles.button}>Auto top up</button>
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.cardblock}>
        <div className={styles.card}>
          <div className={styles.cardImageContainer}>
            <img src={card.imageUrl} alt={card.title} className={styles.cardImage} />
            <div className={styles.cardDetailsOverlay}>
              <p className={styles.cardBalance}>{card.balance}</p>
            </div>
          </div>
        </div>
        <div className={styles.desc}>
          <p className={styles.smalltitle}>Card requisites</p>
          <div className={styles.topblock}>
            <div className={styles.top}>
              <p className={styles.smalltext}>Card number</p>
              <p className={styles.maintext}>{card.number}</p>
            </div>
            <div className={styles.top}>
              <p className={styles.smalltext}>Card expiry date</p>
              <p className={styles.maintext}>{card.expiration}</p>
            </div>
            <div className={styles.top}>
              <p className={styles.smalltext}>CVC/CVV</p>
              <p className={styles.maintext}>{card.cvc}</p>
            </div>
          </div>
          <div className={styles.bottomblock}>
            <div className={styles.bottom}>
              <p className={styles.smalltext}>Card owner</p>
              <p className={styles.maintext}>{card.owner}</p>
            </div>
            <div className={styles.bottom}>
              <p className={styles.smalltext}>Address</p>
              <p className={styles.maintext}>{card.address}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CardPage;