"use client";

import React, { useState, useEffect } from 'react';
import styles from './Cardslist.module.css';
import Link from 'next/link';
import { useTranslations } from "next-intl"
import '../globals.css'

const Cardslist = () => {
    const translations = useTranslations()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 10000); 

        return () => clearTimeout(timer); 
    }, []);

    return (
        <div className={styles.assetsContainer}>
            <div className={styles.header}>
                <h2 className={styles.amount}>{loading ? `${translations('Cardlist.loading')}` : `${translations('Cards.cards')}: 0`}</h2>
            </div>
            {loading ? (
                <div className={styles.loadingContent}>
                    <div className={styles.loader}></div>
                    <p className={styles.loadingText}>{translations('Cardlist.loading')}</p>
                </div>
            ) : (
                <div className={styles.content}>
                    <p className={styles.description}>{translations('Cardlist.nothing')}</p>
                    <p className={styles.suggestion}>{translations('Cardlist.order')}</p>
                    <Link href="/cabinet/buycard" style={{ textDecoration: 'none' }}>
                        <button className={styles.buyButton}>{translations('Cardlist.card')}</button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Cardslist;