"use client";
import React, { useState, useEffect } from 'react';
import styles from './transactions.css';
import Filters from '../../../components/filters/Filters';
import Transhistory from '../../../components/transhistory/Transhistory';
import Fullhistory from '../../../components/transhistory/fullhistory/Fullhistory';

const Transactions = () => {
  const [userId, setUserId] = useState(null); // State to store the user ID
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date('01/01/2019'),
    endDate: new Date('01/01/2040')
  });
  const [isEmpty, setIsEmpty] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState({});

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + '/api/token');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setUserId(data.userId);
        console.log('Fetched user ID:', data.userId); // Log userId
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };
    fetchUserId();
  }, []);

  const fetchTransactions = async () => {
    if (userId) {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + `/api/gettrans?userId=${userId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched transactions:', data); // Log transactions data
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    }
  };

  // Fetch transactions when userId is set
  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  useEffect(() => {
    console.log('Transactions before filtering:', transactions); // Log transactions before filtering

    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    const isMatch = (transaction) => {
      const typeMatch = transaction.type.toLowerCase().includes(lowerCaseSearchQuery);
      const descriptionMatch = transaction.description.toLowerCase().includes(lowerCaseSearchQuery);
      const transactionDate = new Date(transaction.timestamp);
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

      console.log(`Transaction ${transaction.id}: typeMatch=${typeMatch}, descriptionMatch=${descriptionMatch}, dateMatch=${dateMatch}, filterMatch=${filterMatch}`);
      return (typeMatch || descriptionMatch) && filterMatch && dateMatch;
    };

    const newFilteredTransactions = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.timestamp).toLocaleDateString('en-GB');
      if (isMatch(transaction)) {
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

    console.log('Filtered transactions:', newFilteredTransactions);

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
