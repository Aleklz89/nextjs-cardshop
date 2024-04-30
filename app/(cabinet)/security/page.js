"use client"

import Gears from "../../components/gears/Gears";
import styles from './security.module.css';
import Link from 'next/link';
import React, { useState } from 'react';


export default function Cards() {

    const [activities, setActivities] = useState([
        {
            id: 1,
            ip: '177.121.124.73',
            location: 'Kyiv, Ukraine',
            browser: 'Chrome',
            session: 'Current session'
        },
        {
            id: 2,
            ip: '178.211.135.54',
            location: 'Kyiv, Ukraine',
            browser: 'Safari',
            session: '2024-03-01'
        },
        {
            id: 3,
            ip: '178.211.135.54',
            location: 'Kyiv, Ukraine',
            browser: 'Safari',
            session: '2024-03-01'
        },
        {
            id: 4,
            ip: '178.211.135.54',
            location: 'Kyiv, Ukraine',
            browser: 'Safari',
            session: '2024-03-01'
        },
        {
            id: 5,
            ip: '178.211.135.54',
            location: 'Kyiv, Ukraine',
            browser: 'Safari',
            session: '2024-03-01'
        },
        {
            id: 6,
            ip: '178.211.135.54',
            location: 'Kyiv, Ukraine',
            browser: 'Safari',
            session: '2024-03-01'
        },
    ]);

    const handleRemove = (id) => {
        setActivities(activities.filter(activity => activity.id !== id));
    };

    const [editMode, setEditMode] = useState(false);

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleCancelClick = () => {
        setEditMode(false);
    };

    const handleSaveClick = () => {
        setEditMode(false);
    };



    const handleRemoveAll = () => {
        setActivities(currentActivities => {
            if (currentActivities.length > 0) {
                return [currentActivities[0]];
            }
            return [];
        });
    };
    return (
        <main>
            <div className={styles.authorizationSettings}>
                <Link href="/settings" style={{ textDecoration: 'none' }}>
                    <div className={styles.backLink}>‹ Settings</div>
                </Link>
                <h2 className={styles.title}>Safety and security</h2>
                <div className={styles.authSettingsContainer}>
                    <div className={styles.authSettings}>
                        <label>Email</label>
                        <input type="email" value="rapidcarmina@awgarstone.com" readOnly />
                    </div>
                    {!editMode ? (
                        <div className={styles.authSettings}>
                            <label>Password</label>
                            <input type="password" value="********" readOnly />
                            <button onClick={handleEditClick}>Edit</button>
                        </div>
                    ) : (
                        <>
                            <div className={styles.authSettings}>
                                <label>Enter old password</label>
                                <input type="password" placeholder="Enter old password" />
                            </div>
                            <div className={styles.authSettings}>
                                <label>New password</label>
                                <input type="password" placeholder="New password" />
                            </div>
                            <div className={styles.authSettings}>
                                <label>Repeat new password</label>
                                <input type="password" placeholder="Repeat new password" />
                            </div>
                            <div className={styles.authSettingsActions}>
                                <button onClick={handleCancelClick}>Cancel</button>
                                <button onClick={handleSaveClick}>Save</button>
                            </div>
                        </>
                    )}
                </div>

            </div>

            <div className={styles.lastActivity}>
                <h2>Last activity</h2>
                <div className={styles.activityList}>
                    {activities.map(activity => (
                        <div key={activity.id} className={styles.activityItem}>
                            <span>{activity.ip}</span>
                            <span>{activity.location}</span>
                            <span className={styles.browser}>{activity.browser}</span>
                            <span>{activity.session}</span>
                            <button onClick={() => handleRemove(activity.id)}>✖</button>
                        </div>
                    ))}
                </div>
                {activities.length > 0 && <button onClick={handleRemoveAll} className={styles.deleteButton}>Delete All</button>}
            </div>

        </main>
    )
}