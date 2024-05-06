import React from 'react';
import styles from './Help.module.css';
import Link from 'next/link';

const Help = () => {
    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <div className={styles.headerContainer}>
                    <h1>Support</h1>
                </div>
            </div>
            <div className={styles.supportsection}>
                <div className={styles.supportcard}>
                    <h2>Technical support</h2>
                    <p>If you have any difficulties while working with the service, contact us</p>
                    <div className={styles.supportbuttons}>
                        <Link href="/cabinet/newticket" className={styles.dropbutton} style={{ textDecoration: 'none' }} passHref>
                            <button className={styles.supportbutton}>Create a ticket</button>
                        </Link>
                        <button className={styles.supportbutton}><i className={styles.icontelegram}></i> Telegram</button>
                    </div>
                </div>
                <div className={styles.supportcard}>
                    <h2>Additional information</h2>
                    <ul className={styles.infolist}>
                        <Link href="/cabinet/faq" className={styles.dropbutton} style={{ textDecoration: 'none' }} passHref>
                            <li>FAQ</li>
                        </Link>
                        <Link href="/cabinet/none" className={styles.dropbutton} style={{ textDecoration: 'none' }} passHref>
                            <li>API Help</li>
                        </Link>
                        <Link href="/cabinet/none" className={styles.dropbutton} style={{ textDecoration: 'none' }} passHref>
                            <li>Documents</li>
                        </Link>
                        <Link href="/cabinet/refund" className={styles.dropbutton} style={{ textDecoration: 'none' }} passHref>
                            <li>Refunds search</li>
                        </Link>
                    </ul>
                </div>
            </div>
            <div className={styles.secondheader}>
                <h2>Tickets</h2>
            </div>

        </div>

    );
};

export default Help;
