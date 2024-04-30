"use client"

import React, { useState } from 'react';
import styles from './managetags.module.css';
import Link from 'next/link';

const Managetags = () => {
    const [isTagMode, setIsTagMode] = useState(false);

    const handleToggle = () => {
        setIsTagMode(!isTagMode);
    };

    return (
        <div className={styles.tagManager}>
            <Link href="/cards" style={{ textDecoration: 'none' }}>
                <div className={styles.backLink} >‹ Cards</div>
            </Link>
            <h2>Manage Tags</h2>
            <div className={styles.tagsBehavior}>
                <h3 className={styles.text}>Tags behavior settings</h3>
                <p  className={styles.smalltext}>
                    Folder mode - in this mode you will be able to choose only one tag to
                    filter out your cards
                </p>
                <p  className={styles.smalltext}>
                    Tag mode — in this mode you will be able to choose several tags to
                    filter out your cards
                </p>
            </div>
            <div className={styles.toggleSwitch}>
                <label className={styles.switch}>
                    <input
                        type="checkbox"
                        checked={isTagMode}
                        onChange={handleToggle}
                    />
                    <span className={styles.slider}></span>
                </label>
                <div>{isTagMode ? 'Tag mode' : 'Folder mode'}</div>
            </div>
        </div>
    );
};

export default Managetags;
