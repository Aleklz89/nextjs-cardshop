import React from 'react'
import styles from './neworder.module.css'
import Link from 'next/link';


function page() {
    return (
        <div className={styles.main}>
            <Link href="/buycard" style={{ textDecoration: 'none' }}>
                <div className={styles.backLink} >‹ Support</div>
            </Link>

            <h3>Ordering a card</h3>
            <div className={styles.parentblock}>
                <div className={styles.innerblock}>
                    <p className={styles.basetext}>Account</p>
                    <div className={styles.dropdown}>
                        <select className={styles.dropdown__select}>
                            <option value="">Personal account</option>
                            <option value="confirmed">Personal account - 9.60$</option>
                        </select>
                    </div>
                    <div className={styles.inputcontainer}>
                        <p className={styles.basetext}>Name of the card</p>
                        <input className={styles.input} type="text" id="cardName" name="cardName" value="Advertise 11.04.2024, 00:09" />
                        <div className={styles.dropdowncontainer}>

                            <p className={styles.basetext}>Tags for the card</p>
                            <div className={styles.dropdown}>
                                <select id="cardTags" name="cardTags">
                                    <option value="">Create tags for card</option>
                                </select>
                                <button className={styles.applybutton}>Apply</button>
                            </div>
                            <div className={styles.amountcontainer}>
                                <p className={styles.basetext}>Deposit amount per card</p>
                                <input type="number" id="depositAmount" name="depositAmount" placeholder="9" />
                                <button type="button" className={styles.maxbutton}>MAX</button>
                                <label for="cardsQty">Cards Qty</label>
                                <input type="number" id="cardsQty" name="cardsQty" placeholder="1" />
                                <p className={styles.infotext}>When replenishing the card for an amount less than $99.99, the card issue will cost $9.00</p>
                            </div>
                            <div className={styles.buttoncontainer}>
                                <button className={styles.cancelbutton}>Cancel</button>
                                <button className={styles.issuebutton}>Issue a new card</button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default page