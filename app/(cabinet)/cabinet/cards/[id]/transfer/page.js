"use client"


import React from 'react';
import { useRouter } from 'next/navigation';
import cardsData from '../../../../../cardsdata.json';
import styles from './transfer.module.css'
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
                            <button className={styles.buy}>Transfer</button>
                        </Link>
                        <Link href={`/cabinet/cards/${card.id}/auto`} style={{ textDecoration: 'none' }}>
                            <button className={styles.button}>Auto top up</button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className={styles.transferForm}>
                <h2>Between your accounts and cards</h2>

                <div className={styles.formGroup}>
                    <label htmlFor="fromAccount">From</label>
                    <select id="fromAccount" onChange={(e) => setFromAccount(e.target.value)}>
                        <option>Main account - $9.60</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="toAccount">To</label>
                    <select id="toAccount">
                        <option>Advertise 03.04.2024, 22:33 - ****7892 - $20.00</option>
                        <option>Advertise 03.04.2024, 22:33 - ****7892 - $20.00</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="amount">Sum</label>
                    <input
                        id="amount"
                        type="text"
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount, $"
                    />
                    <button className={styles.maxButton}>MAX</button>
                </div>

                <p className={styles.fee}>Transfer fee: 5%</p>

                <button className={styles.transferButton}>Transfer $9.60</button>
            </div>
        </div>
    );
};

export default CardPage;