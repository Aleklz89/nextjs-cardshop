import React from 'react'
import styles from './refund.module.css'
import Link from 'next/link';

function page() {
    return (
        <div className={styles.refundSearch}>
            <Link href="/support" style={{ textDecoration: 'none' }}>
                <div className={styles.backLink} >‹ Support</div>
            </Link>
            <div className={styles.refundSearchheader}>
                <h2>Refunds search</h2>
            </div>
            <div className={styles.refundSearchbody}>
                <div className={styles.refundSearchrow}>
                    <div className={styles.refundSearchfield}>
                        <label htmlFor="paymentDate">Payment date</label>
                        <input type="date" id="paymentDate" />
                    </div>
                    <div className={styles.refundSearchfield}>
                        <label htmlFor="refundDate">Refund date</label>
                        <input type="date" id="refundDate" />
                    </div>
                </div>
                <div className={styles.refundSearchrow}>
                    <div className={styles.refundSearchfield}>
                        <label htmlFor="transactionAmount">Transaction amount</label>
                        <input type="text" id="transactionAmount" placeholder="$100" />
                    </div>
                    <div className={styles.refundSearchfield}>
                        <label htmlFor="refundAmount">Refund amount</label>
                        <input type="text" id="refundAmount" placeholder="$100" />
                    </div>
                </div>
                <div className={styles.refundSearchfield}>
                    <label htmlFor="ticketDescription">Ticket description</label>
                    <textarea id="ticketDescription" placeholder="Enter the full text of your appeal"></textarea>
                </div>
                <div className={styles.refundSearchfield}>
                    <label htmlFor="file-upload" className={styles.customFileUpload}>
                        Attach a file (maximum files: 10)
                    </label>
                    <input type="file" id="file-upload" multiple style={{ display: 'none' }} />
                </div>
            </div>
            <button type="submit" className={styles.btnprimary}>Create a ticket</button>
        </div>
    )
}

export default page