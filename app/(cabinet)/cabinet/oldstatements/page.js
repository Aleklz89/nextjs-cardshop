"use client"
import React, { useState, useEffect } from 'react';
import styles from './oldstatements.module.css';
import Filters from '../../../components/filters/Filters';
import Transhistory from '../../../components/transhistory/Transhistory';
import Fullhistory from '../../../components/transhistory/fullhistory/Fullhistory';
import Readystatements from '../../../components/readestatements/Readystatements';

const Oldstatements = () => {
  
  return (
    <main>
      <Filters />
      <Readystatements />
    </main>
  );

};

export default Oldstatements;