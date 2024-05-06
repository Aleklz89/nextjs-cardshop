"use client"

import React, { useState } from 'react';
import { useFormState } from "react-dom"
import styles from './login.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import loginAction from './loginAction';


function SignupForm() {
  const router = useRouter();
  const [error, formAction] = useFormState(loginAction, undefined);

  return (
    <div className={styles.container}>
      <div className={styles.signupform}>
        <form action={formAction}>
          <div className={styles.logo}>
          </div>
          <div className={styles.titleblock}>
            <div className={styles.swap}>
              <h2 className={styles.title}>Log in</h2>
            </div>

            <Link href="/signup" className={styles.dropbutton} style={{ textDecoration: 'none' }} passHref>
              <div>
                <h2 className={styles.sign}>Sign up</h2>
              </div>
            </Link>
          </div>
          <div className={styles.formgroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name='email'
              required
            />
          </div>
          <div className={styles.formgroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name='password'
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
          <button type="submit" className={styles.btnprimary}>Log in</button>

        </form>

        <div className={styles.message}>{error}</div> 
      </div>
    </div>
  );
}

export default SignupForm;


