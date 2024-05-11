"use client";

import React, { useState, useEffect } from 'react';
import styles from './Cardslist.module.css';
import Link from 'next/link';

const Cardslist = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 5000); 

        return () => clearTimeout(timer); 
    }, []);

    return (
        <div className={styles.assetsContainer}>
            <div className={styles.header}>
                <h2 className={styles.amount}>{loading ? 'Loading' : 'Cards: 0'}</h2>
            </div>
            {loading ? (
                <div className={styles.loadingContent}>
                    <div className={styles.loader}></div>
                    <p className={styles.loadingText}>Loading...</p>
                </div>
            ) : (
                <div className={styles.content}>
                    <p className={styles.description}>Nothing so far 💸</p>
                    <p className={styles.suggestion}>Order a card to get started!</p>
                    <Link href="/cabinet/buycard" style={{ textDecoration: 'none' }}>
                        <button className={styles.buyButton}>Order a card</button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Cardslist;