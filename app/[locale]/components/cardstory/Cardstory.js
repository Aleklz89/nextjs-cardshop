"use client"
import React, { useState, useEffect } from "react";
import styles from './Cardstory.module.css';
import '../globals.css';
import { useTranslations } from "next-intl";
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import Transhistory from "../transhistory/Transhistory";

const groupTransactionsByDate = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    const date = format(parseISO(transaction.timestamp), 'dd/MM/yyyy');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push({
      time: format(parseISO(transaction.timestamp), 'HH:mm:ss'),
      type: transaction.type,
      description: transaction.description,
      amount: transaction.amount,
    });
    return acc;
  }, {});
};

const CardTransactionHistory = ({ transactions }) => {
  const translations = useTranslations();
  const [dailyTransactions, setDailyTransactions] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (transactions.length > 0) {
      const groupedTransactions = groupTransactionsByDate(transactions);
      setDailyTransactions(groupedTransactions);
    }
  }, [transactions]);

  const handleBalanceCheck = async () => {
    try {
      const response = await axios.get('/api/monitor');
      if (response.status === 200) {
        setMessage('Balance monitoring started successfully!');
      } else {
        setMessage('Failed to start balance monitoring.');
      }
    } catch (error) {
      console.error('Error starting balance monitoring:', error);
      setMessage('Error starting balance monitoring.');
    }
  };

  useEffect(() => {
    handleBalanceCheck();
  }, []);

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
                <div className={styles.transactionAmount} style={{ color: transaction.amount >= 0 ? 'green' : 'red' }}>
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
