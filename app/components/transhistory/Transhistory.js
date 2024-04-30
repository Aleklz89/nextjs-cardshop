import React from 'react';
import styles from './Transhistory.module.css';

const Transhistory = () => {
    return (
        <div className={styles.assetsContainer}>
            
            <div className={styles.content}>
                <p className={styles.suggestion}>No transactions to display 🕵️</p>
                <p className={styles.description}>Up your transactions activity first!‍</p>
            </div>
        </div>
    );
};

export default Transhistory;