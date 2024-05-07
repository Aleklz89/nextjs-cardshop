"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import cardsData from '../../../../../cardsdata.json';
import styles from './auto.module.css'
import Link from 'next/link';
import Image from 'next/image';

const CardPage = ({ params }) => {
    const router = useRouter();
    console.log(params.id)

    const card = cardsData.find(card => card.id === Number(params.id));
    if (!card) {
        return <p>Card not found</p>;
    }

    const rootUrl = process.env.NEXT_PUBLIC_ROOT_URL;
    const shareUrl = `https://telegram.me/share/url?url=${encodeURIComponent(rootUrl)}/&text=CVV888`;


    return (
        <div>
            <div className={styles.dashboard}>
                <Link href="/cabinet/cards" style={{ textDecoration: 'none' }}>
                    <div className={styles.backLink} >‹ Cards</div>
                </Link>
                <div className={styles.header}>
                    <div className={styles.headerContainer}>
                        <h2 className={styles.title}>{card.type} {card.date}</h2>
                        <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                            <button className={styles.button}>Share</button>
                        </a>
                    </div>
                    <div className={styles.greyline}></div>
                    <div className={styles.buttons}>
                        <Link href={`/cabinet/cards/${card.id}`} style={{ textDecoration: 'none' }}>
                            <button className={styles.button}>Overview</button>
                        </Link>
                        <Link href={`/cabinet/cards/${card.id}/transfer`} style={{ textDecoration: 'none' }}>
                            <button className={styles.button}>Transfer</button>
                        </Link>
                        <Link href={`/cabinet/cards/${card.id}/auto`} style={{ textDecoration: 'none' }}>
                            <button className={styles.buy}>Auto top up</button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className={styles.autoRefill}>
                <h2>Auto-refill</h2>
                <p>Enable auto-replenishment of your card from your linked account to ensure funds are available on your card at any time</p>

                <div className={styles.field}>
                    <label htmlFor="threshold">Enter the amount at which auto-replenishment will work</label>
                    <input
                        id="threshold"
                        type="number"
                        placeholder="When the card balance is lower"
                        min="0"
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="amount">Auto-refill amount</label>
                    <input
                        id="amount"
                        type="number"
                        placeholder="Replenish by amount"
                        min="0"
                    />
                </div>

                <div className={styles.commission}>Top-up commission: 5%</div>

                <button className={styles.saveButton}>Save</button>
            </div>
        </div>
    );
};

export default CardPage;