import React from 'react';
import styles from './Dashboard.module.css';
import Link from 'next/link';

const Dashboard = () => {
    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <div className={styles.headerContainer}>
                    <h1>Dashboard</h1>
                    <button className={styles.button}>Share</button>
                </div>
                <div className={styles.buttons}>
                    <Link href="/cards" style={{ textDecoration: 'none' }} passHref>

                        <button className={styles.buy}>My cards</button>
                    </Link>
                    <Link href="/buycard" style={{ textDecoration: 'none' }} passHref>
                        <button className={styles.button}>Order a card</button>
                    </Link>
                    <Link href="/topup" style={{ textDecoration: 'none' }} passHref>
                        <button className={styles.button}>Top up</button>
                    </Link>
                </div>
            </div>
            <div className={styles.totalWorth}>
                <span>Balance</span>
                <h2>$0</h2>
            </div>


        </div>
    );
};

export default Dashboard;
