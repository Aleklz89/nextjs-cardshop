"use client"

import React, { useState } from 'react';
import styles from './sign.module.css';
import Link from 'next/link';

function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageStyle, setMessageStyle] = useState({});
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setMessageStyle({ color: 'red' });
      return;
    }

    try {
      const response = await fetch(process.env.ROOT_URL + '/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log(data.error)

      if (response.ok) {
        setMessage('Request was successful. Please expect a response to your email.');
        setMessageStyle({ color: 'green' });
      } else if (data.error === "Email is already in use") {
        setMessage("You already have an account.");
        setMessageStyle({ color: 'red' });
      } else if (data.error === "You have already submitted a registration request.") {
        setMessage("You have already submitted a registration request.");
        setMessageStyle({ color: 'red' });
      } else if (data.error === "Invalid password format") {
        setMessage("The password must be at least 8 characters long and include at least one lowercase letter, number and a special character from the list (@, $, !, %, *, ?, &).");
        setMessageStyle({ color: 'red' });
      } else if (data.error === "Invalid email format") {
        setMessage("Invalid email format.");
        setMessageStyle({ color: 'red' });
      } else {
        throw new Error(data.error || "An error occurred during registration");
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage("An unexpected error occurred. Please try again.");
      setMessageStyle({ color: 'red' });
    }
  }


    return (
      <div className={styles.container}>
        <div className={styles.signupform}>
          <form onSubmit={handleSubmit}>
            <div className={styles.logo}></div>
            <div className={styles.titleblock}>
              <Link href="/" className={styles.dropbutton} style={{ textDecoration: 'none' }} passHref>
                <div><h2 className={styles.sign}>Log in</h2></div>
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
              <label htmlFor={styles.password}>Create password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="8"
              />
            </div>
            <div className={styles.formgroup}>
              <label htmlFor="confirm-password">Confirm password</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
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
            <button type="submit" className={styles.btnprimary}>Request an account</button>
            <div style={messageStyle} className={styles.message} dangerouslySetInnerHTML={{ __html: message }}></div>
          </form>
        </div>
      </div>
    );
  }

  export default SignupForm;
