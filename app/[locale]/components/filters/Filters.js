"use client"

import React, { useState } from 'react';
import styles from './Filters.module.css';
import DateRangeComp from './Date/Date';
import 'react-datepicker/dist/react-datepicker.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from "next-intl"
import '../globals.css'

const Filters = ({ setSearchQuery, setFilterType, setDateRange }) => {
    const translations = useTranslations()
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
                    <h1>{translations('Filters.transactions')}</h1>
                    <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                        <button className={styles.button}>{translations('Filters.share')}</button>
                    </a>
                </div>
            </div>

            <div className={isActive('/cabinet/statement') || isActive('/cabinet/oldstatements') ? styles.alterboxes : styles.boxes}
            >
                <input className={styles.search__input} type="text" placeholder={translations('BuyCardId.search')} onChange={handleSearchChange} />

                <div className={styles.dropdown}>
                    <select className={styles.dropdown__select} onChange={handleFilterChange}>
                        <option value="">{translations('Filters.transaction')}</option>
                        <option value="confirmed"></option>
                        <option value="declined">{translations('Filters.declined')}</option>
                        <option value="deposit">{translations('Filters.deposit')}</option>
                        <option value="withdraw">{translations('Filters.withdraw')}</option>
                    </select>
                </div>
                <div className={styles.range}>
                    <DateRangeComp setDateRange={setDateRange} />
                </div>
            </div>
        </div>
    );
};

export default Filters;