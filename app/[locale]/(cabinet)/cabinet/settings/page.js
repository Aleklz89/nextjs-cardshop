"use client";

import styles from './security.module.css';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useTranslations } from "next-intl"

export default function Cards() {
    const translations = useTranslations()
    const [email, setEmail] = useState("");
    const [userId, setUserId] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const handleRemove = (id) => {
        setActivities(activities.filter(activity => activity.id !== id));
    };

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleCancelClick = () => {
        setEditMode(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setMessage("");
    };

    const handleSaveClick = async () => {
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match");
            setMessageType("error");
            return;
        }

        try {
            const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + '/api/change', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId,
                    oldPassword,
                    newPassword
                })
            });

            const result = await response.json();

            if (response.ok) {
                setMessage("Password successfully updated");
                setMessageType("success");
                setEditMode(false);
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setMessage(result.error || "Error updating password");
                setMessageType("error");
            }
        } catch (error) {
            setMessage("Error updating password");
            setMessageType("error");
            console.error('Error updating password:', error);
        }
    };


    const fetchUserId = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + '/api/token');
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            setUserId(data.userId);
        } catch (error) {
            console.error('Error fetching user ID:', error);
        }
    };

    const fetchUserEmail = async (id) => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + `/api/cabinet?id=${id}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            setEmail(data.user.email);
        } catch (error) {
            console.error('Error fetching user email:', error);
        }
    };

    useEffect(() => {
        const getEmail = async () => {
            await fetchUserId();
            if (userId) {
                await fetchUserEmail(userId);
            }
        };

        getEmail();
    }, [userId]);

    return (
        <div>
            <div className={styles.authorizationSettings}>
                <h2 className={styles.title}>{translations('Settings.safety')}</h2>
                <div className={styles.authSettingsContainer}>
                    <div className={styles.authSettings}>
                        <label>{translations('Settings.email')}</label>
                        <input className={styles.authSettings} type="email" value={email} readOnly />
                    </div>
                    {!editMode ? (
                        <div className={styles.authSettings}>
                            <label>{translations('Settings.password')}</label>
                            <input type="password" value="**************" readOnly />
                            <button onClick={handleEditClick}>{translations('Settings.edit')}</button>
                        </div>
                    ) : (
                        <>
                            <div className={styles.authSettings}>
                                <label>{translations('Settings.old')}</label>
                                <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
                            </div>
                            <div className={styles.authSettings}>
                                <label>{translations('Settings.new')}</label>
                                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                            </div>
                            <div className={styles.authSettings}>
                                <label>{translations('Settings.repeat')}</label>
                                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                            </div>
                            <div className={styles.authSettingsActions}>
                                <button onClick={handleCancelClick}>{translations('Settings.cancel')}</button>
                                <button onClick={handleSaveClick}>{translations('Settings.save')}</button>
                            </div>
                        </>
                    )}
                </div>
                {message && (
                    <div className={messageType === "success" ? styles.successMessage : styles.errorMessage}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
