"use client"

import React, { useState } from 'react';
import styles from './newticket.module.css';
import Link from 'next/link';

const SupportTicket = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleSubjectChange = (e) => setSubject(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleSubmit = () => {
    console.log(subject, description);
  };

  return (
    <div className={styles.container}>
      <div className={styles.ticketForm}>
      <Link href="/support" style={{ textDecoration: 'none' }}>
          <div className={styles.backLink} >‹ Support</div>
        </Link>
        <h2 className={styles.title}>New Ticket</h2>
        <div className={styles.inputGroup}>
          <label htmlFor="subject">Ticket subject</label>
          <input
            id="subject"
            type="text"
            placeholder="Enter the subject of the message"
            value={subject}
            onChange={handleSubjectChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="description">Ticket description</label>
          <textarea
            id="description"
            placeholder="Enter the full text of your appeal"
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="file-upload" className={styles.customfileupload}>
            <img src="https://i.ibb.co/hftKrFz/clip-2-svgrepo-com.png" alt="Clip" /> Attach a file (maximum files: 10)
          </label>
          <input id="file-upload" type="file" style={{ display: 'none' }} multiple />

        </div>
        <button className={styles.submitButton} onClick={handleSubmit}>
          Create a ticket
        </button>
      </div>
    </div>
  );
};

export default SupportTicket;
