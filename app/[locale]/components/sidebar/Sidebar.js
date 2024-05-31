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
      console.log(data.user.balance)
    } catch (error) {
      console.error('Error fetching user balance:', error);
      setBalance(null);
    }
  };

  const fetchAllCards = async () => {
    let allCards = [];
    let currentPage = 1;
    const perPage = 25;

    try {
      while (true) {
        const response = await fetch(`https://api.epn.net/card?page=${currentPage}`, {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ',
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        allCards = allCards.concat(data.data);

        if (data.meta.current_page * perPage >= data.meta.total) {
          break;
        }
        currentPage++;
      }
      return allCards;
    } catch (error) {
      console.error('Error fetching all cards:', error);
      return [];
    }
  };

  const fetchUserCards = async (userId) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + `/api/cabinet?id=${userId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data.user.cardsIds || [];
    } catch (error) {
      console.error('Error fetching user cards:', error);
      return [];
    }
  };

  const fetchCardTransactions = async (cardId) => {
    let allTransactions = [];
    let currentPage = 1;

    try {
      while (true) {
        const response = await fetch(`https://api.epn.net/transaction`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ',
            'X-CSRF-TOKEN': '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'output,output_transfer',
            account_uuid: cardId,
            page: currentPage,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error: ${response.status}, ${errorText}`);
        }

        const data = await response.json();
        allTransactions = allTransactions.concat(data.data);

        if (!data.links.next) {
          break;
        }
        currentPage++;
      }
      return allTransactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId !== null) {
      fetchUserBalance(userId).then(() => {
        fetchUserCards(userId).then(async (userCards) => {
          const allCards = await fetchAllCards();
          const filteredCards = allCards.filter((card) => userCards.includes(card.external_id));
          let holdBalance = 0;
          for (const card of filteredCards) {
            const transactions = await fetchCardTransactions(card.account.uuid);
            if (!transactions) continue;
            const holdTransactions = transactions.filter((transaction) => transaction.type_enum === 'Authorization');
            holdBalance += holdTransactions.reduce((acc, transaction) => acc + Math.abs(parseFloat(transaction.amount)), 0);
          }
          setHoldBalance(parseFloat(holdBalance.toFixed(2)));
          setIsLoadingBalance(false);
        });
      });
    }
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
            <Link href="/cabinet/cards" passHref className={styles.txt}>
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
