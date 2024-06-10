"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './Sidebar.module.css';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from "next-intl";
import Switcher from '../switcher/Switcher';
import '../globals.css';

function Sidebar() {
  const pathname = usePathname();
  const translations = useTranslations();
  const [menuOpen, setMenuOpen] = useState(false);
  const [secondMenuOpen, setSecondMenuOpen] = useState(false);
  const menuRef = useRef();
  const secondMenuRef = useRef();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [balance, setBalance] = useState(null);
  const [holdBalance, setHoldBalance] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [cards, setCards] = useState([]);
  const [cardsCount, setCardsCount] = useState(0);

  const rootUrl = process.env.NEXT_PUBLIC_ROOT_URL;
  const shareUrl = `https://telegram.me/share/url?url=${encodeURIComponent(rootUrl)}/&text=CVV888`;

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setTimeout(() => {
      setIsSidebarVisible(false);
    }, 500);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
    setIsMenuVisible(!isMenuVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (secondMenuRef.current && !secondMenuRef.current.contains(event.target)) {
        setSecondMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    if (!menuOpen && secondMenuOpen) {
      setSecondMenuOpen(false);
    }
    setMenuOpen(!menuOpen);
  };

  const toggleSecondMenu = () => {
    if (!secondMenuOpen && menuOpen) {
      setMenuOpen(false);
    }
    setSecondMenuOpen(!secondMenuOpen);
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

  const fetchUserBalance = async (id) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + `/api/cabinet?id=${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setBalance(parseFloat(data.user.balance));
    } catch (error) {
      console.error('Error fetching user balance:', error);
      setBalance(null);
    }
  };

  const fetchUserCards = async (userId) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + `/api/cabinet?id=${userId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log("Текущие карты юзера:", data);
      return data.user.cardsIds || [];
    } catch (error) {
      console.error('Error fetching user cards:', error);
      return [];
    }
  };

  const fetchCardById = async (cardId) => {
    try {
      const response = await fetch(`https://api.epn.net/card?external_id=${cardId}`, {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ',
          'X-CSRF-TOKEN': '',
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error fetching card with ID ${cardId}:`, error);
      return null;
    }
  };

  const fetchAllCardsByIds = async (cardIds) => {
    let allCards = [];

    try {
      const cardFetchPromises = cardIds.map(cardId => fetchCardById(cardId));
      const cardsData = await Promise.all(cardFetchPromises);
      allCards = cardsData.flat().filter(card => card !== null);
      return allCards;
    } catch (error) {
      console.error('Error fetching all cards by IDs:', error);
      return [];
    }
  };

  const fetchHoldBalance = async (userId, cardUuids) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, cardUuids }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data.holdBalance;
    } catch (error) {
      console.error('Error fetching hold balance:', error);
      return 0;
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchCardsAndBalances = async () => {
      if (userId) {
        const cardsIds = await fetchUserCards(userId);
        console.log("Id карт:", cardsIds);
        const allCards = await fetchAllCardsByIds(cardsIds);
        const activeCards = allCards.filter(card => card.blocked_at === null);

        setCards(activeCards);
        setCardsCount(activeCards.length);

        const cardUuids = activeCards.map((card) => card.account.uuid);
        const holdBalance = await fetchHoldBalance(userId, cardUuids);
        setHoldBalance(parseFloat(holdBalance.toFixed(2)));

        await fetchUserBalance(userId); // Загрузка основного баланса после загрузки холда
        setIsLoadingBalance(false);
      }
    };

    fetchCardsAndBalances();
  }, [userId]);

  const isActive = (path) => {
    const isActivePath = pathname === path;
    return isActivePath;
  };

  return (
    <div>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Image
            src="/logo.svg"
            alt="Description"
            className="icon"
            width={72}
            height={87}
          />
        </div>
        <div className={styles.numbox}>
          <div className={styles.inner}>
            <div className={styles.totalWorth}>
              <h6>
                <span>{isLoadingBalance ? `${translations('Cardlist.loading')}` : `$${(balance).toFixed(2)}`}</span>
                &nbsp;
                <span className={styles.holdBalance}>{isLoadingBalance || holdBalance === null ? `${translations('Cardlist.loading')}` : `$${holdBalance.toFixed(2)}`}</span>
              </h6>
            </div>
            <Link href="/cabinet/topup" style={{ textDecoration: 'none' }} passHref>
              <button className={styles.button}>{translations('Dashboard.topup')}</button>
            </Link>
          </div>
        </div>
        <ul className={styles.navList}>
          <li className={isActive('/cabinet/cards') ? styles.active : styles.navItem}>
            <Link href="/cabinet/cards" passHref>
              <span className={styles.icon}></span>
              <span className={styles.icon}>
                <Image
                  src="/cardlogo.svg"
                  alt="Description"
                  className="icon"
                  width={30}
                  height={30}
                />
              </span>
              {translations('Sidebar.cards')}
            </Link>
          </li>
          <li className={isActive('/cabinet/transactions') ? styles.active : styles.navItem}>
            <Link href="/cabinet/transactions" passHref>
              <span className={styles.icon}></span>
              <span className={styles.icon}>
                <Image
                  src="/translogo.svg"
                  alt="Description"
                  className="icon"
                  width={28}
                  height={28}
                />
              </span>
              {translations('Sidebar.transactions')}
            </Link>
          </li>
          <li className={isActive('/cabinet/support') ? styles.active : styles.navItem}>
            <Link href="/cabinet/support">
              <span className={styles.icon}></span>
              <span className={styles.icon}>
                <Image
                  src="/helplogo.svg"
                  alt="Description"
                  className="icon"
                  width={28}
                  height={28}
                />
              </span>
              {translations('Sidebar.support')}
            </Link>
          </li>
          <li className={isActive('/cabinet/settings') ? styles.active : styles.navItem}>
            <Link href="/cabinet/settings">
              <span className={styles.icon}></span>
              <span className={styles.icon}>
                <Image
                  src="/gear.svg"
                  alt="Description"
                  className="icon"
                  width={28}
                  height={28}
                />
              </span>
              {translations('Sidebar.settings')}
            </Link>
          </li>
        </ul>
        <div className={styles.numbox}>
          <Switcher />
        </div>
      </aside>
      <div className={styles.psevdo}></div>
    </div>
  );
}

export default Sidebar;
