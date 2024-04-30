import React from 'react';
import styles from './Counter.module.css';
import Link from 'next/link';

const AccountLevels = () => {
  return (
    <div>
      <div className={styles.navigation}>
        <Link href="/cards" style={{ textDecoration: 'none' }}>
          <div className={styles.backLink} >‹ Dashboard</div>
        </Link>
        <h1 className={styles.title}>Account levels</h1>
      </div>
      <div className={styles.accountLevels}>
        <div className={styles.levelInfo}>
          <h2>Your account level: 1</h2>
          <div className={styles.progressBar}>
            <div className={styles.progress}></div>
          </div>
          <p>TopUps in 30 days: $0</p>
          <p>$1 000 left of $1 000</p>
        </div>
        <div className={styles.requirements}>
          <h2>To get a new level you need</h2>
          <ul>
            <li>Top up on $1 000</li>
            <li>KYC</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccountLevels;
