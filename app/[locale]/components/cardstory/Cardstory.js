'use client'
import React, { useState, useEffect } from "react";
import styles from './Cardstory.module.css';
import '../globals.css';
import { useTranslations } from "next-intl";
import { format, parseISO } from 'date-fns';
import Transhistory from "../transhistory/Transhistory";

const groupTransactionsByDate = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    const date = format(parseISO(transaction.created_at), 'dd/MM/yyyy');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push({
      time: format(parseISO(transaction.created_at), 'HH:mm:ss'),
      type: transaction.type_enum,
      description: transaction.description,
      amount: parseFloat(transaction.amount),
    });
    return acc;
  }, {});
};

const CardTransactionHistory = ({ transactions }) => {
  const translations = useTranslations();
  const [dailyTransactions, setDailyTransactions] = useState({});

  useEffect(() => {
    if (transactions.length > 0) {
      const groupedTransactions = groupTransactionsByDate(transactions);
      setDailyTransactions(groupedTransactions);
    }
  }, [transactions]);

  return (
    <div className={styles.fullHistory}>
      {Object.keys(dailyTransactions).length > 0 ? (
        Object.entries(dailyTransactions).map(([date, transactions], idx) => (
          <div key={idx} className={styles.dailyTransactionBlock}>
            <div className={styles.transactionDate}>{date}</div>
            {transactions.map((transaction, index) => (
              <div key={index} className={styles.transactionItem}>
                <div className={styles.transactionTime}>{transaction.time}</div>
                <div className={styles.transactionType}>{transaction.type}</div>
                <div className={styles.transactionDescription}>{transaction.description}</div>
                <div className={styles.transactionAmount} style={{ color: transaction.amount >= 0 ? '#2A27A4' : 'red' }}>
                  <p className={styles.number}>
                    {transaction.amount >= 0 ? `+${transaction.amount.toFixed(2)}` : transaction.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        <Transhistory />
      )}
    </div>
  );
};

export default CardTransactionHistory;