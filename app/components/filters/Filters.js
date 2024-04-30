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




    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <div className={styles.headerContainer}>
                    <h1>Transactions</h1>
                    <button className={styles.button}>Share</button>
                </div>
                <div className={styles.buttons}>
                    <Link href="/transactions" className={styles.dropbutton} style={{ textDecoration: 'none' }} passHref>
                        <button className={isActive('/transactions') ? styles.buy : styles.button} >History</button>
                    </Link>
                    <Link href="/statement" className={styles.dropbutton} style={{ textDecoration: 'none' }} passHref>
                        <button className={isActive('/statement') ? styles.buy : styles.button} >Create Statement</button>
                    </Link>
                    <Link href="/oldstatements" className={styles.dropbutton} style={{ textDecoration: 'none' }} passHref>
                    <button className={isActive('/oldstatements') ? styles.buy : styles.button} >Create Statement</button>
                    </Link>
                </div>
            </div>

            <div className={isActive('/statement') || isActive('/oldstatements') ? styles.alterboxes : styles.boxes}
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
            <div className={isActive('/statement') ? styles.create : styles.alterboxes}>
                <CreateStatement />
            </div>
            <div className={isActive('/oldstatements') ? styles.create : styles.alterboxes}>

            </div>
        </div>
    );
};

export default Filters;