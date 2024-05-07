"use client";

import { useState } from "react";
import styles from "./login.module.css";
import Head from "next/head";
import { useRouter } from "next/navigation";
import Image from "next/image"

export default function SignInUpForm() {
  const router = useRouter();
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageStyle, setMessageStyle] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
    resetForm();
  };

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
    resetForm();
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setMessage("");
    setMessageStyle({});
    setTermsAccepted(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push("/cabinet/cards"); // Redirect to your desired page
      } else {
        setMessage("Invalid email or password");
        setMessageStyle({ color: "red" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("An unexpected error occurred. Please try again.");
      setMessageStyle({ color: "red" });
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setMessageStyle({ color: "red" });
      return;
    }

    

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful. Check your email.");
        setMessageStyle({ color: "green" });
      } else if (data.error === "Email is already in use") {
        setMessage("Email is already registered.");
        setMessageStyle({ color: "red" });
      } else if (data.error === "Invalid password format") {
        setMessage("The password must be at least 8 characters long and include at least one lowercase letter, number and a special character from the list (@, $, !, %, *, ?, &).");
        setMessageStyle({
          color: "red",
          fontSize: "12px"
        });
      } else {
        throw new Error(data.error || "Registration error");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("An unexpected error occurred. Please try again.");
      setMessageStyle({ color: "red" });
    }
  };

  return (
    <div  className={styles.page}>
      <Image 
        src="/ground.jpg" 
        fill={true}

      />

      <Head>
        <title>Sign In/Up Form</title>
      </Head>
      <div
        className={`${styles.container} ${
          isRightPanelActive ? styles.rightPanelActive : ""
        }`}
        id="container"
      >
        <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
          <form className={styles.form} onSubmit={handleSignupSubmit}>
            <h1 className={styles.h1}>Create Account</h1>
            <span className={styles.span}>Use your email for registration</span>
            <input
              className={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="8"
            />
            <input
              className={styles.input}
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" className={styles.button}>Sign Up</button>
            <div
              style={messageStyle}
              className={styles.message}
              dangerouslySetInnerHTML={{ __html: message }}
            ></div>
          </form>
        </div>
        <div className={`${styles.formContainer} ${styles.signInContainer}`}>
          <form className={styles.form} onSubmit={handleLoginSubmit}>
            <h1 className={styles.h1}>Sign in</h1>
            <input
              className={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className={styles.button}>Sign In</button>
            <div
              style={messageStyle}
              className={styles.message}
              dangerouslySetInnerHTML={{ __html: message }}
            ></div>
          </form>
        </div>
        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <div
              className={`${styles.overlayPanel} ${styles.overlayLeft}`}
            >
              <h1 className={styles.h1}>Welcome Back!</h1>
              <p className={styles.p}>Stay connected by logging in with your personal information.</p>
              <button className={styles.ghost} onClick={handleSignInClick}>
                Sign In
              </button>
            </div>
            <div
              className={`${styles.overlayPanel} ${styles.overlayRight}`}
            >
              <h1 className={styles.h1}>Hello, Friend!</h1>
              <p className={styles.p}>Provide your personal details and embark on your journey with us.</p>
              <button className={styles.ghost} onClick={handleSignUpClick}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
