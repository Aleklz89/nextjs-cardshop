import React from 'react';
import styles from './buycard.module.css';
import Link from 'next/link';
import Image from 'next/image';
import cardsdata from '../../cardsdata.json'


const Dashboard = () => {
    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <div className={styles.headerContainer}>
                    <h1>Dashboard</h1>
                    <button className={styles.button}>Share</button>
                </div>
                <div className={styles.buttons}>
                    <Link href="/cards" style={{ textDecoration: 'none' }} passHref>

                        <button className={styles.button}>My cards</button>
                    </Link>
                    <Link href="/shop" style={{ textDecoration: 'none' }} passHref>
                        <button className={styles.buy}>Order a card</button>
                    </Link>
                    <Link href="/topup" style={{ textDecoration: 'none' }} passHref>
                        <button className={styles.button}>Top up</button>
                    </Link>
                </div>
            </div>
            <div className={styles.totalWorth}>
                <span>Balance</span>
                <h2>$0</h2>
            </div>

            <div className={styles.cardissuecontainer}>
                <div className={styles.cardissuecontent}>
                    <h2>Become the owner of CVV888 card</h2>
                    <p>A wide selection of cards to suit everyone's needs</p>
                    <div className={styles.cardissuedetails}>
                        <div className={styles.detail}>
                            <span className={styles.price}>from $10/month</span>
                            <span className={styles.description}>Starting next month</span>
                        </div>
                        <div className={styles.detail}>
                            <span className={styles.price}>from 5%</span>
                            <span className={styles.description}>Commission for replenishment</span>
                        </div>
                    </div>
                </div>
                <div>
                    <Image
                        src="https://i.ibb.co/Rj3mssL/imgonline-com-ua-Replace-color-fs5psh-Iw-ROo-S-removebg-preview.png"
                        alt="Logo"
                        height="100"
                        width="100"

                    />
                </div>
            </div>
            <div className={styles.advertisingcontainer}>
                <div className={styles.header}>
                    <h2>Advertising <span className={styles.bincount}>BINs: {cardsdata.number}</span></h2>
                    <p>Ad-cards are designed and optimized to pay for ads. We recommend choosing ad-BINs to work with, they will perform better</p>
                </div>

                <div className={styles.cardscontainer}>
                    {cardsdata.map((card) => (
                        <div className={styles.visa} key={card.id}>
                            <div className={styles.cardblock}>
                                <h3>Visa</h3>
                                <p className={styles.cardnumber}>{card.number}</p>
                                <Link href={`/buycard/${card.id}`} style={{ textDecoration: 'none' }} passHref key={card.id}>
                                    <button className={styles.buybutton}>Buy</button>
                                </Link>
                            </div>
                            <div className={styles.imgblock}>
                                <Image
                                    src="https://i.ibb.co/k1LcxWK/Screenshot-1124-removebg-preview.png"
                                    alt="Visa Card"
                                    height="100"
                                    width="150"
                                    className={styles.image}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
