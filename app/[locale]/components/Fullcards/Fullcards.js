'use client';

import React, { useState, useEffect } from 'react';
import styles from './Fullcards.module.css';
import { useTranslations } from "next-intl";
import '../globals.css';

const Fullcards = () => {
  const translations = useTranslations();
  const [userId, setUserId] = useState(null);
  const [userCards, setUserCards] = useState([]);
  const [cardsData, setCardsData] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [cardDetails, setCardDetails] = useState(null);
  const [copiedCardId, setCopiedCardId] = useState(null);

  const fetchUserId = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + '/api/token');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setUserId(8);
    } catch (error) {
      console.error('Error fetching user ID:', error);
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

  const fetchAllCards = async () => {
    let allCards = [];
    let currentPage = 1;
    const perPage = 25; // Количество карт на странице
  
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
  
        // Проверяем, есть ли следующая страница
        if (data.meta.current_page * perPage >= data.meta.total) {
          break;
        }
        currentPage++;
      }
  
      setCardsData(allCards);
    } catch (error) {
      console.error('Error fetching all cards:', error);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId !== null) {
      fetchUserCards(userId).then(setUserCards);
    }
  }, [userId]);

  useEffect(() => {
    fetchAllCards();
  }, []);

  const fetchCardDetails = async (uuid) => {
    try {
      const response = await fetch(`https://api.epn.net/card/${uuid}/showpan`, {
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
      setCardDetails({
        number: data.data.number,
        cvx2: data.data.cvx2,
        exp_month: data.data.exp_month,
        exp_year: data.data.exp_year,
      });
      return data.data;
    } catch (error) {
      console.error('Error fetching card details:', error);
    }
  };

  const handleCopyData = async (uuid) => {
    const details = await fetchCardDetails(uuid);
    const dataToCopy = `${details.number} ${details.cvx2} ${details.exp_month}/${details.exp_year}`;
    navigator.clipboard.writeText(dataToCopy).then(() => {
      setCopiedCardId(uuid); // Set the ID of the copied card
    }).catch(err => console.error('Failed to copy text: ', err));
  };

  const handleMenuClick = (event, cardUuid) => {
    event.stopPropagation();
    setMenuOpen(cardUuid === menuOpen ? null : cardUuid);
    if (cardUuid !== menuOpen) {
      setCopiedCardId(null); // Reset copied state if the menu is reopened
    }
  };

  const handleCloseMenu = () => {
    setMenuOpen(null);
    setCopiedCardId(null); // Reset copied state when menu is closed
  };

  const handleDetailedInfoClick = (uuid) => {
    window.location.href = `/cabinet/cards/${uuid}`;
  };

  const filteredCards = cardsData.filter((card) => userCards.includes(card.external_id));

  return (
    <div className={styles.assetsContainer} onClick={handleCloseMenu}>
      <div className={styles.header}>
        <h2 className={styles.amount}>{translations('Fullcards.cards')} {filteredCards.length}</h2>
      </div>

      <div className={styles.cardsContainer}>
        {filteredCards.map((card) => (
          <div key={card.uuid} className={styles.cardContainer} onClick={(e) => handleMenuClick(e, card.uuid)}>
            <div className={styles.card}>
              <div className={styles.cardImageContainer}>
                <img
                  src="https://i.ibb.co/k1LcxWK/Screenshot-1124-removebg-preview.png"
                  className={styles.cardImage}
                />
                <div className={styles.cardDetailsOverlay}>
                  <h3 className={styles.cardNumber}>{card.mask}</h3>
                  <p className={styles.cardBalance}>${card.account.balance.toFixed(2)}</p>
                </div>
              </div>
              <h3 className={styles.cardTitle}>{card.description}</h3>
              <p className={styles.cardDescription}>{card.tariff.name}</p>
            </div>
            <div className={`${styles.menu} ${menuOpen === card.uuid ? styles.menuOpen : ''}`} onClick={(e) => e.stopPropagation()}>
              <div className={styles.menuItem} onClick={(e) => { e.stopPropagation(); handleCopyData(card.uuid); }}>
                {translations('Fullcards.copyData')} {copiedCardId === card.uuid && <span className={styles.copiedMark}>✓</span>}
              </div>
              <div className={styles.menuItem} onClick={(e) => { e.stopPropagation(); handleDetailedInfoClick(card.uuid); }}>
                {translations('Fullcards.detailedInfo')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fullcards;
