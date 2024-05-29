"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./login.module.css";

export default function SignInUpForm() {
  const translations = useTranslations();
  const router = useRouter();
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageStyle, setMessageStyle] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [telegram, setTelegram] = useState("");

  const applyTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    applyTheme();
  }, []);

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
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + "/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        window.location.href = "/cabinet/cards";
      } else {
        setMessage(translations('IndexPage.invalid'));
        setMessageStyle({ color: "red" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage(translations('IndexPage.error'));
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

    let processedTelegram = telegram;

    if (processedTelegram.startsWith('@')) {
      processedTelegram = processedTelegram.substring(1);
    }

    const match = processedTelegram.match(/https:\/\/t\.me\/(.+)/);
    if (match) {
      processedTelegram = match[1];
    }

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + "/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, telegram: processedTelegram }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(translations('IndexPage.registration'));
        setMessageStyle({ color: "#2A27A4" });
      } else if (data.error === "Email is already in use") {
        setMessage(translations('IndexPage.already'));
        setMessageStyle({ color: "red" });
      } else if (data.error === 'Telegram username is already in use') {
        setMessage(translations('IndexPage.inuse'));
        setMessageStyle({ color: 'red' });
      } else if (data.error === "Invalid password format") {
        setMessage(translations('IndexPage.atleast'));
        setMessageStyle({
          color: "red",
          fontSize: "12px"
        });
      } else {
        throw new Error(data.error || "Registration error");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage(translations('IndexPage.error'));
      setMessageStyle({ color: "red" });
    }
  };

  return (
    <div className={styles.bigone}>
    <div className={styles.page}>
      <Head>
        <title>Sign In/Up Form</title>
      </Head>

      <div className={styles.blurred}></div>
      <div className={styles.blurredtwo}></div>
      <div
        className={`${styles.container} ${isRightPanelActive ? styles.rightPanelActive : ""}`}
        id="container"
      >
        <div className={`${styles.formContainer} ${styles.signUpContainer} ${!isRightPanelActive ? styles.hiddenForm : ''}`}>
          <form className={styles.form} onSubmit={handleSignupSubmit}>
            <h1 className={styles.h1}>{translations('IndexPage.signin')}</h1>
            <span className={styles.tostart}>{translations('IndexPage.tostart')}</span>
            <input
              className={styles.input}
              type="email"
              placeholder={translations('IndexPage.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className={styles.input}
              type="text"
              placeholder="Telegram"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              required
            />
            <input
              className={styles.input}
              type="password"
              placeholder={translations('IndexPage.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="8"
            />
            <input
              className={styles.input}
              type="password"
              placeholder={translations('IndexPage.confirm')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" className={styles.button}>{translations('IndexPage.request')}</button>
            <div className={styles.swap}>
              {translations('IndexPage.alreadyhave')}
              <div className={styles.swaplink} onClick={handleSignInClick}>
                {translations('IndexPage.movein')}
              </div>
            </div>
            <div
              style={messageStyle}
              className={styles.message}
              dangerouslySetInnerHTML={{ __html: message }}
            ></div>
          </form>
        </div>
        <div className={`${styles.formContainer} ${styles.signInContainer} ${isRightPanelActive ? styles.hiddenForm : ''}`}>
          <form className={styles.form} onSubmit={handleLoginSubmit}>
            <h1 className={styles.h1}>{translations('IndexPage.signin')}</h1>
            <p className={styles.tostart}>{translations('IndexPage.tostart')}</p>
            <input
              className={styles.input}
              type="email"
              placeholder={translations('IndexPage.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className={styles.input}
              type="password"
              placeholder={translations('IndexPage.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className={styles.button}>{translations('IndexPage.movein')}</button>
            <div className={styles.swap}>
              {translations('IndexPage.noacc')}
              <div className={styles.swaplink} onClick={handleSignUpClick}>
                {translations('IndexPage.profile')}
              </div>
            </div>
            <div
              style={messageStyle}
              className={styles.message}
              dangerouslySetInnerHTML={{ __html: message }}
            ></div>
          </form>
        </div>
        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <h1 className={styles.hello}>{translations('IndexPage.hello')}</h1>
              <p className={styles.p}>{translations('IndexPage.stay')}</p>
                <div className={styles.avatarbox}>
                  <div className={styles.inneravatar}>
                  <Image
                    src="/avatar.svg"
                    alt="Settings icon"
                    height="32"
                    width="32"
                    className={styles.avatar}
                  />
                  <Image
                    src="/avatartwo.svg"
                    alt="Settings icon"
                    height="32"
                    width="32"
                    className={styles.avatartwo}
                  />
                  <Image
                    src="/avatarthree.svg"
                    alt="Settings icon"
                    height="32"
                    width="32"
                    className={styles.avatartwo}
                  />
                  <Image
                    src="/avatarfour.svg"
                    alt="Settings icon"
                    height="32"
                    width="32"
                    className={styles.avatartwo}
                  />
                  <Image
                    src="/avatarfive.svg"
                    alt="Settings icon"
                    height="32"
                    width="32"
                    className={styles.avatartwo}
                  />
                </div>
                <p className={styles.txt}>{translations('IndexPage.users')}</p>
              </div>
            </div>
            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <h1 className={styles.hello}>{translations('IndexPage.hello')}</h1>
              <p className={styles.p}>{translations('IndexPage.provide')}</p>
              <div className={styles.avatarbox}>
                <div className={styles.inneravatar}>
                  <Image
                    src="/avatar.svg"
                    alt="Settings icon"
                    height="32"
                    width="32"
                    className={styles.avatar}
                  />
                  <Image
                    src="/avatartwo.svg"
                    alt="Settings icon"
                    height="32"
                    width="32"
                    className={styles.avatartwo}
                  />
                  <Image
                    src="/avatarthree.svg"
                    alt="Settings icon"
                    height="32"
                    width="32"
                    className={styles.avatartwo}
                  />
                  <Image
                    src="/avatarfour.svg"
                    alt="Settings icon"
                    height="32"
                    width="32"
                    className={styles.avatartwo}
                  />
                  <Image
                    src="/avatarfive.svg"
                    alt="Settings icon"
                    height="32"
                    width="32"
                    className={styles.avatartwo}
                  />
                </div>
                <p className={styles.txt}>{translations('IndexPage.users')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
