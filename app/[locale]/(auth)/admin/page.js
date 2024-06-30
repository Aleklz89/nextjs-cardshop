"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './Table.module.css';
import './globals.css';

function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [dataTwo, setDataTwo] = useState([]);
  const [filteredDataTwo, setFilteredDataTwo] = useState([]);
  const [sortOrderTwo, setSortOrderTwo] = useState("asc");
  const [sortOrderUpdated, setSortOrderUpdated] = useState("asc");
  const [searchTermTwo, setSearchTermTwo] = useState("");
  const [loadingReject, setLoadingReject] = useState(null);
  const [loadingAccept, setLoadingAccept] = useState(null);
  const [editableBalances, setEditableBalances] = useState({});
  const [originalBalances, setOriginalBalances] = useState({});
  const fetchInterval = useRef(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [originalValue, setOriginalValue] = useState('');
  const [errortwo, setErrortwo] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRejectBalance, setLoadingRejectBalance] = useState(null);
  const [loadingAcceptBalance, setLoadingAcceptBalance] = useState(null);
  const [editableMarkups, setEditableMarkups] = useState({});
  const [showMaintenancePopup, setShowMaintenancePopup] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  const handlePasswordChangeClick = (userId) => {
    setCurrentUserId(userId);
    setShowPasswordPopup(true);
  };

  const handleClosePasswordPopup = () => {
    setShowPasswordPopup(false);
    setNewPassword('');
    setPasswordError('');
  };

  const handleConfirmPasswordChange = async () => {
    if (!newPassword) {
      setPasswordError('Пароль не може бути порожнім');
      return;
    }

    try {
      const response = await fetch('/api/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, password: newPassword }),
      });

      if (response.ok) {
        setShowPasswordPopup(false);
        setNewPassword('');
        setPasswordError('');
      } else {
        const data = await response.json();
        setPasswordError(data.error || 'Помилка при зміні пароля');
      }
    } catch (error) {
      console.error('Помилка при зміні пароля:', error);
      setPasswordError('Помилка при зміні пароля');
    }
  };

  const toggleMaintenanceMode = async () => {
    console.log('Toggling maintenance mode. Current mode:', isMaintenanceMode);
    try {
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enable: !isMaintenanceMode }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Maintenance mode toggled successfully:', data);
        setIsMaintenanceMode(data.enable);
      } else {
        console.error('Помилка при переключенні режиму техобслуговування');
      }
    } catch (error) {
      console.error('Помилка при переключенні режиму техобслуговування:', error);
    }
  };

  const handleMaintenanceClick = () => {
    setShowMaintenancePopup(true);
  };

  const handleConfirmMaintenance = async () => {
    console.log('Confirming maintenance mode toggle');
    await toggleMaintenanceMode();
    setShowMaintenancePopup(false);
  };

  const handleCloseMaintenancePopup = () => {
    setShowMaintenancePopup(false);
  };

  const fetchValue = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + "/api/constant");
      const data = await response.json();
      if (response.ok) {
        setValue(data.value);
        setOriginalValue(data.value);
        setInputValue(data.value);
      } else {
        setErrortwo(data.error || 'Помилка при отриманні значення');
      }
    } catch (error) {
      console.error('Помилка при отриманні значення:', error);
      setErrortwo('Помилка при отриманні значення');
    }
  };

  const updateValue = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + '/api/constant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: parseFloat(inputValue) }),
      });
      const data = await response.json();
      if (response.ok) {
        setValue(data.value);
        setOriginalValue(data.value);
      } else {
        setErrortwo(data.error || 'Помилка при оновленні значення');
      }
    } catch (error) {
      console.error('Помилка при оновленні значення:', error);
      setErrortwo('Помилка при оновленні значення');
    }
  };

  const rejectChange = () => {
    setInputValue(originalValue);
  };

  useEffect(() => {
    fetchValue();
  }, []);

  const fetchAccountData = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + '/api/total');
      const data = await response.json();
      if (response.ok) {
        if (data.data && data.data.length > 0) {
          setBalance(data.data[0].balance);
        } else {
          setError('No account data found');
        }
      } else {
        setError(data.error || 'Error fetching account data');
      }
    } catch (error) {
      console.error('Error fetching account data:', error);
      setError('Error fetching account data');
    }
  };

  const sortData = (incomingData, order) => {
    return incomingData.applications.sort((a, b) => {
      const dateA = new Date(a.submissionTime);
      const dateB = new Date(b.submissionTime);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  const sortDatatwo = (incomingData, order) => {
    const users = incomingData.users;
    return users;
  };

  const sortDatathree = (incomingData, order) => {
    return incomingData.sort((a, b) => {
      const dateA = new Date(a.updatedAt);
      const dateB = new Date(b.updatedAt);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  const fetchData = async () => {
    const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + "/api/request");
    if (response.ok) {
      const applications = await response.json();
      let sortedData = sortData(applications, sortOrder);

      if (searchTerm) {
        sortedData = sortedData.filter((item) =>
          item.email.toLowerCase().includes(searchTerm) ||
          item.password.toLowerCase().includes(searchTerm) ||
          formatDate(item.submissionTime).includes(searchTerm)
        );
      }

      setData(sortedData);
      setFilteredData(sortedData);
      setLoadingRequests(false);
    } else {
      console.error("Не вдалося завантажити дані");
    }
  };

  const fetchDataTwo = async () => {
    const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + "/api/user");
    if (response.ok) {
      const users = await response.json();
      setDataTwo(users.users);

      const balances = {};
      users.users.forEach((item) => {
        balances[item.id] = item.balance;
      });
      setOriginalBalances(balances);

      applyFiltersAndSortTwo(users);
      setLoadingUsers(false);
    } else {
      console.error("Не вдалося завантажити дані для другої таблиці");
    }
  };

  useEffect(() => {
    setMounted(true);
    checkMaintenanceMode();
  }, []);

  const checkMaintenanceMode = async () => {
    try {
      console.log('Checking maintenance mode');
      const response = await fetch('/api/status');
      const data = await response.json();
      console.log('Maintenance mode status:', data.maintenanceMode);
      setIsMaintenanceMode(data.maintenanceMode);
    } catch (error) {
      console.error('Помилка при перевірці режиму техобслуговування:', error);
    }
  };

  useEffect(() => {
    fetchAccountData();
    fetchData();
    fetchDataTwo();
    fetchInterval.current = setInterval(() => {
      fetchAccountData();
      fetchData();
      fetchDataTwo();
    }, 2500);
    return () => clearInterval(fetchInterval.current);
  }, []);

  useEffect(() => {
    applyFiltersAndSortTwo(dataTwo);
  }, [sortOrderTwo, sortOrderUpdated, searchTermTwo]);

  useEffect(() => {
    fetchData();
  }, [sortOrder, searchTerm]);

  const applyFiltersAndSortTwo = (incomingData) => {
    let filteredData = incomingData;

    if (searchTermTwo) {
      filteredData = filteredData.filter((item) =>
        item.email.toLowerCase().includes(searchTermTwo) ||
        formatDate(item.createdAt).includes(searchTermTwo) ||
        formatDate(item.updatedAt).includes(searchTermTwo)
      );
    }

    if (sortOrderUpdated !== "asc") {
      filteredData = sortDatathree(filteredData, sortOrderUpdated);
    } else {
      filteredData = sortDatatwo(filteredData, sortOrder);
    }

    setFilteredDataTwo(filteredData);
  };

  const handleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    const sortedData = sortData(data, newOrder);
    setData(sortedData);
    setFilteredData(sortedData);
  };

  const handleSortTwo = () => {
    const newOrder = sortOrderTwo === "asc" ? "desc" : "asc";
    setSortOrderTwo(newOrder);
  };

  const handleSortThree = () => {
    const newOrder = sortOrderUpdated === "asc" ? "desc" : "asc";
    setSortOrderUpdated(newOrder);
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
  };

  const handleSearchTwo = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTermTwo(value);
  };

  const handleReject = async (id) => {
    setLoadingReject(id);
    clearInterval(fetchInterval.current);
    const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + `/api/decline?id=${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      const newData = data.filter((item) => item.id !== id);
      setData(newData);
      setFilteredData(newData);
    } else {
      console.error("Помилка при відхиленні заявки");
    }

    setTimeout(() => {
      setLoadingReject(null);
    }, 10000);
  };

  const handleAccept = async (id, email, password, telegram) => {
    setLoadingAccept(id);
    const deleteResponse = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + `/api/decline?id=${id}`, {
      method: "DELETE",
    });
    if (deleteResponse.ok) {
      const addUserResponse = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + "/api/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, telegram }),
      });

      if (addUserResponse.ok) {
        const newData = data.filter((item) => item.id !== id);
        setData(newData);
        setFilteredData(newData);
      } else {
        console.error("Помилка при додаванні користувача");
      }
    } else {
      console.error("Помилка при видаленні заявки");
    }

    setTimeout(() => {
      setLoadingAccept(null);
    }, 10000);
  };

  const handleBalanceChange = (e, id) => {
    const newBalance = parseFloat(e.target.value);
    setEditableBalances((prevBalances) => ({
      ...prevBalances,
      [id]: newBalance,
    }));
  };

  const handleMarkupChange = (e, id) => {
    const newMarkup = parseFloat(e.target.value);
    setEditableMarkups((prevMarkups) => ({
      ...prevMarkups,
      [id]: newMarkup,
    }));
  };

  const handleStatusChange = (e, id) => {
    const newStatus = e.target.value;
    setDataTwo((prevDataTwo) =>
      prevDataTwo.map((user) =>
        user.id === id ? { ...user, status: newStatus } : user
      )
    );
    setFilteredDataTwo((prevFilteredDataTwo) =>
      prevFilteredDataTwo.map((user) =>
        user.id === id ? { ...user, status: newStatus } : user
      )
    );
    handleStatusChangeSubmit(id, newStatus);
  };

  const handleRejectBalanceChange = (id) => {
    setLoadingRejectBalance(id);
    setEditableBalances((prevBalances) => ({
      ...prevBalances,
      [id]: originalBalances[id],
    }));
    setTimeout(() => {
      setLoadingRejectBalance(null);
    }, 5000);
  };

  const handleAcceptBalanceChange = async (id) => {
    setLoadingAcceptBalance(id);
    const newBalance = Number(editableBalances[id]);
    const newMarkup = Number(editableMarkups[id]);
    const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + `/api/user`);
    const usersData = await response.json();
    const user = usersData.users.find((item) => item.id === id);
    const currentBalance = Number(user.balance);
    const currentMarkup = Number(user.markup);
    const balanceChange = newBalance - currentBalance;
    const markupChange = newMarkup !== currentMarkup;
    const totalUserBalance = Object.values({ ...originalBalances, [id]: newBalance })
      .reduce((acc, curr) => acc + Number(curr), 0);
    const requiredBalance = parseFloat(balance) + (parseFloat(balance) * (parseFloat(value) / 100));

    if ((totalUserBalance - 1) > requiredBalance) {
      setShowPopup(true);
      setLoadingAcceptBalance(null);
      return;
    }
    if (balanceChange) {
      const updateResponse = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + `/api/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, balance: newBalance }),
      });

      if (updateResponse.ok) {
        const transactionResponse = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + '/api/newtrans', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: id,
            type: 'deposit',
            description: 'Debited from Main account',
            amount: balanceChange,
          }),
        });
      } else {
        console.error('Помилка при оновленні балансу');
      }
    }

    if (markupChange) {
      const updateMarkupResponse = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + `/api/markup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, markup: newMarkup }),
      });

      if (!updateMarkupResponse.ok) {
        console.error('Помилка при оновленні markup');
      }
    }
    setTimeout(() => {
      setLoadingAcceptBalance(null);
    }, 5000);
  };

  const handleStatusChangeSubmit = async (id, newStatus) => {
    try {
      const response = await fetch('/api/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!response.ok) {
        console.error('Помилка при оновленні статусу');
      }
    } catch (error) {
      console.error('Помилка при оновленні статусу:', error);
    }
  };

  function formatDate(isoString) {
    const date = new Date(isoString);
    date.setHours(date.getHours() + 0);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate();
    const months = [
      "січня",
      "лютого",
      "березня",
      "квітня",
      "травня",
      "червня",
      "липня",
      "серпня",
      "вересня",
      "жовтня",
      "листопада",
      "грудня",
    ];
    const month = months[date.getMonth()];
    return `${hours}:${minutes}, ${day} ${month}`;
  }

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  if (!mounted) return null;

  return (
    <div className={styles.patron}>
      <header className={styles.header}>
        <div className={styles.logo}>CVV888</div>
        <div className={styles.parent}>
          <h3>Поточний баланс:</h3>
          {balance !== null ? (
            <h3 className={styles.sum}>{balance} $</h3>
          ) : (
            <p className={styles.load}>{error || 'Завантаження даних...'}</p>
          )}
        </div>
        <button
          className={isMaintenanceMode ? styles.maintenanceButtonActive : styles.maintenanceButton}
          onClick={handleMaintenanceClick}
        >
          {isMaintenanceMode ? 'Режим техобслуговування' : 'Звичайний режим'}
        </button>
      </header>
      <div className={styles.scale}>
        <div className={styles.mainblock}>
          <h2>Запити на реєстрацію</h2>
          <div className={styles.scrollabletable}>
            {loadingRequests ? (
              <div className={styles.loaderContainer}>
                <div className={styles.loader}></div>
                <p>Завантаження даних...</p>
              </div>
            ) : filteredData.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Час</th>
                    <th>Пошта</th>
                    <th>Телеграм</th>
                    <th>Команда</th>
                    <th>Статус</th>
                    <th>Відхилити</th>
                    <th>Підтвердити</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice().reverse().map((item) => (
                    <tr key={item.id}>
                      <td>{formatDate(item.submissionTime)}</td>
                      <td>{item.email}</td>
                      <td>
                        <a href={`https://t.me/${item.telegram}`} target="_blank" rel="noopener noreferrer" className={styles.telegramlink}>
                          @{item.telegram}
                        </a>
                      </td>
                      <td>{item.team}</td>
                      <td>{item.status}</td>
                      <td>
                        <button
                          onClick={() => handleReject(item.id)}
                          className={styles.btnreject}
                          disabled={loadingReject === item.id}
                        >
                          {loadingReject === item.id ? (
                            <div className={styles.btnLoading}></div>
                          ) : (
                            'Відхилити'
                          )}
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => handleAccept(item.id, item.email, item.password, item.telegram)}
                          className={styles.btnconfirm}
                          disabled={loadingAccept === item.id}
                        >
                          {loadingAccept === item.id ? (
                            <div className={styles.btnLoading}></div>
                          ) : (
                            'Підтвердити'
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Час</th>
                      <th>Пошта</th>
                      <th>Телеграм</th>
                      <th>Команда</th>
                      <th>Статус</th>
                      <th>Відхилити</th>
                      <th>Підтвердити</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.slice().reverse().map((item) => (
                      <tr key={item.id}>
                        <td>{formatDate(item.submissionTime)}</td>
                        <td>{item.email}</td>
                        <td>
                          <a href={`https://t.me/${item.telegram}`} target="_blank" rel="noopener noreferrer" className={styles.telegramlink}>
                            @{item.telegram}
                          </a>
                        </td>
                        <td>{item.team}</td>
                        <td>{item.status}</td>
                        <td>
                          <button onClick={() => handleReject(item.id)} className={styles.btnreject}>
                            Відхилити
                          </button>
                        </td>
                        <td>
                          <button onClick={() => handleAccept(item.id, item.email, item.password, item.telegram)} className={styles.btnconfirm}>
                            Підтвердити
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.noData}>
                  Запитів на реєстрацію немає
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.mainblocktwo}>
          <h2>Користувачі</h2>
          <div className={styles.scrollabletable}>
            {loadingUsers ? (
              <div className={styles.loaderContainer}>
                <div className={styles.loader}></div>
                <p>Завантаження даних...</p>
              </div>
            ) : dataTwo.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Зареєструвався</th>
                    <th>Остання зміна балансу/націнки</th>
                    <th>Пошта</th>
                    <th>Баланс</th>
                    <th>Телеграм</th>
                    <th>Команда</th>
                    <th>Статус</th>
                    <th>Націнка</th>
                    <th>Відхилити</th>
                    <th>Підтвердити</th>
                    <th>Змінити пароль</th>
                  </tr>
                </thead>
                <tbody>
                  {dataTwo.slice().reverse().map((item) => (
                    <tr key={item.id}>
                      <td>{formatDate(item.createdAt)}</td>
                      <td>{item.createdAt === item.updatedAt ? 'Ніколи не поповнював' : formatDate(item.updatedAt)}</td>
                      <td>{item.email}</td>
                      <td>
                        <input
                          type="number"
                          value={editableBalances[item.id] !== undefined ? editableBalances[item.id] : item.balance}
                          onChange={(e) => handleBalanceChange(e, item.id)}
                          className={styles.balanceInput}
                        /> $
                      </td>
                      <td>
                        <a href={`https://t.me/${item.telegram}`} target="_blank" rel="noopener noreferrer" className={styles.telegramlink}>
                          @{item.telegram}
                        </a>
                      </td>
                      <td>{item.team}</td>
                      <td>
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(e, item.id)}
                        >
                          <option value="buyer">buyer</option>
                          <option value="owner">owner</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editableMarkups[item.id] !== undefined ? editableMarkups[item.id] : item.markup}
                          onChange={(e) => handleMarkupChange(e, item.id)}
                          className={styles.balanceInput}
                        />
                        <span className={styles.percentSign}>$</span>
                      </td>
                      <td>
                        <button onClick={() => handleRejectBalanceChange(item.id)} className={styles.btnreject}>
                          {loadingRejectBalance === item.id ? (<div className={styles.loader}></div>) : ('Відхилити')}
                        </button>
                      </td>
                      <td>
                        <button onClick={() => handleAcceptBalanceChange(item.id)} className={styles.btnconfirm}>
                          {loadingAcceptBalance === item.id ? (<div className={styles.loader}></div>) : ('Підтвердити')}
                        </button>
                      </td>
                      <td>
                        <button onClick={() => handlePasswordChangeClick(item.id)} className={styles.btnchange}>
                          Змінити пароль
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Зареєструвався</th>
                      <th>Остання зміна балансу/націнки</th>
                      <th>Пошта</th>
                      <th>Баланс</th>
                      <th>Телеграм</th>
                      <th>Команда</th>
                      <th>Статус</th>
                      <th>Націнка</th>
                      <th>Відхилити</th>
                      <th>Підтвердити</th>
                      <th>Змінити пароль</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataTwo.slice().reverse().map((item) => (
                      <tr key={item.id}>
                        <td>{formatDate(item.createdAt)}</td>
                        <td>{item.createdAt === item.updatedAt ? 'Ніколи не поповнював' : formatDate(item.updatedAt)}</td>
                        <td>{item.email}</td>
                        <td>
                          <input
                            type="number"
                            value={editableBalances[item.id] !== undefined ? editableBalances[item.id] : item.balance}
                            onChange={(e) => handleBalanceChange(e, item.id)}
                            className={styles.balanceInput}
                          /> $
                        </td>
                        <td>
                          <a href={`https://t.me/${item.telegram}`} target="_blank" rel="noopener noreferrer" className={styles.telegramlink}>
                            @{item.telegram}
                          </a>
                        </td>
                        <td>
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusChange(e, item.id)}
                          >
                            <option value="buyer">buyer</option>
                            <option value="owner">owner</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            value={editableMarkups[item.id] !== undefined ? editableMarkups[item.id] : item.markup}
                            onChange={(e) => handleMarkupChange(e, item.id)}
                            className={styles.balanceInput}
                          />
                          <span className={styles.percentSign}>$</span>
                        </td>
                        <td>
                          <button onClick={() => handleRejectBalanceChange(item.id)} className={styles.btnreject}>
                            {loadingRejectBalance === item.id ? (<div className={styles.loader}></div>) : ('Відхилити')}
                          </button>
                        </td>
                        <td>
                          <button onClick={() => handleAcceptBalanceChange(item.id)} className={styles.btnconfirm}>
                            {loadingAcceptBalance === item.id ? (<div className={styles.loader}></div>) : ('Підтвердити')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.noData}>
                  Користувачів немає
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h3>Недостатньо коштів на основному акаунті</h3>
            <button className={styles.popupButton} onClick={handleClosePopup}>OK</button>
          </div>
        </div>
      )}
      {showMaintenancePopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h3>{isMaintenanceMode ? 'Вимкнути режим технічних робіт?' : 'Увімкнути режим технічних робіт?'}</h3>
            <button className={styles.popupButton} onClick={handleConfirmMaintenance}>Так</button>
            <button className={styles.popupButton} onClick={handleCloseMaintenancePopup}>Ні</button>
          </div>
        </div>
      )}
      {showPasswordPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h3>Введіть новий пароль</h3>
            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.passwordInput}
            />
            {passwordError && <p className={styles.error}>{passwordError}</p>}
            <button className={styles.popupButton} onClick={handleClosePasswordPopup}>Відхилити</button>
            <button className={styles.popupButton} onClick={handleConfirmPasswordChange}>Підтвердити</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Page;
