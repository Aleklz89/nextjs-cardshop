"use client"

import React, { useState } from 'react';
import styles from './sign.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function AuthForm() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageStyle, setMessageStyle] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleToggle = () => {
    setIsSignup(!isSignup);
    setMessage('');
    setMessageStyle({});
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push('/cabinet/cards'); // Or whatever page you want to redirect to
      } else {
        setMessage('Invalid email or password');
        setMessageStyle({ color: 'red' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('An unexpected error occurred. Please try again.');
      setMessageStyle({ color: 'red' });
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setMessageStyle({ color: 'red' });
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Request was successful. Please expect a response to your email.');
        setMessageStyle({ color: 'green' });
      } else if (data.error === 'Email is already in use') {
        setMessage('You already have an account.');
        setMessageStyle({ color: 'red' });
      } else if (data.error === 'Invalid password format') {
        setMessage('The password must be at least 8 characters long and include at least one lowercase letter, number and a special character from the list (@, $, !, %, *, ?, &).');
        setMessageStyle({ color: 'red' });
      } else {
        throw new Error(data.error || 'An error occurred during registration');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessage('An unexpected error occurred. Please try again.');
      setMessageStyle({ color: 'red' });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.signupform}>
        <form onSubmit={isSignup ? handleSignupSubmit : handleLoginSubmit}>
          <div className={styles.logo}></div>
          <div className={styles.titleblock}>
            <div className={styles.swap}>
              <h2 className={styles.title}>{isSignup ? 'Sign up' : 'Log in'}</h2>
            </div>
            <div onClick={handleToggle} className={styles.dropbutton}>
              <h2 className={styles.sign}>{isSignup ? 'Log in' : 'Sign up'}</h2>
            </div>
          </div>
          <div className={styles.formgroup}>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formgroup}>
            <label htmlFor='password'>{isSignup ? 'Create password' : 'Password'}</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength='8'
            />
          </div>
          {isSignup && (
            <div className={styles.formgroup}>
              <label htmlFor='confirm-password'>Confirm password</label>
              <input
                type='password'
                id='confirm-password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <div className={styles.formgroupformcheck}>
            <input
              type='checkbox'
              id='terms'
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
              required
            />
            <label htmlFor='terms'>
              By signing up, you agree to our Terms of Use and Privacy Policy
            </label>
          </div>
          <button type='submit' className={styles.btnprimary}>
            {isSignup ? 'Request an account' : 'Log in'}
          </button>
          <div
            style={messageStyle}
            className={styles.message}
            dangerouslySetInnerHTML={{ __html: message }}
          ></div>
        </form>
      </div>
    </div>
  );
}

export default AuthForm;