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

  const [loadingRejectBalance, setLoadingRejectBalance] = useState(null);
  const [loadingAcceptBalance, setLoadingAcceptBalance] = useState(null);

  const [editableMarkups, setEditableMarkups] = useState({});



  const fetchValue = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + "/api/constant");
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
    console.log("Fetching data at:", new Date().toLocaleTimeString());
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
      console.error("Не удалось загрузить данные");
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
    const response = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + `/api/decline?id=${id}`, {
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

  const handleMarkupChange = (e, id) => {
    const newMarkup = parseFloat(e.target.value);
    setEditableMarkups((prevMarkups) => ({
      ...prevMarkups,
      [id]: newMarkup,
    }));
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
    console.log(id)
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
        console.error('Ошибка при обновлении баланса');
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
        console.error('Ошибка при обновлении markup');
      }
    }
    setTimeout(() => {
      setLoadingAcceptBalance(null); 
    }, 5000); 
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
        <div className={styles.parent}>
        
          <h3>Текущий баланс:</h3>
          {balance !== null ? (
            <h3 className={styles.sum}>{balance} $</h3>
          ) : (
            <p className={styles.load}>{error || 'Загрузка данных...'}</p>
          )}
        
      </div>
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
                  <th>Телеграм</th>
                  <th>Отклонить</th>
                  <th>Подтвердить</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.slice().reverse().map((item) => (
                  <tr key={item.id}>
                    <td>{formatDate(item.submissionTime)}</td>
                    <td>{item.email}</td>
                    <td>
                      <a href={`https://t.me/${item.telegram}`} target="_blank" rel="noopener noreferrer"  className={styles.telegramlink}>
                        @{item.telegram}
                      </a>
                    </td>



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
                        onClick={() => handleAccept(item.id, item.email, item.password, item.telegram)}
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
                    <th>Телеграм</th>
                    <th>Отклонить</th>
                    <th>Подтвердить</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice().reverse().map((item) => (
                    <tr key={item.id}>
                      <td>{formatDate(item.submissionTime)}</td>
                      <td>{item.email}</td>
                      <td>
                        <a href={`https://t.me/${item.telegram}`} target="_blank" rel="noopener noreferrer"  className={styles.telegramlink}>
                          @{item.telegram}
                        </a>
                      </td>


                      <td>
                        <button onClick={() => handleReject(item.id)} className={styles.btnreject}>
                          Отклонить
                        </button>
                      </td>
                      <td>
                        <button onClick={() => handleAccept(item.id, item.email, item.password, item.telegram)} className={styles.btnconfirm}>
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
                  <th>Последнее изменение баланса/наценки</th>
                  <th>Почта</th>
                  <th>Баланс</th>
                  <th>Телеграм</th>
                  <th>Наценка</th>
                  <th>Отклонить</th>
                  <th>Подтвердить</th>
                </tr>
              </thead>
              <tbody>
                {dataTwo.slice().reverse().map((item) => (
                  <tr key={item.id}>
                    <td>{formatDate(item.createdAt)}</td>
                    <td>{item.createdAt === item.updatedAt ? 'Никогда не пополнял' : formatDate(item.updatedAt)}</td>
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
                      <a href={`https://t.me/${item.telegram}`} target="_blank" rel="noopener noreferrer"  className={styles.telegramlink}>
                        @{item.telegram}
                      </a>
                    </td>


                    <td>
                      <input
                        type="number"
                        value={editableMarkups[item.id] !== undefined ? editableMarkups[item.id] : item.markup}
                        onChange={(e) => handleMarkupChange(e, item.id)}
                        className={styles.balanceInput}
                      />
                      <span className={styles.percentSign}>%</span>
                    </td>
                    <td>
                      <button onClick={() => handleRejectBalanceChange(item.id)} className={styles.btnreject}>
                        {loadingRejectBalance === item.id ? (<div className={styles.loader}></div>) : ('Отклонить')}
                      </button>
                    </td>
                    <td>
                      <button onClick={() => handleAcceptBalanceChange(item.id)} className={styles.btnconfirm}>
                        {loadingAcceptBalance === item.id ? (<div className={styles.loader}></div>) : ('Подтвердить')}
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
                    <th>Последнее изменение баланса/наценки</th>
                    <th>Почта</th>
                    <th>Баланс</th>
                    <th>Телеграм</th>
                    <th>Наценка</th>
                    <th>Отклонить</th>
                    <th>Подтвердить</th>
                  </tr>
                </thead>
                <tbody>
                  {dataTwo.slice().reverse().map((item) => (
                    <tr key={item.id}>
                      <td>{formatDate(item.createdAt)}</td>
                      <td>{item.createdAt === item.updatedAt ? 'Никогда не пополнял' : formatDate(item.updatedAt)}</td>
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
                        <input
                          type="number"
                          value={editableMarkups[item.id] !== undefined ? editableMarkups[item.id] : item.markup}
                          onChange={(e) => handleMarkupChange(e, item.id)}
                          className={styles.balanceInput}
                        />
                        <span className={styles.percentSign}>%</span>
                      </td>
                      <td>
                        <button onClick={() => handleRejectBalanceChange(item.id)} className={styles.btnreject}>
                          {loadingRejectBalance === item.id ? (<div className={styles.loader}></div>) : ('Отклонить')}
                        </button>
                      </td>
                      <td>
                        <button onClick={() => handleAcceptBalanceChange(item.id)} className={styles.btnconfirm}>
                          {loadingAcceptBalance === item.id ? (<div className={styles.loader}></div>) : ('Подтвердить')}
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
