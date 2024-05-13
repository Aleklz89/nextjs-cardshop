"use client"
import React, { useState, useEffect } from 'react';
import styles from './Transhistory.module.css';
import { useTranslations } from "next-intl"

const Transhistory = () => {
    const translations = useTranslations()
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000);

        return () => clearTimeout(timer); 
    }, []);

    return (
        <div className={styles.assetsContainer}>
            <div className={styles.content}>
                {isLoading ? (
                    <div className={styles.loader}></div>
                     
                ) : (
                    <>
                        <p className={styles.suggestion}>{translations('TransHistory.transactions')}</p>
                        <p className={styles.description}>{translations('TransHistory.activity')}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Transhistory;
