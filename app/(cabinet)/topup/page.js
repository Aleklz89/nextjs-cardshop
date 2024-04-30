import React from 'react';
import styles from './topup.module.css';
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

                        <button className={styles.button}>My cards</button>
                    </Link>
                    <Link href="/buycard" style={{ textDecoration: 'none' }} passHref>
                        <button className={styles.button}>Order a card</button>
                    </Link>
                    <Link href="/topup" style={{ textDecoration: 'none' }} passHref>
                        <button className={styles.buy}>Top up</button>
                    </Link>
                </div>
            </div>
            <div className={styles.totalWorth}>
                <span>Balance</span>
                <h2>$0</h2>
            </div>
            <div className={styles.contactmanager}>
                <p className={styles.contactmessage}>For up-to-date requisites, please contact the manager.</p>
                <p className={styles.telegramcontact}>Telegram: <a href="tg://resolve?domain=cvv888sales">@cvv888sales</a></p>
            </div>

        </div>
    );
};

export default Dashboard;
