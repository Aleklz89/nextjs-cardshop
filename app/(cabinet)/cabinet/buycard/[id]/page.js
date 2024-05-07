"use client";

import React, { useState, useEffect } from "react";
import styles from "./neworder.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Page() {
    const router = useRouter();
    const [balance, setBalance] = useState(0);
    const [userId, setUserId] = useState(null);
    const [value, setValue] = useState(null);
    const [constant, setConstant] = useState(null);
    const [errortwo, setErrortwo] = useState("");

    const [depositAmount, setDepositAmount] = useState("");
    const [cardsQty, setCardsQty] = useState("");
    const [totalCost, setTotalCost] = useState("");
    const [cardName, setCardName] = useState("");
    const [description, setDescription] = useState("");

    // Fetch the current value from /api/local
    const fetchValue = async () => {
        try {
            const response = await fetch("/api/local");
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

    // Fetch the constant from /constant
    const fetchConstant = async () => {
        try {
            const response = await fetch("/api/constant");
            const data = await response.json();
            if (response.ok) {
                setConstant(parseFloat(data.value) || 0);
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
        fetchConstant();
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
        const additionalPercentage = ((parseFloat(value) || 0) + (parseFloat(constant) || 0) + 5) / 100;
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

    const handleCardNameChange = (e) => {
        setCardName(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
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

    // Fetch bin by URL ID
    const fetchBinById = async (id) => {
        try {
            const response = await fetch("https://api.epn.net/card-bins", {
                headers: {
                    accept: "application/json",
                    Authorization: "Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ",
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
            const response = await fetch("/api/local", {
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
        const urlSegments = window.location.pathname.split("/");
        const binId = urlSegments[urlSegments.length - 1];

        if (!depositAmount || !cardsQty || !cardName || !description) {
            setErrortwo("Fill in all the fields");
            return;
        }

        if (parseFloat(totalCost) > parseFloat(balance)) {
            setErrortwo("Insufficient funds");
            return;
        }

        const bin = await fetchBinById(binId);

        if (!bin) {
            setErrortwo("Unable to fetch BIN");
            return;
        }

        const postData = {
            account_uuid: "dd89adb8-3710-4f25-aefd-d7116eb66b6b", // Fixed UUID as provided
            start_balance: parseFloat(depositAmount),
            description: description,
            bin: bin,
            cards_count: parseInt(cardsQty, 10),
            external_id: value.toString(),
        };

        try {
            // First POST request to buy the card
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
                console.error(
                    `Error buying card: ${buyResponse.status} - ${buyResponse.statusText}`,
                    errorData
                );
                throw new Error(`Error buying card: ${buyResponse.status}`);
            }

            const addResponse = await fetch("/api/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, external_id: value.toString() }),
            });

            if (!addResponse.ok) {
                const errorData = await addResponse.json();
                console.error(
                    `Error adding card ID: ${addResponse.status} - ${addResponse.statusText}`,
                    errorData
                );
                throw new Error(`Error adding card ID: ${addResponse.status}`);
            }

            // Update balance after the transaction
            const updatedBalance = parseFloat(balance) - parseFloat(totalCost);
            const updateBalanceResponse = await fetch("/api/min", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, balance: updatedBalance.toFixed(2) }),
            });

            if (!updateBalanceResponse.ok) {
                const errorData = await updateBalanceResponse.json();
                console.error(
                    `Error updating balance: ${updateBalanceResponse.status} - ${updateBalanceResponse.statusText}`,
                    errorData
                );
                throw new Error(`Error updating balance: ${updateBalanceResponse.status}`);
            }

            // Increment the value by 1
            await updateExternalId(value + 1);

            // Navigate back to the cards page
            router.push("/cabinet/cards");
        } catch (error) {
            console.error("Error issuing card:", error);
            setErrortwo("Error buying card");
        }
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
                            value={cardName}
                            onChange={handleCardNameChange}
                        />
                        <div className={styles.dropdowncontainer}>
                            <p className={styles.basetext}>Description</p>
                            <div className={styles.dropdown}>
                                <input
                                    className={styles.input}
                                    type="text"
                                    id="description"
                                    name="description"
                                    value={description}
                                    onChange={handleDescriptionChange}
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
                                <button
                                    className={styles.issuebutton}
                                    onClick={handleIssueCard}
                                >
                                    Issue a new card
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