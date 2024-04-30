"use client"

import React, { useState } from 'react';
import styles from './sign.module.css';
import Link from 'next/link';

function SignupForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email, password, confirmPassword);
    };

    const [isActive, setIsActive] = useState(false);

    const handleClick = () => {
        setIsActive(!isActive);
    };

    return (
        <div className={styles.container}>
            <div className={styles.signupform}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.logo}>
                    </div>
                    <div className={styles.titleblock}>
                        <Link href="/" className={styles.dropbutton} style={{ textDecoration: 'none' }} passHref>
                        <div>
                            <h2 className={styles.sign}>Log in</h2>
                        </div>
                        </Link>
                        <div className={styles.swap}>
                            <h2 className={styles.title}>Sign up</h2>
                        </div>
                    </div>
                    <div className={styles.formgroup}>
                        <label htmlFor={styles.email}>Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formgroup}>
                        <label htmlFor={styles.password}>Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="8"
                        />
                    </div>
                    <div className={styles.formgroupformcheck}>
                        <input
                            type="checkbox"
                            id="terms"
                            required
                        />
                        <label htmlFor="terms">
                            By signing up, you agree to our Terms of Use and Privacy Policy
                        </label>
                    </div>
                    <div className={styles.formgroup}>
                    </div>
                    <button type="submit" className={styles.btnprimary}>Sign up</button>
                </form>
            </div>
        </div>
    );
}

export default SignupForm;