'use client';

import React, { useState, useEffect } from 'react';
import styles from './Fullcards.module.css';
import { useTranslations } from "next-intl";
import '../globals.css';
import Cardslist from '../cardlist/Cardslist';

const Fullcards = () => {
  const translations = useTranslations();
  const [userId, setUserId] = useState(null);
  const [userCards, setUserCards] = useState([]);
  const [cardsData, setCardsData] = useState([]);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [cardDetails, setCardDetails] = useState(null);
  const [copiedCardId, setCopiedCardId] = useState(null);
  const [showCardlist, setShowCardlist] = useState(true);
  const [selectedCards, setSelectedCards] = useState([]);
  const [showSelectMessage, setShowSelectMessage] = useState(false);
  const [replenishAmount, setReplenishAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const disableScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('scroll', disableScroll);

    const timer = setTimeout(() => {
      document.body.style.overflow = 'scroll';
      window.removeEventListener('scroll', disableScroll);
      setShowCardlist(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
      window.removeEventListener('scroll', disableScroll);
    };
  }, []);

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
      setCopiedCardId(uuid); 
    }).catch(err => console.error('Failed to copy text: ', err));
  };

  const handleMouseEnter = (cardUuid) => {
    setHoveredCardId(cardUuid);
    setCopiedCardId(null); 
  };

  const handleMouseLeave = () => {
    setHoveredCardId(null);
    setCopiedCardId(null); 
  };

  const handleDetailedInfoClick = (uuid) => {
    window.location.href = `/cabinet/cards/${uuid}`;
  };

  const filteredCards = cardsData.filter((card) => userCards.includes(card.external_id) && card.blocked_at === null);

  const handleCardClick = (card) => {
    if (!showSelectMessage) return;
    const cardUuid = card.account.uuid;
    if (selectedCards.includes(cardUuid)) {
      setSelectedCards(selectedCards.filter((id) => id !== cardUuid));
    } else {
      setSelectedCards([...selectedCards, cardUuid]);
    }
  };

  const handleReplenishClick = () => {
    if (showSelectMessage) {
      setSelectedCards([]);
      setReplenishAmount("");
      setErrorMessage("");
    }
    setShowSelectMessage(!showSelectMessage);
  };

  const handleReplenishConfirm = async () => {
    if (!replenishAmount) {
      setErrorMessage('Введите сумму');
      return;
    }
    if (isNaN(replenishAmount)) {
      setErrorMessage('Проверьте корректность введенных данных');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/replenish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toAccountUuid: selectedCards,
          amount: Number(replenishAmount),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const fetchUserBalance = async (id) => {
        try {
          const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + `/api/cabinet?id=${id}`);
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          const data = await response.json();
          return parseFloat(data.user.balance);
        } catch (error) {
          console.error('Error fetching user balance:', error);
          return null;
        }
      };

      const balance = await fetchUserBalance(userId);
      if (balance !== null) {
        const totalCost = Number(replenishAmount) * selectedCards.length;
        const updatedBalance = balance - totalCost;
        const updateBalanceResponse = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + "/api/min", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, balance: updatedBalance.toFixed(2) }),
        });

        if (!updateBalanceResponse.ok) {
          throw new Error(`Error: ${updateBalanceResponse.status}`);
        }
      }

      setTimeout(() => {
        setIsLoading(false);
        alert(translations('Fullcards.success'));
        window.location.href = "/cabinet/cards";
      }, 10000);
    } catch (error) {
      console.error('Error during replenish:', error);
      setErrorMessage(translations('Fullcards.error'));
      setIsLoading(false);
      setTimeout(() => {
        window.location.href = "/cabinet/cards";
      }, 10000);
    }
  };

  return (
    <div className={styles.relativeContainer}>
      {showCardlist && <div className={styles.cover}><Cardslist className={styles.coverblock} /></div>}
      <div className={styles.assetsContainer}>
        <div className={styles.header}>
          <h2 className={styles.amount}>{translations('Fullcards.cards')} {filteredCards.length}</h2>
          <button className={styles.replenishButton} onClick={handleReplenishClick}>
            {translations('Fullcards.replenish')}
          </button>
        </div>
        {showSelectMessage && (
          <div className={styles.replenishContainer}>
            {selectedCards.length === 0 ? (
              <p>{translations('Fullcards.choose')}</p>
            ) : (
              <>
                <input
                  type="text"
                  value={replenishAmount}
                  onChange={(e) => setReplenishAmount(e.target.value)}
                  placeholder={translations('Fullcards.sum')}
                  className={styles.replenishInput}
                />
                <button className={styles.replenishConfirmButton} onClick={handleReplenishConfirm} disabled={isLoading}>
                  {isLoading ? <span className={styles.loader}></span> : translations('Fullcards.topup')}
                </button>
                {errorMessage && <p className={styles.error}>{errorMessage}</p>}
              </>
            )}
          </div>
        )}
        <div className={styles.cardsContainer}>
          {filteredCards.map((card) => (
            <div
              key={card.uuid}
              className={`${styles.cardContainer} ${selectedCards.includes(card.account.uuid) ? styles.selected : ''}`}
              onMouseEnter={() => handleMouseEnter(card.uuid)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleCardClick(card)}
            >
              <div className={styles.card}>
                <div className={styles.cardImageContainer}>
                  <img
                    src="/fon.svg"
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
              {hoveredCardId === card.uuid && (
                <div className={styles.menu}>
                  <div className={styles.menuItem} onClick={() => handleCopyData(card.uuid)}>
                    {translations('Fullcards.copyData')} {copiedCardId === card.uuid && <span className={styles.copiedMark}>✓</span>}
                  </div>
                  <div className={styles.menuItem} onClick={() => handleDetailedInfoClick(card.uuid)}>
                    {translations('Fullcards.detailedInfo')}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Fullcards;
