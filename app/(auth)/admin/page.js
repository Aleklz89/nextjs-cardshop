"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './Table.module.css';
import '../globals.css'

function Page() {
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
  

  const fetchValue = async () => {
    try {
      const response = await fetch('/api/constant');
      const data = await response.json();
      if (response.ok) {
        setValue(data.value);
        setOriginalValue(data.value);
        setInputValue(data.value);
      } else {
        setErrortwo(data.error || 'Ошибка при получении значения');
      }
    } catch (error) {
      console.error('Ошибка при получении значения:', error);
      setErrortwo('Ошибка при получении значения');
    }
  };

  const updateValue = async () => {
    try {
      const response = await fetch('/api/constant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: parseFloat(inputValue) }),
      });
      const data = await response.json();
      if (response.ok) {
        setValue(data.value);
        setOriginalValue(data.value);
      } else {
        setErrortwo(data.error || 'Ошибка при обновлении значения');
      }
    } catch (error) {
      console.error('Ошибка при обновлении значения:', error);
      setErrortwo('Ошибка при обновлении значения');
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
      const response = await fetch('/api/total');
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
    console.log("Fetching data at:", new Date().toLocaleTimeString());
    const response = await fetch("/api/request");
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
      console.error("Не удалось загрузить данные");
    }
  };

  const fetchDataTwo = async () => {
    const response = await fetch("/api/user");
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
      console.error("Не удалось загрузить данные для второй таблицы");
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
    const response = await fetch(`/api/decline?id=${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      const newData = data.filter((item) => item.id !== id);
      setData(newData);
      setFilteredData(newData);
    } else {
      console.error("Ошибка при отклонении заявки");
    }

    setTimeout(() => {
      setLoadingReject(null);
    }, 10000);
  };

  const handleAccept = async (id, email, password) => {
    setLoadingAccept(id);
    const deleteResponse = await fetch(`/api/decline?id=${id}`, {
      method: "DELETE",
    });
    if (deleteResponse.ok) {
      const addUserResponse = await fetch("/api/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (addUserResponse.ok) {
        const newData = data.filter((item) => item.id !== id);
        setData(newData);
        setFilteredData(newData);
      } else {
        console.error("Ошибка при добавлении пользователя");
      }
    } else {
      console.error("Ошибка при удалении заявки");
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

  const handleRejectBalanceChange = (id) => {
    setEditableBalances((prevBalances) => ({
      ...prevBalances,
      [id]: originalBalances[id],
    }));
  };

  const handleAcceptBalanceChange = async (id) => {
    const newBalance = Number(editableBalances[id]);
  
    // Получение баланса пользователя перед изменением
    const response = await fetch(`/api/user`);
    const usersData = await response.json();
    const user = usersData.users.find((item) => item.id === id);
    const currentBalance = Number(user.balance);
  
    // Вычисляем изменение баланса
    const balanceChange = newBalance - currentBalance;
  
  
    console.log(originalBalances);
  
    // Считаем суммарный баланс пользователей
    const totalUserBalance = Object.values({
      ...originalBalances,
      [id]: newBalance
    }).reduce((acc, curr) => acc + Number(curr), 0);
    const requiredBalance = parseFloat(balance) + (parseFloat(balance) * (parseFloat(value) / 100));
  
    console.log(totalUserBalance - 1);
    console.log(requiredBalance);
  
    // Проверка наличия достаточного основного баланса
    if ((totalUserBalance - 1) > requiredBalance) {
      setShowPopup(true);
      return;
    }
  
    // Обновление баланса
    const updateResponse = await fetch(`/api/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, balance: newBalance }),
    });

    // Если новый баланс меньше текущего, не добавляем транзакцию
    if (balanceChange <= 0) {
      return;
    }
  
    if (updateResponse.ok) {
      // Добавление транзакции после успешного обновления баланса
      const transactionResponse = await fetch('/api/newtrans', {
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
  
      if (!transactionResponse.ok) {
        console.error('Ошибка при добавлении транзакции');
      }
  
      setOriginalBalances((prevBalances) => ({
        ...prevBalances,
        [id]: newBalance,
      }));
      setEditableBalances((prevBalances) => ({
        ...prevBalances,
        [id]: newBalance,
      }));
    } else {
      console.error('Ошибка при обновлении баланса');
    }
  };
  

  function formatDate(isoString) {
    const date = new Date(isoString);
    date.setHours(date.getHours() + 0);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate();
    const months = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];
    const month = months[date.getMonth()];
    return `${hours}:${minutes}, ${day} ${month}`;
  }

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className={styles.patron}>
      <header className={styles.header}>
        <div className={styles.logo}>CVV888</div>
        <div>Admin panel</div>
        <div className={styles.themeSwitcher}>
          <span className={styles.lightLabel}>🌞</span>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
            <span className={styles.slider}></span>
          </label>
          <span className={styles.darkLabel}>🌜</span>
        </div>
      </header>
      <div className={styles.parent}>
        <div className={styles.total}>
          <h1>Текущий баланс:</h1>
          {balance !== null ? (
            <h2 className={styles.sum}>{balance} $</h2>
          ) : (
            <p>{error || 'Загрузка данных...'}</p>
          )}
        </div>
        <div className={styles.profit}>
          <h1>Текущая наценка:</h1>
          {value !== null ? (
            <h2 className={styles.sum}>{value}%</h2>
          ) : (
            <p>{error || 'Загрузка данных...'}</p>
          )}
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={styles.searchInput}
          />
          <div className={styles.buttonContainer}>
            <button onClick={rejectChange} className={styles.btnreject}>
              Отклонить
            </button>
            <button onClick={updateValue} className={styles.btnconfirm}>
              Подтвердить
            </button>
          </div>
        </div>
      </div>
      <div className={styles.mainblock}>
        <h2>Запросы на регистрацию</h2>
        <div className={styles.scrollabletable}>
          {loadingRequests ? (
            <div className={styles.loaderContainer}>
              <div className={styles.loader}></div>
              <p>Загрузка данных...</p>
            </div>
          ) : filteredData.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Время</th>
                  <th>Почта</th>
                  <th>Отклонить</th>
                  <th>Подтвердить</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id}>
                    <td>{formatDate(item.submissionTime)}</td>
                    <td>{item.email}</td>
                    <td>
                      <button
                        onClick={() => handleReject(item.id)}
                        className={styles.btnreject}
                        disabled={loadingReject === item.id}
                      >
                        {loadingReject === item.id ? (
                          <div className={styles.btnLoading}></div>
                        ) : (
                          'Отклонить'
                        )}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleAccept(item.id, item.email, item.password)}
                        className={styles.btnconfirm}
                        disabled={loadingAccept === item.id}
                      >
                        {loadingAccept === item.id ? (
                          <div className={styles.btnLoading}></div>
                        ) : (
                          'Подтвердить'
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
                    <th>Время</th>
                    <th>Почта</th>
                    <th>Отклонить</th>
                    <th>Подтвердить</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id}>
                      <td>{formatDate(item.submissionTime)}</td>
                      <td>{item.email}</td>
                      <td>
                        <button onClick={() => handleReject(item.id)} className={styles.btnreject}>
                          Отклонить
                        </button>
                      </td>
                      <td>
                        <button onClick={() => handleAccept(item.id, item.email, item.password)} className={styles.btnconfirm}>
                          Подтвердить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.noData}>
                Запросов на регистрацию нет
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.mainblocktwo}>
        <h2>Пользователи</h2>
        <div className={styles.scrollabletable}>
          {loadingUsers ? (
            <div className={styles.loaderContainer}>
              <div className={styles.loader}></div>
              <p>Загрузка данных...</p>
            </div>
          ) : dataTwo.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Зарегистрировался</th>
                  <th>Последнее изменение баланса</th>
                  <th>Почта</th>
                  <th>Баланс</th>
                  <th>Отклонить</th>
                  <th>Подтвердить</th>
                </tr>
              </thead>
              <tbody>
                {dataTwo.slice().reverse().map((item) => (
                  <tr key={item.id}>
                    <td>{formatDate(item.createdAt)}</td>
                    <td>
                      {item.createdAt === item.updatedAt
                        ? 'Никогда не пополнял'
                        : formatDate(item.updatedAt)}
                    </td>
                    <td>{item.email}</td>
                    <td>
                      <input
                        type="number"
                        value={
                          editableBalances[item.id] !== undefined
                            ? editableBalances[item.id]
                            : item.balance
                        }
                        onChange={(e) => handleBalanceChange(e, item.id)}
                        className={styles.balanceInput}
                      />
                      $
                    </td>
                    <td>
                      <button
                        onClick={() => handleRejectBalanceChange(item.id)}
                        className={styles.btnreject}
                      >
                        Отклонить
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleAcceptBalanceChange(item.id)}
                        className={styles.btnconfirm}
                      >
                        Подтвердить
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
                    <th>Зарегистрировался</th>
                    <th>Последнее пополнение</th>
                    <th>Почта</th>
                    <th>Баланс</th>
                    <th>Отклонить</th>
                    <th>Подтвердить</th>
                  </tr>
                </thead>
                <tbody>
                  {dataTwo.map((item) => (
                    <tr key={item.id}>
                      <td>{formatDate(item.createdAt)}</td>
                      <td>
                        {item.createdAt === item.updatedAt
                          ? 'Никогда не пополнял'
                          : formatDate(item.updatedAt)}
                      </td>
                      <td>{item.email}</td>
                      <td>
                        <input
                          type="number"
                          value={
                            editableBalances[item.id] !== undefined
                              ? editableBalances[item.id]
                              : item.balance
                          }
                          onChange={(e) => handleBalanceChange(e, item.id)}
                          className={styles.balanceInput}
                        />
                        $
                      </td>
                      <td>
                        <button onClick={() => handleRejectBalanceChange(item.id)} className={styles.btnreject}>
                          Отклонить
                        </button>
                      </td>
                      <td>
                        <button onClick={() => handleAcceptBalanceChange(item.id)} className={styles.btnconfirm}>
                          Подтвердить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.noData}>
                Пользователей нет
              </div>
            </div>
          )}
        </div>
      </div>
      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h3>Недостаточно средств на основном аккаунте</h3>
            <button className={styles.popupButton} onClick={handleClosePopup}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
