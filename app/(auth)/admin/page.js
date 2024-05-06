"use client"

import React, { useState, useEffect, useRef } from 'react';
import styles from './Table.module.css';

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
    return incomingData.sort((a, b) => {
      const dateA = new Date(a.submissionTime);
      const dateB = new Date(b.submissionTime);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  const sortDatatwo = (incomingData, order) => {
    return incomingData.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
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
      let sortedData = sortData(applications.rows, sortOrder);

      if (searchTerm) {
        sortedData = sortedData.filter((item) =>
          item.email.toLowerCase().includes(searchTerm) ||
          item.password.toLowerCase().includes(searchTerm) ||
          formatDate(item.submissionTime).includes(searchTerm)
        );
      }

      setData(sortedData);
      setFilteredData(sortedData);
    } else {
      console.error("Не удалось загрузить данные");
    }
  };

  const fetchDataTwo = async () => {
    const response = await fetch("/api/user");
    if (response.ok) {
      const users = await response.json();
      setDataTwo(users.rows);

      
      const balances = {};
      users.rows.forEach((item) => {
        balances[item.id] = item.balance;
      });
      setOriginalBalances(balances);

      applyFiltersAndSortTwo(users.rows);
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
      filteredData = sortDatatwo(filteredData, sortOrderTwo);
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
    const newBalance = editableBalances[id];

  
    const response = await fetch(`/api/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, balance: newBalance }),
    });

    if (response.ok) {
      setOriginalBalances((prevBalances) => ({
        ...prevBalances,
        [id]: newBalance,
      }));
      setEditableBalances((prevBalances) => ({
        ...prevBalances,
        [id]: newBalance,
      }));
    } else {
      console.error("Ошибка при обновлении баланса");
    }
  };

  function formatDate(isoString) {
    const date = new Date(isoString);
    date.setHours(date.getHours() + 3);
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

  return (
    <div>
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
        <input
          type="text"
          placeholder="Поиск..."
          onChange={handleSearch}
          className={styles.searchInput}
        />
        <button onClick={handleSort} className={styles.sortButton}>
          Сортировать по времени ({sortOrder === 'asc' ? '⬆️' : '⬇️'})
        </button>
        <div className={styles.scrollabletable}>
          {filteredData.length > 0 ? (
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
                      <td><button onClick={() => handleReject(item.id)} className={styles.btnreject}>Отклонить</button></td>
                      <td><button onClick={() => handleAccept(item.id, item.email, item.password)} className={styles.btnconfirm}>Подтвердить</button></td>
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
        <input
          type="text"
          placeholder="Поиск..."
          onChange={handleSearchTwo}
          className={styles.searchInput}
        />
        <button onClick={handleSortTwo} className={styles.sortButton}>
          Сортировать по регистрации ({sortOrderTwo === 'asc' ? '⬆️' : '⬇️'})
        </button>
        {/* <button onClick={handleSortThree} className={styles.sortButton}>
          Недавние пополнения ({sortOrderUpdated === 'asc' ? '🟩' : '🟥'})
        </button> */}
        <div className={styles.scrollabletable}>
          {filteredDataTwo.length > 0 ? (
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
                {filteredDataTwo.map((item) => (
                  <tr key={item.id}>
                    <td>{formatDate(item.createdAt)}</td>
                    <td>
                      {item.createdAt === item.updatedAt
                        ? "Никогда не пополнял"
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
                  {filteredDataTwo.map((item) => (
                    <tr key={item.id}>
                      <td>{formatDate(item.createdAt)}</td>
                      <td>
                        {item.createdAt === item.updatedAt
                          ? "Никогда не пополнял"
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

              <div className={styles.noData}>
                Пользователей нет
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
