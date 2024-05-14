import React from 'react';
import styles from './Help.module.css';
import Link from 'next/link';
import { useTranslations } from "next-intl"
import '../globals.css'

const Help = () => {
    const translations = useTranslations()
    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <div className={styles.headerContainer}>
                    <h1>{translations('Support.support')}</h1>
                </div>
            </div>
            <div className={styles.supportsection}>
                <div className={styles.supportcard}>
                    <h2>{translations('Support.technical')}</h2>
                    <p>{translations('Support.service')}</p>
                    <Link href="https://t.me/cvv888sales" className={styles.dropbutton} style={{ textDecoration: 'none' }} passHref>
                    <div className={styles.supportbuttons}>
                        <button className={styles.supportbutton}><i className={styles.icontelegram}></i> {translations('Support.telegram')}</button>
                    </div>
                    </Link>
                </div>
                <div className={styles.supportcard}>
                    <h2>{translations('Support.information')}</h2>
                    <ul className={styles.infolist}>
                        <Link href="/cabinet/faq" className={styles.dropbutton} style={{ textDecoration: 'none' }} passHref>
                            <li>{translations('Support.FAQ')}</li>
                        </Link>
                    </ul>
                </div>
            </div>
        </div>

    );
};

export default Help;
