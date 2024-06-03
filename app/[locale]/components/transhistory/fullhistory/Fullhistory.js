"use client"
import React from 'react';
import styles from './Fullhistory.module.css';
import '../../globals.css'

const Fullhistory = ({ transactions }) => {
  console.log(transactions)
  return (
    <div className={styles.fullHistory}>
      {Object.entries(transactions).map(([date, dailyTransactions], index) => (
        <div key={index} className={styles.dailyTransactionBlock}>
          <div className={styles.transactionDate}>{date}</div>
          {dailyTransactions.map((transaction, idx) => (
            <div key={idx} className={styles.transactionItem}>
              <div className={styles.transactionTime}>{transaction.time}</div>
              <div className={styles.transactionType}>{transaction.type}</div>
              <div className={styles.transactionDescription}>{transaction.description}</div>
              <div className={styles.transactionAmount} style={{ color: transaction.amount >= 0 ? 'green' : 'red' }}>
                <p className={styles.number}>
                  {transaction.amount >= 0 ? `+${transaction.amount.toFixed(2)}` : transaction.amount.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Fullhistory;

