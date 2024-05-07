"use client"

import React, { useState } from 'react';
import styles from './Filters.module.css';
import DateRangeComp from './Date/Date';
import 'react-datepicker/dist/react-datepicker.css';
import CreateStatement from '../Createstatement/Createtatement';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Filters = ({ setSearchQuery, setFilterType, setDateRange }) => {
    const handleSearchChange = (e) => {
        console.log("Filters: setSearchQuery called with", e.target.value);
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (e) => {
        console.log("Filters: setFilterType called with", e.target.value);
        setFilterType(e.target.value);
    };

    const pathname = usePathname();

    const isActive = (path) => {
        const isActivePath = pathname === path;
        return isActivePath;
    };

    const rootUrl = process.env.NEXT_PUBLIC_ROOT_URL;
    const shareUrl = `https://telegram.me/share/url?url=${encodeURIComponent(rootUrl)}/&text=CVV888`;




    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <div className={styles.headerContainer}>
                    <h1>Transactions</h1>
                    <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                        <button className={styles.button}>Share</button>
                    </a>
                </div>
            </div>

            <div className={isActive('/cabinet/statement') || isActive('/cabinet/oldstatements') ? styles.alterboxes : styles.boxes}
            >
                <input className={styles.search__input} type="text" placeholder="Search" onChange={handleSearchChange} />

                <div className={styles.dropdown}>
                    <select className={styles.dropdown__select} onChange={handleFilterChange}>
                        <option value="">Transaction type</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="declined">Declined</option>
                        <option value="deposit">Deposit</option>
                        <option value="withdraw">Withdraw</option>
                    </select>
                </div>
                <div className={styles.range}>
                    <DateRangeComp setDateRange={setDateRange} />
                </div>
            </div>
            <div className={isActive('/cabinet/statement') ? styles.create : styles.alterboxes}>
                <CreateStatement />
            </div>
            <div className={isActive('/cabinet/oldstatements') ? styles.create : styles.alterboxes}>

            </div>
        </div>
    );
};

export default Filters;