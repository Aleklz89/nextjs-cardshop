import React from 'react';
import styles from './Gears.module.css';
import Link from 'next/link';

const Gears = () => {
    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <div className={styles.headerContainer}>
                    <h1>Settings</h1>
                </div>
                <div className={styles.settingscontainer}>
                    <div className={styles.settingsoption}>
                        <span>Notifications sound</span>
                        <label className={styles.switch}>
                            <input type="checkbox" />
                            <span className={styles.slider}></span>
                        </label>
                    </div>

                    <div className={styles.settingsoption}>
                        <span>Two-factor authorization to view card details</span>
                        <label className={styles.switch}>
                            <input type="checkbox" />
                            <span className={styles.slider}></span>
                        </label>

                    </div>

                    <div className={styles.settingsoption}>
                        <span>Two-factor authorization to withdraw money</span>
                        <label className={styles.switch}>
                            <input type="checkbox" />
                            <span className={styles.slider}></span>
                        </label>

                    </div>


                    <div className={styles.settingsoption}>
                        <span>Two-factor authorization to send money to another user</span>
                        <label className={styles.switch}>
                            <input type="checkbox" />
                            <span className={styles.slider}></span>
                        </label>

                    </div>

                    <div className={styles.settingsoption}>
                        <Link href="/cabinet/security">
                            <button className={styles.button}>Safety and security</button>
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Gears;