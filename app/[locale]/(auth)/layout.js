import React from 'react';
import Header from '../components/header/Header';
import Sidebar from '../components/sidebar/Sidebar';
import { Roboto } from "next/font/google";
import styles from './auth.module.css'
import './globals.css'

const roboto = Roboto({
  subsets: ["latin"],
  weight: '400'
});

export const metadata = {
  title: "CardShop",
  description: "Made with next",
  icon: '/icon.png'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en"  className={styles.html}>
      <body className={styles.body}>
        <div style={{ display: 'flex' }}>
          <div className="container">{children}</div>
        </div>
      </body>
    </html>
  );
}


