import React from 'react';
import styles from './Cardslist.module.css';
import Link from 'next/link';

const Cardslist = () => {
    return (
        <div className={styles.assetsContainer}>
            <div className={styles.header}>
                <h2 className={styles.amount}>Cards: 0</h2>
            </div>
            <div className={styles.content}>
                <p className={styles.description}>Nothing so far 💸</p>
                <p className={styles.suggestion}>Order a card to get started!</p>
                <Link href="/cabinet/buycard" style={{ textDecoration: 'none' }}>
                    <button className={styles.buyButton}>Order a card</button>
                </Link>
            </div>
        </div>
    );
};

export default Cardslist;