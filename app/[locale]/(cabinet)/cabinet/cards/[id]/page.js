"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './id.module.css';
import { useTranslations } from "next-intl"

export default function CardPage() {
  const translations = useTranslations()
  const pathname = usePathname();
  const router = useRouter();
  const [uuid, setUuid] = useState(null);
  const [cardsData, setCardsData] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardDetails, setCardDetails] = useState({ number: '', cvx2: '', exp_month: '', exp_year: '' });
  const [userId, setUserId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const fetchAllCards = async () => {
    try {
      const response = await fetch('https://api.epn.net/card', {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ',
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setCardsData(data.data);
    } catch (error) {
      console.error('Error fetching all cards:', error);
    }
  };

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
    } catch (error) {
      console.error('Error fetching card details:', error);
    }
  };

  const deleteCard = async (uuid) => {
    setIsDeleting(true);

    try {
      
      const response = await fetch('https://api.epn.net/card', {
        method: 'DELETE',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': '',
        },
        body: JSON.stringify({
          card_uuids: [uuid],
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      

      const removeResponse = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + '/api/del', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, cardId: selectedCard.external_id }),
      });

      if (!removeResponse.ok) {
        throw new Error(`Error removing card ID: ${removeResponse.status}`);
      }

      setTimeout(() => {
        setIsDeleting(false);
        router.push('/cabinet/cards');
      }, 10000);
    } catch (error) {
      console.error('Error deleting card:', error);
      setIsDeleting(false);
    }
  };

  const handleDeleteConfirmation = () => {
    setIsPopupVisible(false);
    deleteCard(selectedCard.uuid);
  };

  const handleDeleteClick = () => {
    setIsPopupVisible(true);
  };

  const handleCancel = () => {
    setIsPopupVisible(false);
  };

  useEffect(() => {
    const match = pathname.match(/\/([a-f0-9-]+)$/i);
    if (match && match[1]) {
      setUuid(match[1]);
    }
  }, [pathname]);

  useEffect(() => {
    fetchAllCards();
  }, []);

  useEffect(() => {
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

    fetchUserId();
  }, []);

  useEffect(() => {
    if (uuid !== null && cardsData.length > 0) {
      const card = cardsData.find((card) => card.uuid === uuid);
      setSelectedCard(card || null);

      if (card && card.uuid) {
        fetchCardDetails(card.uuid);
      }
    }
  }, [uuid, cardsData]);

  if (!selectedCard) {
    return <p></p>;
  }

  const rootUrl = process.env.NEXT_PUBLIC_ROOT_URL;
  const shareUrl = `https://telegram.me/share/url?url=${encodeURIComponent(rootUrl)}/&text=CVV888`;

  return (
    <div>
      <div className={styles.dashboard}>
        <Link href="/cabinet/cards" style={{ textDecoration: 'none' }}>
          <div className={styles.backLink}>‹ {translations('BuyCard.cards')}</div>
        </Link>
        <div className={styles.header}>
          <div className={styles.headerContainer}>
            <h2 className={styles.title}>{selectedCard.tariff.name} {selectedCard.ordered_at}</h2>
            <a href={shareUrl} target="_blank" rel="noopener noreferrer">
              <button className={styles.button}>{translations('BuyCard.share')}</button>
            </a>
          </div>
          <div className={styles.greyline}></div>
        </div>
      </div>
      <div className={styles.cardblock}>
        <div className={styles.card}>
          <div className={styles.cardImageContainer}>
            <img src="https://i.ibb.co/k1LcxWK/Screenshot-1124-removebg-preview.png" className={styles.cardImage} />
            <div className={styles.cardDetailsOverlay}>
              <p className={styles.cardBalance}>${selectedCard.account.balance}</p>
            </div>
          </div>
        </div>
        <div className={styles.desc}>
          <p className={styles.smalltitle}>{translations('BuyCard.requisites')}</p>
          <div className={styles.topblock}>
            <div className={styles.top}>
              <p className={styles.smalltext}>{translations('BuyCard.number')}</p>
              <p className={styles.maintext}>{cardDetails.number}</p>
            </div>
            <div className={styles.top}>
              <p className={styles.smalltext}>{translations('BuyCard.date')}</p>
              <p className={styles.maintext}>{cardDetails.exp_month}/{cardDetails.exp_year}</p>
            </div>
            <div className={styles.top}>
              <p className={styles.smalltext}>{translations('BuyCard.cvc')}</p>
              <p className={styles.maintext}>{cardDetails.cvx2}</p>
            </div>
          </div>
          <div className={styles.bottomblock}>
            <div className={styles.bottom}>
              <p className={styles.smalltext}>{translations('BuyCard.owner')}</p>
              <p className={styles.maintext}>{selectedCard.holder_name}</p>
            </div>
            <div className={styles.bottom}>
              <p className={styles.smalltext}>{translations('BuyCard.address')}</p>
              <p className={styles.maintext}>{selectedCard.holder_address}</p>
            </div>
          </div>
        </div>
      </div>
      <button className={styles.buttonDelete} onClick={handleDeleteClick}>
        {isDeleting ? <div className={styles.loader}></div> : 'Block and delete the card'}
      </button>
      {isPopupVisible && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h3>{translations('BuyCard.delete')}</h3>
            <div className={styles.popupButtons}>
              <button className={styles.popupButton} onClick={handleDeleteConfirmation}>{translations('BuyCard.yes')}</button>
              <button className={styles.popupButton} onClick={handleCancel}>{translations('BuyCard.no')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}