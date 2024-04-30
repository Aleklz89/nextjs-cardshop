"use client"

import React, { useState } from 'react';
import styles from './Statement.module.css'

const CreateStatement = () => {
    const [statementType, setStatementType] = useState('create');
    const [frequency, setFrequency] = useState('');
    const [account, setAccount] = useState('');
    const [email, setEmail] = useState('');

    const handleCreateStatement = () => {
        console.log({ statementType, frequency, account, email });
    };

    return (
        <div className={styles.createStatement}>
            <div className={styles.greyline}>
            </div>
            <label htmlFor="frequency">Frequency</label>
            <select id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                <option value="">Select period</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="annually">Annually</option>
            </select>

            <label htmlFor="account">Accounts for statement</label>
            <select id="account" value={account} onChange={(e) => setAccount(e.target.value)}>
                <option value="Main account - $9.60">Main account - $9.60</option>
                <option value="Second account - $1.90">Second account - $1.90</option>
      
            </select>

            <label htmlFor="email">Send to</label>
            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter recipient's email"
            />

            <button onClick={handleCreateStatement} className={styles.createButton}>Create statement</button>
        </div>
    );
};

export default CreateStatement;