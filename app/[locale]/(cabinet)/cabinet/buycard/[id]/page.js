"use client";

import React, { useState, useEffect } from "react";
import styles from "./neworder.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import "../../globals.css";

function Page() {
  const translations = useTranslations();
  const router = useRouter();
  const [balance, setBalance] = useState(null); 
  const [userId, setUserId] = useState(null);
  const [value, setValue] = useState(null);
  const [constant, setConstant] = useState(null);
  const [errortwo, setErrortwo] = useState("");
  const [isIssuing, setIsIssuing] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true); 

  const [depositAmount, setDepositAmount] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [description, setDescription] = useState("");


  const fetchValue = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + "/api/local");
      const data = await response.json();
      if (response.ok) {
        setValue(data.value);
      } else {
        setErrortwo(data.error || "Error fetching value");
      }
    } catch (error) {
      console.error("Error fetching value:", error);
      setErrortwo("Error fetching value");
    }
  };

  const fetchConstant = async (id) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + `/api/constant?id=${id}`);
      const data = await response.json();
      if (response.ok) {
        setConstant(parseFloat(data.markup) || 0);
      } else {
        setErrortwo(data.error || "Error fetching constant");
      }
    } catch (error) {
      console.error("Error fetching constant:", error);
      setErrortwo("Error fetching constant");
    }
  };

  const fetchUserId = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + "/api/token");
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
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + `/api/cabinet?id=${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setBalance(data.user.balance);
    } catch (error) {
      console.error("Error fetching user balance:", error);
      setBalance(null);
    } finally {
      setIsLoadingBalance(false); 
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
      fetchConstant(userId);
    }
  }, [userId]);

  const calculateTotalCost = (depositAmount) => {
    let deposit = parseFloat(depositAmount);
    let qty = 1;
    if (isNaN(deposit) || deposit <= 0) {
      return "";
    }

    let total = deposit * qty;


    const count = total - constant;

    console.log(`${count} = ${total} - ${constant}`);

    if (count <= 0)  {
      total = 1;
    } else {
      total -= constant;
    }

    return total.toFixed(2);
  };

  const handleDepositAmountChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, "");
    setDepositAmount(value);
    const total = calculateTotalCost(value);
    setTotalCost(total);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleMaxButtonClick = () => {
    let maxAmount = balance;
    if (balance < 100) {
      maxAmount = Math.max(0, balance);
    }
    setDepositAmount(maxAmount.toFixed(2));
    const total = calculateTotalCost(maxAmount);
    setTotalCost(total);
  };

  const fetchBinById = async (id) => {
    try {
      const response = await fetch("https://api.epn.net/card-bins", {
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ",
        },
      });
      const data = await response.json();
      const binEntry = data.data.find((item) => item.id === parseInt(id));
      return binEntry ? binEntry.bin : null;
    } catch (error) {
      console.error("Error fetching bin:", error);
      return null;
    }
  };

  const updateExternalId = async (newValue) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + "/api/local", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: newValue }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error updating value: ${response.status}`, errorData);
        throw new Error(`Error updating value: ${response.status}`);
      }

      setValue(newValue);
    } catch (error) {
      console.error("Error updating value:", error);
      setErrortwo("Error updating external value");
    }
  };

  const handleIssueCard = async () => {
    setIsIssuing(true);
  
    const urlSegments = window.location.pathname.split("/");
    const binId = urlSegments[urlSegments.length - 1];
  
    if (!depositAmount || !description) {
      setErrortwo(translations('BuyCardId.fill'));
      setIsIssuing(false);
      return;
    }
  
    if (parseFloat(totalCost) > parseFloat(balance)) {
      setErrortwo(translations('BuyCardId.funds'));
      setIsIssuing(false);
      return;
    }
  
    const bin = await fetchBinById(binId);
    if (!bin) {
      setErrortwo("Unable to fetch BIN");
      setIsIssuing(false);
      return;
    }
  
    const postData = {
      account_uuid: "dd89adb8-3710-4f25-aefd-d7116eb66b6b",
      start_balance: parseFloat(depositAmount),
      description: description,
      bin: bin,
      cards_count: 1,
      external_id: value.toString(),
    };
  
    try {
      const buyResponse = await fetch("https://api.epn.net/card/buy", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ",
          "X-CSRF-TOKEN": "",
        },
        body: JSON.stringify(postData),
      });
  
      if (!buyResponse.ok) {
        const errorData = await buyResponse.json();
        console.error(`Error buying card: ${buyResponse.status} - ${buyResponse.statusText}`, errorData);
        throw new Error(`Error buying card: ${buyResponse.status}`);
      }

      const updateUserResponse = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + "/api/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, cardUuid: value.toString() }),
      });
  
      if (!updateUserResponse.ok) {
        const errorData = await updateUserResponse.json();
        console.error(`Error updating user: ${updateUserResponse.status} - ${updateUserResponse.statusText}`, errorData);
        throw new Error(`Error updating user: ${updateUserResponse.status}`);
      }
  
      const updatedBalance = parseFloat(balance) - parseFloat(totalCost);
      const updateBalanceResponse = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + "/api/min", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, balance: updatedBalance.toFixed(2) }),
      });
  
      if (!updateBalanceResponse.ok) {
        const errorData = await updateBalanceResponse.json();
        console.error(`Error updating balance: ${updateBalanceResponse.status} - ${updateBalanceResponse.statusText}`, errorData);
        throw new Error(`Error updating balance: ${updateBalanceResponse.status}`);
      }
  
      const transactionResponse = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + '/api/newtrans', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          type: 'purchase', 
          description: 'Card purchase',
          amount: -parseFloat(totalCost) 
        }),
      });
  
      if (!transactionResponse.ok) {
        const errorData = await transactionResponse.json();
        console.error(`Error logging transaction: ${transactionResponse.status}`, errorData);
        throw new Error(`Error logging transaction: ${transactionResponse.status}`);
      }

     
      const cardTransactionResponse = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + '/api/cardtrans', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardId: value.toString(),
          amount: parseFloat(depositAmount)
        }),
      });
  
      if (!cardTransactionResponse.ok) {
        const errorData = await cardTransactionResponse.json();
        console.error(`Error logging card transaction: ${cardTransactionResponse.status}`, errorData);
        throw new Error(`Error logging card transaction: ${cardTransactionResponse.status}`);
      }

      await updateExternalId(value + 1);
  
      setTimeout(() => {
        setIsIssuing(false);
        router.push("/cabinet/cards");
      }, 10000);
    } catch (error) {
      setIsIssuing(false);
      console.error("Error issuing card:", error);
      setErrortwo(translations('BuyCardId.error'));
    }
  };
  
  const accountText = translations('BuyCardId.loading');
  const balanceText = translations('BuyCardId.personal');

  return (
    <div className={styles.main}>
      <Link href="/cabinet/buycard" style={{ textDecoration: "none" }}>
        <div className={styles.backLink}>‹ {translations('BuyCardId.market')}</div>
      </Link>

      <h3>{translations('BuyCardId.order')}</h3>
      <div className={styles.parentblock}>
        <div className={styles.innerblock}>
          <p className={styles.basetext}>{translations('BuyCardId.account')}</p>
          <div className={styles.dropdown}>
            <select className={styles.dropdown__select}>
              <option value="confirmed">
                {isLoadingBalance
                  ? `${accountText}`
                  : `${balanceText} - ${balance}$`}
              </option>
            </select>
          </div>
          <div className={styles.inputcontainer}>
            <p className={styles.basetext}>{translations('BuyCardId.name')}</p>
            <input
              className={styles.input}
              type="text"
              id="description"
              name="description"
              value={description}
              onChange={handleDescriptionChange}
            />
            <div className={styles.dropdowncontainer}>
              <div className={styles.amountcontainer}>
                <p className={styles.basetext}>{translations('BuyCardId.deposit')}</p>
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
                  {translations('BuyCardId.max')}
                </button>
                
                <label htmlFor="totalCost">{translations('BuyCardId.total')}</label>
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
                  <button className={styles.cancelbutton}>{translations('BuyCardId.cancel')}</button>
                </Link>
                <button
                  className={styles.issuebutton}
                  onClick={handleIssueCard}
                  disabled={isIssuing}
                >
                  {isIssuing ? (
                    <div className={styles.loader}></div>
                  ) : (
                    `${translations('BuyCardId.issue')}`
                  )}
                </button>
              </div>
              {errortwo && <p className={styles.error}>{errortwo}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
