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
  const [balance, setBalance] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isRepPopupVisible, setIsRepPopupVisible] = useState(false);
  const [isReturnPopupVisible, setIsReturnPopupVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [replenishAmount, setReplenishAmount] = useState("");
  const [returnAmount, setReturnAmount] = useState("");
  const [repErrorMessage, setRepErrorMessage] = useState("");
  const [returnErrorMessage, setReturnErrorMessage] = useState("");
  const [isRepLoading, setIsRepLoading] = useState(false);
  const [isReturnLoading, setIsReturnLoading] = useState(false);

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
      console.log(data)
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

  const fetchUserBalance = async (userId) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + `/api/cabinet?id=${userId}`);
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

  const deleteCard = async (uuid) => {
    console.log("Айди которое передаем:", uuid);
    setIsDeleting(true);
  
    try {
      const response = await fetch('/api/check-card-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardUuid: uuid, userId, cardBalance: selectedCard.account.balance }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
  
      setTimeout(() => {
        setIsDeleting(false);
        window.location.href = "/cabinet/cards";
      }, 10000);
    } catch (error) {
      console.error('Error deleting card:', error);
      setTimeout(() => {
        setIsDeleting(false);
        window.location.href = "/cabinet/cards";
      }, 10000);
    }
  };
  

  const handleDeleteConfirmation = () => {
    setIsPopupVisible(false);
    console.log("Выбранная карта:");
    deleteCard(selectedCard.uuid);
  };

  const handleDeleteClick = () => {
    setIsPopupVisible(true);
  };

  const handleCancel = () => {
    setIsPopupVisible(false);
    setIsRepPopupVisible(false);
    setIsReturnPopupVisible(false);
  };

  const handleRepClick = () => {
    setIsRepPopupVisible(true);
  };

  const handleRepConfirmation = async () => {
    if (!replenishAmount) {
      setRepErrorMessage(translations('Cards.enterAmount'));
      return;
    }
    if (isNaN(replenishAmount)) {
      setRepErrorMessage(translations('Cards.invalidAmount'));
      return;
    }
    if (parseFloat(replenishAmount) > balance) {
      setRepErrorMessage(translations('Cards.insufficientBalance'));
      return;
    }
  
    setIsRepLoading(true);
    let originalBalance = balance;
    let replenishAmountFloat = parseFloat(replenishAmount);
  
    try {
      const minResponse = await fetch('/api/min', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, balanceChange: -replenishAmountFloat }),
      });
  
      if (!minResponse.ok) {
        throw new Error(`Error: ${minResponse.status}`);
      }
  
      const response = await fetch('/api/replenish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          toAccountUuid: selectedCard.account.uuid,
          amount: replenishAmountFloat,
        }),
      });
  
      if (!response.ok) {
        await fetch('/api/min', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, balanceChange: replenishAmountFloat }),
        });
        throw new Error(`Error: ${response.status}`);
      }
  
      await fetchUserBalance(userId);
  
      setTimeout(() => {
        setIsRepLoading(false);
        setIsRepPopupVisible(false);
        setRepErrorMessage("");
        setReplenishAmount("");
        window.location.href = `/cabinet/cards/${uuid}`;
      }, 20000);
    } catch (error) {
      console.error('Error making transfer:', error);
      setRepErrorMessage(translations('Cards.transfererr'));
      setIsRepLoading(false);
    }
  };

  const handleReturnClick = () => {
    setIsReturnPopupVisible(true);
  };

  const handleReturnConfirmation = async () => {
    if (!returnAmount) {
      setReturnErrorMessage(translations('Cards.enterAmount'));
      return;
    }
    if (isNaN(returnAmount)) {
      setReturnErrorMessage(translations('Cards.invalidAmount'));
      return;
    }
    if (parseFloat(returnAmount) > selectedCard.account.balance) {
      setReturnErrorMessage(translations('Cards.exceeds'));
      return;
    }
  
    setIsReturnLoading(true);
  
    try {
      const response = await fetch('/api/return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAccountUuid: selectedCard.account.uuid,
          userId,
          amount: Number(returnAmount),
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const result = await response.json();
      const newBalance = result.newBalance;
  
      // Optionally update the balance in the UI
      setBalance(parseFloat(newBalance));
  
      const transactionResponse = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + '/api/newtrans', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          type: 'transfer',
          description: 'Transfer from card',
          amount: parseFloat(returnAmount)
        }),
      });
  
      if (!transactionResponse.ok) {
        const errorData = await transactionResponse.json();
        console.error(`Error logging transaction: ${transactionResponse.status}`, errorData);
        throw new Error(`Error logging transaction: ${transactionResponse.status}`);
      }
  
      setTimeout(() => {
        setIsReturnLoading(false);
        setIsReturnPopupVisible(false);
        setReturnErrorMessage("");
        setReturnAmount("");
        window.location.href = `/cabinet/cards/${uuid}`;
      }, 10000);
    } catch (error) {
      console.error('Error during return:', error);
      setReturnErrorMessage(translations('Cards.transfererr'));
      setIsReturnLoading(false);
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
    if (userId) {
      fetchUserBalance(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (uuid !== null && cardsData.length > 0) {
      const card = cardsData.find((card) => card.uuid === uuid);
      setSelectedCard(card || null);

      if (card && card.uuid) {
        console.log(card.uuid)
        console.log(card)
        fetchCardDetails(card.uuid);
        fetchCardTransactions(card.account.uuid);
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
          <button className={styles.buttonRep} onClick={handleRepClick}>
            {isRepLoading ? <div className={styles.loader}></div> : `${translations('Cards.replenish')}`}
          </button>
          <button className={styles.buttonReturn} onClick={handleReturnClick}>
            {isReturnLoading ? <div className={styles.loader}></div> : `${translations('Cards.return')}`}
          </button>
          <button className={styles.buttonDelete} onClick={handleDeleteClick}>
            {isDeleting ? <div className={styles.loader}></div> : `${translations('Cards.block')}`}
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
      {isRepPopupVisible && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h3>{translations('Cards.replenish')}</h3>
            <input
              type="text"
              className={styles.popupInput}
              value={replenishAmount}
              onChange={(e) => setReplenishAmount(e.target.value)}
              placeholder={translations('Cards.amount')}
            />
            {repErrorMessage && <p className={styles.error}>{repErrorMessage}</p>}
            <div className={styles.popupButtons}>
              <button className={styles.popupButton} onClick={handleRepConfirmation}>
                {isRepLoading ? <div className={styles.loader}></div> : translations('Cards.confirm')}
              </button>
              <button className={styles.popupButton} onClick={handleCancel}>{translations('Cards.cancel')}</button>
            </div>
          </div>
        </div>
      )}
      {isReturnPopupVisible && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h3>{translations('Cards.return')}</h3>
            <input
              type="text"
              className={styles.popupInput}
              value={returnAmount}
              onChange={(e) => setReturnAmount(e.target.value)}
              placeholder={translations('Cards.amount')}
            />
            {returnErrorMessage && <p className={styles.error}>{returnErrorMessage}</p>}
            <div className={styles.popupButtons}>
              <button className={styles.popupButton} onClick={handleReturnConfirmation}>
                {isReturnLoading ? <div className={styles.loader}></div> : translations('Cards.confirm')}
              </button>
              <button className={styles.popupButton} onClick={handleCancel}>{translations('Cards.cancel')}</button>
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
