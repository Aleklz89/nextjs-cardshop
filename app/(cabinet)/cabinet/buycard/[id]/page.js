"use client";

import React, { useState, useEffect } from "react";
import styles from "./neworder.module.css";
import Link from "next/link";

function Page() {
  const [balance, setBalance] = useState(0);
  const [userId, setUserId] = useState(null);
  const [value, setValue] = useState(null);
  const [errortwo, setErrortwo] = useState("");

  const [depositAmount, setDepositAmount] = useState("");
  const [cardsQty, setCardsQty] = useState("");
  const [totalCost, setTotalCost] = useState("");

  const fetchValue = async () => {
    try {
      const response = await fetch("/api/constant");
      const data = await response.json();
      if (response.ok) {
        setValue(data.value);
      } else {
        setErrortwo(data.error || "Ошибка при получении значения");
      }
    } catch (error) {
      console.error("Ошибка при получении значения:", error);
      setErrortwo("Ошибка при получении значения");
    }
  };

  const fetchUserId = async () => {
    try {
      const response = await fetch("/api/token");
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setUserId(data.userId);
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  const fetchUserBalance = async (id) => {
    try {
      const response = await fetch(`/api/cabinet?id=${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setBalance(data.user.balance);
    } catch (error) {
      console.error("Error fetching user balance:", error);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    fetchValue();
  }, []);

  useEffect(() => {
    if (userId !== null) {
      fetchUserBalance(userId);
    }
  }, [userId]);

  // Calculate total cost
  const calculateTotalCost = (depositAmount, cardsQty) => {
    let deposit = parseFloat(depositAmount);
    let qty = parseInt(cardsQty, 10);
    if (isNaN(deposit) || deposit <= 0 || isNaN(qty) || qty <= 0) {
      return "";
    }

    let total = deposit * qty;

    if (deposit < 100) {
      total += 10 * qty;
    }

    // Add the additional percentage to the total cost
    const additionalPercentage = (parseFloat(value) + 5) / 100;
    total += total * additionalPercentage;

    return total.toFixed(2);
  };

  const handleDepositAmountChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, "");
    setDepositAmount(value);
    const total = calculateTotalCost(value, cardsQty);
    setTotalCost(total);
  };

  const handleCardsQtyChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    setCardsQty(value);
    const total = calculateTotalCost(depositAmount, value);
    setTotalCost(total);
  };

  const handleMaxButtonClick = () => {
    let maxAmount = balance;
    if (balance < 100) {
      maxAmount = Math.max(0, balance - 10);
    }
    setDepositAmount(maxAmount.toFixed(2));
    const total = calculateTotalCost(maxAmount, cardsQty);
    setTotalCost(total);
  };

  return (
    <div className={styles.main}>
      <Link href="/cabinet/buycard" style={{ textDecoration: "none" }}>
        <div className={styles.backLink}>‹ Support</div>
      </Link>

      <h3>Ordering a card</h3>
      <div className={styles.parentblock}>
        <div className={styles.innerblock}>
          <p className={styles.basetext}>Account</p>
          <div className={styles.dropdown}>
            <select className={styles.dropdown__select}>
              <option value="confirmed">Personal account - {balance}$</option>
            </select>
          </div>
          <div className={styles.inputcontainer}>
            <p className={styles.basetext}>Name of the card</p>
            <input
              className={styles.input}
              type="text"
              id="cardName"
              name="cardName"
            />
            <div className={styles.dropdowncontainer}>
              <p className={styles.basetext}>Description</p>
              <div className={styles.dropdown}>
                <input
                  className={styles.input}
                  type="text"
                  id="cardName"
                  name="cardName"
                />
              </div>
              <div className={styles.amountcontainer}>
                <p className={styles.basetext}>Deposit amount per card</p>
                <input
                  type="text"
                  id="depositAmount"
                  name="depositAmount"
                  placeholder="100"
                  value={depositAmount}
                  onChange={handleDepositAmountChange}
                />
                <button
                  type="button"
                  className={styles.maxbutton}
                  onClick={handleMaxButtonClick}
                >
                  MAX
                </button>
                <label htmlFor="cardsQty">Cards Qty</label>
                <input
                  type="text"
                  id="cardsQty"
                  name="cardsQty"
                  placeholder="1"
                  value={cardsQty}
                  onChange={handleCardsQtyChange}
                />
                <p className={styles.infotext}>
                  When replenishing the card for an amount less than $99.99, the
                  card issue will cost $9.00
                </p>
                <label htmlFor="totalCost">Total cost</label>
                <div className={styles.dropdown}>
                  <input
                    className={styles.input}
                    type="text"
                    id="totalCost"
                    name="totalCost"
                    value={totalCost}
                    readOnly
                  />
                </div>
              </div>
              <div className={styles.buttoncontainer}>
                <Link href="/cabinet/cards" style={{ textDecoration: "none" }}>
                  <button className={styles.cancelbutton}>Cancel</button>
                </Link>
                <button className={styles.issuebutton}>Issue a new card</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
