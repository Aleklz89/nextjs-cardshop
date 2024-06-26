'use client';

import React, { useState, useEffect } from 'react';
import styles from './Fullcards.module.css';
import { useTranslations } from "next-intl";
import '../globals.css';

const Fullcards = ({ cards }) => {
  const translations = useTranslations();
  const [userId, setUserId] = useState(null);
  const [userCards, setUserCards] = useState([]);
  const [copiedCardId, setCopiedCardId] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedDeleteCards, setSelectedDeleteCards] = useState([]);
  const [showSelectMessage, setShowSelectMessage] = useState(false);
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);
  const [replenishAmount, setReplenishAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    console.time('DisableScroll');
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
      setShowSelectMessage(false);
      console.timeEnd('DisableScroll');
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
      window.removeEventListener('scroll', disableScroll);
    };
  }, []);

  useEffect(() => {
    console.time('FetchUserId');
    fetchUserId();
  }, []);

  const fetchUserId = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + '/api/token');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setUserId(data.userId);
      console.timeEnd('FetchUserId');
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  useEffect(() => {
    const reversedCards = [...cards].reverse();
    setUserCards(reversedCards);
    console.log('Reversed cards:', reversedCards);
  }, [cards]);

  const fetchCardDetails = async (uuid) => {
    console.time(`FetchCardDetails-${uuid}`);
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
      console.timeEnd(`FetchCardDetails-${uuid}`);
      return data.data;
    } catch (error) {
      console.error('Error fetching card details:', error);
      throw error;
    }
  };

  const handleCopyData = async (uuid) => {
    console.time(`HandleCopyData-${uuid}`);
    try {
      const details = await fetchCardDetails(uuid);
      const dataToCopy = `${details.number};${details.exp_month};${details.exp_year};${details.cvx2}`;

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(dataToCopy);
        setCopiedCardId(uuid);
        console.timeEnd(`HandleCopyData-${uuid}`);
      } else {
        fallbackCopyTextToClipboard(dataToCopy);
      }
    } catch (err) {
      console.warn('Clipboard API failed, falling back to textarea method:', err);
      fallbackCopyTextToClipboard(dataToCopy);
    }
  };

  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      setCopiedCardId(text);
    } catch (err) {
      console.error('Fallback method also failed:', err);
    }

    document.body.removeChild(textArea);
    console.timeEnd(`HandleCopyData-${text}`);
  };

  const handleCardClick = (card) => {
    if (!showSelectMessage && !showDeleteMessage) return;
    const cardUuid = card.account.uuid;
    if (selectedCards.includes(cardUuid)) {
      setSelectedCards(selectedCards.filter((id) => id !== cardUuid));
    } else {
      setSelectedCards([...selectedCards, cardUuid]);
    }
  };

  const handleDeleteCardClick = (card) => {
    if (!showDeleteMessage) return;
    const cardUuid = card.uuid;
    if (selectedDeleteCards.includes(cardUuid)) {
      setSelectedDeleteCards(selectedDeleteCards.filter((id) => id !== cardUuid));
    } else {
      setSelectedDeleteCards([...selectedDeleteCards, cardUuid]);
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

  const handleDeleteClick = () => {
    if (showDeleteMessage) {
      setSelectedDeleteCards([]);
    }
    setShowDeleteMessage(!showDeleteMessage);
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
    console.time('ReplenishConfirm');
    try {
      const totalAmount = Number(replenishAmount) * selectedCards.length;
      const response = await fetch('/api/replenish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          toAccountUuids: selectedCards,
          amountPerCard: Number(replenishAmount),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error === "Insufficient funds") {
          setErrorMessage(translations('Fullcards.funds'));
        } else {
          setErrorMessage(translations('Fullcards.error'));
        }
        throw new Error(`Error: ${response.status}`);
      }

      setTimeout(() => {
        setIsLoading(false);
        alert(translations('Fullcards.success'));
        window.location.href = "/cabinet/cards";
        console.timeEnd('ReplenishConfirm');
      }, 10000);
    } catch (error) {
      console.error('Error during replenish:', error);
      setIsLoading(false);
      setErrorMessage(error.message);
      console.timeEnd('ReplenishConfirm');
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedDeleteCards.length === 0) {
      setErrorMessage('Выберите хотя бы одну карту для удаления');
      return;
    }

    setIsDeleting(true);
    console.time('DeleteConfirm');
    try {
      const selectedDeleteCardsWithBalances = selectedDeleteCards.map((cardUuid) => {
        const card = userCards.find((c) => c.uuid === cardUuid);
        return {
          cardUuid,
          balance: card ? card.account.balance : 0,
        };
      });

      const response = await fetch('/api/deleteCard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          cardUuidsWithBalances: selectedDeleteCardsWithBalances,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
        setIsDeleting(false);
        return;
      }

      setTimeout(() => {
        setIsDeleting(false);
        alert(translations('Fullcards.sucdel'));
        window.location.href = "/cabinet/cards";
        console.timeEnd('DeleteConfirm');
      }, 10000);
    } catch (error) {
      console.error('Error during delete:', error);
      setErrorMessage(error.message);
      setIsDeleting(false);
    }
  };

  const handleDetailedInfoClick = (uuid) => {
    window.location.href = `/cabinet/cards/${uuid}`;
  };

  useEffect(() => {
    console.time('RenderCards');
  }, []);

  useEffect(() => {
    if (userCards.length > 0) {
      console.timeEnd('RenderCards');
    }
  }, [userCards]);

  return (
    <div className={styles.relativeContainer}>
      <div className={styles.assetsContainer}>
        <div className={styles.header}>
          <h2 className={styles.amount}>{translations('Fullcards.cards')} {userCards.length}</h2>
          <div>
            <button className={styles.replenishButton} onClick={handleReplenishClick}>
              {translations('Fullcards.replenish')}
            </button>
            <button className={styles.replenishButton} onClick={handleDeleteClick}>
              {translations('Fullcards.delete')}
            </button>
          </div>
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
        {showDeleteMessage && (
          <div className={styles.deleteContainer}>
            {selectedDeleteCards.length === 0 ? (
              <p>{translations('Fullcards.chooseToDelete')}</p>
            ) : (
              <>
                <button className={styles.deleteConfirmButton} onClick={handleDeleteConfirm} disabled={isDeleting}>
                  {isDeleting ? <span className={styles.loader}></span> : translations('Fullcards.confirmDelete')}
                </button>
                {errorMessage && <p className={styles.error}>{errorMessage}</p>}
              </>
            )}
          </div>
        )}
        <div className={styles.cardsContainer}>
          {userCards.map((card) => (
            <div
              key={card.uuid}
              className={`${styles.cardContainer} ${selectedCards.includes(card.account.uuid) ? styles.selected : ''} ${selectedDeleteCards.includes(card.uuid) ? styles.selected : ''}`}
              onClick={() => {
                if (showSelectMessage) {
                  handleCardClick(card);
                }
                if (showDeleteMessage) {
                  handleDeleteCardClick(card);
                }
              }}
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
                <div className={styles.cardMenu}>
                  <button
                    className={styles.detailedInfoButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDetailedInfoClick(card.uuid);
                    }}
                  >
                    {translations('Fullcards.detailedInfo')}
                  </button>
                  <button
                    className={`${styles.copyDataButton} ${copiedCardId === card.uuid ? styles.copied : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyData(card.uuid);
                    }}
                  >
                    {translations('Fullcards.copyData')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Fullcards;
