'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './id.module.css';
import { useTranslations } from "next-intl";
import '../../globals.css';
import Transhistory from '../../../../components/transhistory/Transhistory';
import Cardstory from '../../../../components/cardstory/Cardstory';

export default function CardPage() {
  const translations = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const [uuid, setUuid] = useState(null);
  const [cardsData, setCardsData] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardDetails, setCardDetails] = useState({ number: '', cvx2: '', exp_month: '', exp_year: '' });
  const [userId, setUserId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);

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

      const balanceResponse = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + `/api/user`);
      if (!balanceResponse.ok) {
        throw new Error(`Error fetching user balance: ${balanceResponse.status}`);
      }
      const usersData = await balanceResponse.json();
      const user = usersData.users.find((item) => item.id === userId);
      const currentBalance = Number(user.balance);

      const newBalance = currentBalance + selectedCard.account.balance;

      const updateResponse = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + `/api/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId, balance: newBalance }),
      });

      if (!updateResponse.ok) {
        throw new Error(`Error updating user balance: ${updateResponse.status}`);
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
            page: currentPage
          })
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
  
      setTransactions(allTransactions);
      setIsEmpty(allTransactions.length === 0);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setIsEmpty(true);
    }
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
        fetchCardTransactions(card.account.uuid);
      }
    }
  }, [uuid, cardsData]);

  if (!selectedCard) {
    return <p></p>;
  }

  console.log(cardDetails)

  const rootUrl = process.env.NEXT_PUBLIC_ROOT_URL;
  const shareUrl = `https://telegram.me/share/url?url=${encodeURIComponent(rootUrl)}/&text=CVV888`;

  return (
    <div>
      <div className={styles.dashboard}>
        <Link href="/cabinet/cards" style={{ textDecoration: 'none' }}>
          <div className={styles.backLink}>‹ {translations('Cards.cards')}</div>
        </Link>
        <div className={styles.header}>
          <div className={styles.headerContainer}>
            <h2 className={styles.title}>{selectedCard.description}</h2>
            <a href={shareUrl} target="_blank" rel="noopener noreferrer">
              <button className={styles.button}>{translations('Cards.share')}</button>
            </a>
          </div>
          <div className={styles.greyline}></div>
        </div>
      </div>
      <div className={styles.cardblock}>
        <div className={styles.card}>
          <div className={styles.cardImageContainer}>
            <img src="/fon.svg" className={styles.cardImage} />
            <div className={styles.cardDetailsOverlay}>
              <p className={styles.cardBalance}>${selectedCard.account.balance}</p>
            </div>
          </div>
        </div>
        <div className={styles.desc}>
          <p className={styles.smalltitle}>{translations('Cards.requisites')}</p>
          <div className={styles.topblock}>
            <div className={styles.top}>
              <p className={styles.smalltext}>{translations('Cards.number')}</p>
              <p className={styles.maintext}>{cardDetails.number}</p>
            </div>
            <div className={styles.top}>
              <p className={styles.smalltext}>{translations('Cards.date')}</p>
              <p className={styles.maintext}>{cardDetails.exp_month}/{cardDetails.exp_year}</p>
            </div>
            <div className={styles.top}>
              <p className={styles.smalltext}>{translations('Cards.cvc')}</p>
              <p className={styles.maintext}>{cardDetails.cvx2}</p>
            </div>
          </div>
          <div className={styles.bottomblock}>
            <div className={styles.bottom}>
              <p className={styles.smalltext}>{translations('Cards.owner')}</p>
              <p className={styles.maintext}>{selectedCard.holder_name}</p>
            </div>
            <div className={styles.bottom}>
              <p className={styles.smalltext}>{translations('Cards.address')}</p>
              <p className={styles.maintext}>{selectedCard.holder_address}</p>
            </div>
          </div>
          <button className={styles.buttonDelete} onClick={handleDeleteClick}>
            {isDeleting ? <div className={styles.loader}></div> : `${translations('Cards.block')}`}
          </button>
          <button className={styles.buttonRep} onClick={handleDeleteClick}>
            {isDeleting ? <div className={styles.loader}></div> : `${translations('Cards.replenish')}`}
          </button>
        </div>
      </div>
      {isPopupVisible && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h3>{translations('Cards.delete')}</h3>
            <div className={styles.popupButtons}>
              <button className={styles.popupButton} onClick={handleDeleteConfirmation}>{translations('Cards.yes')}</button>
              <button className={styles.popupButton} onClick={handleCancel}>{translations('Cards.no')}</button>
            </div>
          </div>
        </div>
      )}
      <div>
        {!isEmpty ? (
          <Cardstory transactions={transactions} />
        ) : (
          <Transhistory />
        )}
      </div>
    </div>
  );
}
