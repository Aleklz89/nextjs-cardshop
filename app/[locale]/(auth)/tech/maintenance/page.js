import React from 'react';
import styles from './Maintenance.module.css';
import { useTranslations } from "next-intl";

const MaintenancePage = () => {
    const translations = useTranslations();

  return (
    <div className={styles.maintenanceContainer}>
      <img src='/logo.svg' alt="Logo" className={styles.logo} />
      <h1 className={styles.title}>{translations('Maintenance.site')}</h1>
      <p className={styles.message}>{translations('Maintenance.currently')}</p>
    </div>
  );
};

export default MaintenancePage;
