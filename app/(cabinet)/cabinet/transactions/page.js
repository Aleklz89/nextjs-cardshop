"use client";
import React, { useState, useEffect } from 'react';
import styles from './transactions.css';
import Filters from '../../../components/filters/Filters';
import Transhistory from '../../../components/transhistory/Transhistory';
import Fullhistory from '../../../components/transhistory/fullhistory/Fullhistory';

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date('01/01/2019'),
    endDate: new Date('01/01/2040')
  });
  const [isEmpty, setIsEmpty] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState({});

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/gettrans');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    const isMatch = (transaction, transactionDateStr) => {
      const typeMatch = transaction.type.toLowerCase().includes(lowerCaseSearchQuery);
      const descriptionMatch = transaction.description.toLowerCase().includes(lowerCaseSearchQuery);
      const transactionDate = new Date(transactionDateStr);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      const dateMatch = transactionDate >= start && transactionDate <= end;

      let filterMatch = true;
      switch (filterType) {
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

    const newFilteredTransactions = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.timestamp).toLocaleDateString('en-GB');
      if (isMatch(transaction, date)) {
        if (!acc[date]) acc[date] = [];
        acc[date].push({
          time: new Date(transaction.timestamp).toLocaleTimeString('en-GB'),
          type: transaction.type,
          description: transaction.description,
          amount: transaction.amount
        });
      }
      return acc;
    }, {});

    setFilteredTransactions(newFilteredTransactions);
    setIsEmpty(Object.keys(newFilteredTransactions).length === 0);
  }, [searchQuery, filterType, dateRange, transactions]);

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
};

export default Transactions;