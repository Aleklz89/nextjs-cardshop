import React from 'react';
import styles from './Fullcards.module.css';
import Image from 'next/image';
import Link from 'next/link';


const Fullcards = ({ cards }) => {
    return (
        <div className={styles.assetsContainer}>
            <div className={styles.header}>
                <h2 className={styles.amount}>Cards: {cards.length}</h2>
                <Link href="/tags" style={{ textDecoration: 'none' }}>
                    <button className={styles.managetagsbtn}>
                        <Image
                            src="https://i.ibb.co/cx5rk1n/tune-icon-137067.png"
                            alt="Manage tags"
                            className={styles.icontags}
                            width={20}
                            height={20}

                        />
                        Manage tags
                    </button>
                </Link>
            </div>

            <div className={styles.cardsContainer}>
                {cards.map((card) => (
                    <Link href={`/cards/${card.id}`} style={{ textDecoration: 'none' }} passHref key={card.id}>
                    <div className={styles.card}>
                      <div className={styles.cardImageContainer}>
                        <img src={card.imageUrl} alt={card.title} className={styles.cardImage} />
                        <div className={styles.cardDetailsOverlay}>
                          <h3 className={styles.cardNumber}>{card.number}</h3>
                          <p className={styles.cardBalance}>{card.balance}</p>
                        </div>
                      </div>
                      <h3 className={styles.cardTitle}>{card.title}</h3>
                      <p className={styles.cardDescription}>{card.description}</p>
                    </div>
                  </Link>
                ))}
            </div>
        </div>
    );
};

export default Fullcards;

