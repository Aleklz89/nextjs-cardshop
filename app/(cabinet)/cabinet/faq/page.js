"use client"

import styles from './faq.module.css';
import React, { useState } from 'react';
import Link from 'next/link';

const faqData = [
    {
        question: 'Terms of money withdrawal from the card to the account?',
        answer: 'The transfer of funds from the card to the account balance takes no more than 1 day.',
    },
    {
        question: 'Support service operating hours?',
        answer: '24/7 personal support.',
    },
    {
        question: 'What is BIN?',
        answer: 'Bank identification number, it defines the payment system of the card (Visa, MS, etc.), the country of the issued card, the bank that issued the card, etc. You can independently check our BINs using any BINchecker # https://bincheck.io/',
    },
    {
        question: 'Why is it necessary to verify the account?',
        answer: 'Account verification allows you to issue an unlimited number of cards and get access to additional BINs.',
    },
    {
        question: 'Is it possible to withdraw money from the service?',
        answer: 'Yes, it is possible. The service charges a commission of 10% of the withdrawal amount. Please note that the minimum withdrawal amount is $100',
    },
    {
        question: 'What is the level of trust to our cards among media platforms?',
        answer: 'Our cards are highly trusted and are compatible with almost all advertising services. We are actively fighting with fraudulent actions that affect credibility from media platforms towards our cards. Users violating the companys policy may be banned.',
    },
    {
        question: 'How to view the transactions history?',
        answer: 'You can view the history of transactions in the "Transaction history" section. To do that go to the "Transactions" section, select the necessary card by clicking on the icon and you will find the transaction history.',
    },
    {
        question: 'How to top up the balance?',
        answer: 'Go to the "Cards --> Top up" section. Enter the deposit amount (at least 30.00 USD). Choose the "Top up" section. Select the deposit method "BTC" or "USDT". Make the transfer.',
    },
    {
        question: 'How can I turn on the automatic card replenishment?',
        answer: 'When the card is issued, you will be asked to add an option for an automatic replenishment of the card. If you did not use this function and wish to do it later, you need to open "Cards" section, select the card you need and click "Auto-top-up". Enter the required amount and click "Save".',
    },
    {
        question: 'What happens if you forget to top up your card on time?',
        answer: 'In this case, your card will be blocked without further possibility to unblock it. For your convenience, use the "auto-top-up" option.',
    },
    {
        question: 'How much does the card service cost?',
        answer: 'Service monthly fees: Universal cards - 15 USD per month Advertisement cards - 10 USD per month. Also, the service charges a single commission of 2.5-7%, depending on the amount.',
    },
    {
        question: 'How long does it take to issue a card?',
        answer: 'The card will be issued immediately.',
    },
    {
        question: 'How to order the card?',
        answer: 'Choose the "Cards" section, click "Order a card", choose the type of the card you are interested in and click "Buy", enter the amount you would like to deposit, confirm the terms of the service, click "Order a new card" button.',
    },
];


const FAQ = () => {
    const [activeIndices, setActiveIndices] = useState([]);

    const toggleAccordion = (index) => {

        const isActive = activeIndices.includes(index);
        if (isActive) {

            setActiveIndices(activeIndices.filter(i => i !== index));
        } else {

            setActiveIndices([...activeIndices, index]);
        }
    };

    return (

        <div className={styles.main}>
            <Link href="/support" style={{ textDecoration: 'none' }}>
                <div className={styles.backLink} >‹ Support</div>
            </Link>
            <h3 className={styles.title}>Frequently Asked Questions</h3>
            <div className={styles.block}>
                {faqData.map((item, index) => (
                    <div key={index} className={styles.accordionItem}>
                        <div className={styles.accordionTitle} onClick={() => toggleAccordion(index)}>
                            <h4>{item.question}</h4>
                            <span>{activeIndices.includes(index) ? '▲' : '▼'}</span>
                        </div>
                        {activeIndices.includes(index) && <div className={styles.accordionContent}>{item.answer}</div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;