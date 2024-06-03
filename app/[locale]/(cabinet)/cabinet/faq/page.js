"use client"

import styles from './faq.module.css';
import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from "next-intl"
import '../globals.css'


const FAQ = () => {

    const translations = useTranslations()

const faqData = [
    {
        question: `${translations('FAQ.terms')}`,
        answer: `${translations('FAQ.transfer')}`,
    },
    {
        question: `${translations('FAQ.support')}`,
        answer: `${translations('FAQ.personal')}`,
    },
    {
        question: `${translations('FAQ.bin')}`,
        answer: `${translations('FAQ.bank')}`,
    },
    {
        question: `${translations('FAQ.account')}`,
        answer: `${translations('FAQ.verification')}`,
    },
    {
        question: `${translations('FAQ.possible')}`,
        answer: `${translations('FAQ.service')}`,
    },
    {
        question: `${translations('FAQ.level')}`,
        answer: `${translations('FAQ.cards')}`,
    },
    {
        question: `${translations('FAQ.view')}`,
        answer: `${translations('FAQ.history')}`,
    },
    {
        question: `${translations('FAQ.topup')}`,
        answer: `${translations('FAQ.section')}`,
    },
    {
        question: `${translations('FAQ.forget')}`,
        answer: `${translations('FAQ.case')}`,
    },
    {
        question: `${translations('FAQ.time')}`,
        answer: `${translations('FAQ.when')}`,
    },
    {
        question: `${translations('FAQ.order')}`,
        answer: `${translations('FAQ.choose')}`,
    },
];
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
            <Link href="/cabinet/support" style={{ textDecoration: 'none' }}>
                <div className={styles.backLink} >‹ {translations('FAQ.back')}</div>
            </Link>
            <h3 className={styles.title}>{translations('FAQ.question')}</h3>
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