"use client"
import React, { useState, useEffect } from 'react';
import styles from './createstatement.module.css';
import Filters from '../../components/filters/Filters';
import Transhistory from '../../components/transhistory/Transhistory';
import Fullhistory from '../../components/transhistory/fullhistory/Fullhistory';

const Transactions = () => {
  
  return (
    <main>
      <Filters />
      
    </main>
  );

};

export default Transactions;
