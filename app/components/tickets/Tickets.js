import React from 'react';
import styles from './Tickets.module.css';
import Link from 'next/link';

const Tickets = () => {
    return (
        <div className={styles.assetsContainer}>
            <div className={styles.content}>
                <p className={styles.description}>As long as it's empty 💸</p>
                <p className={styles.suggestion}>If you have any questions, we are always ready to answer them.</p>
                <Link href="/newticket" className={styles.dropbutton} style={{ textDecoration: 'none' }} passHref>
                    <button className={styles.buyButton}>Create a ticket</button>
                </Link>
            </div>
        </div>
    );
};

export default Tickets;