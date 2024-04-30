"use client"
import React, { useState, useEffect } from 'react';
import styles from './transactions.css';
import Filters from '../../components/filters/Filters';
import Transhistory from '../../components/transhistory/Transhistory';
import Fullhistory from '../../components/transhistory/fullhistory/Fullhistory';

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date('01/01/2019'),
    endDate: new Date('01/01/2026')
  });
  const [isEmpty, setIsEmpty] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState({});

  const transactions = {
    '04.03.2024': [
      { time: '7:33 PM', type: 'purchase', description: 'Debited from Main account', amount: -9.0, confirmed: true },
      { time: '7:33 PM', type: 'internal', description: 'Debited from Main account', amount: -20.0, confirmed: false },
    
    ],
    '04.04.2024': [
      { time: '7:32 PM', type: 'replenishment', description: 'Credited to Main Account', amount: 40.0, confirmed: true },
      { time: '7:32 PM', type: 'fee', description: 'Debited from Main account', amount: -0.4, confirmed: true },
      
    ],
   
    '04.05.2024': [
      { time: '7:32 PM', type: 'replenishment', description: 'Credited to Main Account', amount: 40.0, confirmed: true },
      { time: '7:32 PM', type: 'fee', description: 'Debited from Main account', amount: -0.4, confirmed: true },
     
    ],
    '04.06.2024': [
      { time: '7:32 PM', type: 'replenishment', description: 'Credited to Main Account', amount: 40.0, confirmed: true },
      { time: '7:32 PM', type: 'fee', description: 'Debited from Main account', amount: -0.4, confirmed: true },
    
    ],
    '04.07.2024': [
      { time: '7:32 PM', type: 'replenishment', description: 'Credited to Main Account', amount: 40.0, confirmed: true },
      { time: '7:32 PM', type: 'fee', description: 'Debited from Main account', amount: -0.4, confirmed: true },
      
    ],
  };

  useEffect(() => {
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    const isMatch = (transaction, transactionDateStr) => {
      const typeMatch = transaction.type.toLowerCase().includes(lowerCaseSearchQuery);
      const descriptionMatch = transaction.description.toLowerCase().includes(lowerCaseSearchQuery);
      const transactionDate = new Date(transactionDateStr);
      const start = new Date(dateRange.startDate)
      const end = new Date(dateRange.endDate)
      const dateMatch = transactionDate >= start && transactionDate <= end;
      
      let filterMatch = true;
      switch (filterType) {
        case 'confirmed':
          filterMatch = transaction.confirmed === true;
          break;
        case 'declined':
          filterMatch = transaction.confirmed === false;
          break;
        case 'deposit':
          filterMatch = transaction.amount > 0;
          break;
        case 'withdraw':
          filterMatch = transaction.amount < 0;
          break;
        default:
          break;
      }
      return (typeMatch || descriptionMatch) && filterMatch && dateMatch;
    };

    const newFilteredTransactions = Object.entries(transactions).reduce((acc, [date, dailyTransactions]) => {
      const filteredDailyTransactions = dailyTransactions.filter(transaction => isMatch(transaction, date));
      if (filteredDailyTransactions.length > 0) {
        acc[date] = filteredDailyTransactions;
      }
      return acc;
    }, {});

    setFilteredTransactions(newFilteredTransactions);
    setIsEmpty(Object.keys(newFilteredTransactions).length === 0);
  }, [searchQuery, filterType, dateRange]);

  return (
    <main>
      <Filters setSearchQuery={setSearchQuery} setFilterType={setFilterType} setDateRange={setDateRange} />
      {!isEmpty ? (
        <Fullhistory transactions={filteredTransactions} />
      ) : (
        <Transhistory />
      )}
    </main>
  );

  function checkDateMatch(transactionDateStr, dateRange) {
    const transactionDate = new Date(transactionDateStr);
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    return transactionDate >= startDate && transactionDate <= endDate;
  }
};

export default Transactions;
