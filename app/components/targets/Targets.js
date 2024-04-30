import React from 'react';
import styles from './Targets.module.css';

const Targets = () => {
  const levels = [
    { name: '1', terms: 'Upon registration', minCommission: '5%', cardIssue: '$9', declinePrice: '$0.50' },
    { name: '2', terms: '$1 000 + KYC', minCommission: '4.5%', cardIssue: '$7', declinePrice: '$0.40' },
    { name: '3', terms: '$5 000 + TG', minCommission: '4%', cardIssue: '$5', declinePrice: '$0.30' },
    { name: '4', terms: '$10 000', minCommission: '3%', cardIssue: '$3', declinePrice: '$0.30' },
    { name: '5', terms: '$50 000', minCommission: '2.5%', cardIssue: '$2', declinePrice: '$0.20' },
  ];

  return (
    <div className={styles.tablecontainer}>
      <table className={styles.targetable}>
        <thead className={styles.tableHeader}>
          <tr>
            <th>Level</th>
            <th>Terms</th>
            <th>Min. Commission</th>
            <th>Card Issue</th>
            <th>Decline Price</th>
          </tr>
        </thead>
        <tbody>
          {levels.map((level, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 ? '#f9f9f9' : 'white' }}>
              <td>{level.name}</td>
              <td>{level.terms}</td>
              <td>{level.minCommission}</td>
              <td>{level.cardIssue}</td>
              <td>{level.declinePrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Targets;
