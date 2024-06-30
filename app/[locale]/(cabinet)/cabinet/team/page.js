"use client";

import React, { useState, useEffect } from "react";
import styles from "./Team.module.css";
import { useTranslations } from "next-intl";

function Page() {
  const translations = useTranslations();
  const [status, setStatus] = useState("");
  const [team, setTeam] = useState({ name: "", logoUrl: "" });
  const [logoUrl, setLogoUrl] = useState("");
  const [users, setUsers] = useState([]);
  const [tempUsers, setTempUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loadingUserId, setLoadingUserId] = useState(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [isUpdatingTeam, setIsUpdatingTeam] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [inviteLinks, setInviteLinks] = useState({});
  const [image, setImage] = useState(null);
  const [temporaryStatus, setTemporaryStatus] = useState({});

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

  const fetchLogo = async (teamName) => {
    try {
      const response = await fetch(`/api/team-logo?team=${teamName}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setLogoUrl(data.logoUrl);
    } catch (error) {
      console.error("Error fetching logo:", error);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchUserStatus = async () => {
        try {
          const response = await fetch(`/api/user-status?id=${userId}`);
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          const data = await response.json();
          setStatus(data.status);
          setTeam(data.team);
          setNewTeamName(data.team.name || ""); // Initialize the new team name with the current team name
          fetchLogo(data.team.name);
        } catch (error) {
          console.error("Error fetching user status:", error);
        }
      };

      fetchUserStatus();
    }
  }, [userId]);

  useEffect(() => {
    if (team.name && status) {
      const fetchUsers = async () => {
        try {
          const response = await fetch(`/api/users?team=${team.name}&status=${status}`);
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          const data = await response.json();
          setUsers(data);
          setTempUsers(data);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      fetchUsers();
    }
  }, [team.name, status]);

  const handleStatusChange = (userId, newStatus) => {
    setTempUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    setTemporaryStatus((prevStatus) => ({ ...prevStatus, [userId]: true }));
    setTimeout(() => {
      setTemporaryStatus((prevStatus) => ({ ...prevStatus, [userId]: false }));
    }, 3000);
  };

  const handleBalanceChange = (userId, newBalance) => {
    setTempUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, balance: newBalance } : user
      )
    );
  };

  const handleConfirm = async (updateUserId) => {
    const tempUser = tempUsers.find((user) => user.id === updateUserId);
    if (!tempUser) return;

    setLoadingUserId(updateUserId);

    try {
      const response = await fetch(`/api/update-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: updateUserId,
          balance: tempUser.balance,
          status: tempUser.status,
          currentUserId: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setLoadingUserId(null);  // Stop loading animation on error
        throw new Error(errorData.error);
      }

      // Обновить состояние users и tempUsers с обновленными данными
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updateUserId ? { ...user, status: tempUser.status, balance: tempUser.balance } : user
        )
      );
      setTempUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updateUserId ? { ...user, status: tempUser.status, balance: tempUser.balance } : user
        )
      );

      setLoadingUserId(null);

    } catch (error) {
      setErrorMessage(error.message);
      console.error("Error updating user:", error);
    }
  };

  const handleReject = (userId) => {
    const originalUser = users.find((user) => user.id === userId);
    if (!originalUser) return;

    setTempUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? originalUser : user))
    );
  };

  const handleTeamNameChange = (e) => {
    setNewTeamName(e.target.value);
  };

  const handleTeamNameUpdate = async () => {
    setIsUpdatingTeam(true);
    try {
      const response = await fetch(`/api/update-team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newTeamName,
          currentTeamName: team.name || "", // Provide a default empty string
          currentUserId: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setIsUpdatingTeam(false);  // Stop updating animation on error
        throw new Error(errorData.error);
      }

      // Обновить название команды в состоянии
      setTeam((prevTeam) => ({ ...prevTeam, name: newTeamName }));
      setIsUpdatingTeam(false);

    } catch (error) {
      setErrorMessage(error.message);
      console.error("Error updating team name:", error);
    }
  };

  const handleLogoUpload = async (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const formData = new FormData();
    formData.append('logo', file);
    formData.append('team', team.name);
    formData.append('userId', userId);

    try {
      const response = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload logo');
      }

      const data = await response.json();
      setLogoUrl(data.logoUrl);
    } catch (error) {
      console.error('Error uploading logo:', error);
      setErrorMessage(error.message);
    }
  };

  const renderStatusDropdown = (user) => {
    const statuses = ["buyer", "team lead", "head", "owner"];
    const availableStatuses = statuses.slice(0, statuses.indexOf(status.toLowerCase()) + 1);

    return (
      <select
        value={user.status}
        onChange={(e) => handleStatusChange(user.id, e.target.value)}
      >
        {availableStatuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    );
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "owner":
        return styles.owner;
      case "head":
        return styles.head;
      case "team lead":
        return styles.teamLead;
      case "buyer":
        return styles.buyer;
      default:
        return styles.buyer;
    }
  };

  const generateInviteLink = async (inviteStatus) => {
    try {
      const response = await fetch("/api/generate-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: inviteStatus, teamId: team.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setInviteLinks((prev) => ({ ...prev, [inviteStatus]: data.inviteUrl }));
      } else {
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error("Error generating invite link:", error);
      setErrorMessage("Error generating invite link");
    }
  };

  const renderInviteLinks = () => {
    const statusHierarchy = ["buyer", "team lead", "head", "owner"];
    const currentUserStatusIndex = statusHierarchy.indexOf(status.toLowerCase());

    return statusHierarchy.slice(0, currentUserStatusIndex).map((inviteStatus) => (
      <tr key={inviteStatus}>
        <td>{inviteStatus}</td>
        <td>
          {inviteLinks[inviteStatus] ? (
            <a href={inviteLinks[inviteStatus]} target="_blank" rel="noopener noreferrer">
              {inviteLinks[inviteStatus]}
            </a>
          ) : (
            <button onClick={() => generateInviteLink(inviteStatus)}>
              {translations('Team.generate')}
            </button>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <div>
      {errorMessage && (
        <div className={styles.errorPopup}>
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage(null)}>Close</button>
        </div>
      )}
      <div className={styles.logoSection}>
        {status.toLowerCase() === 'owner' && <h2 className={styles.subtitle}>{translations('Team.logo')}</h2>}
        {status.toLowerCase() === 'owner' ? (
          <div
            className={styles.logoDropArea}
            onDrop={handleLogoUpload}
            onDragOver={(e) => e.preventDefault()}
          >
            {logoUrl ? (
              <img src={logoUrl} alt="Team Logo" className={styles.logo} />
            ) : (
              <div className={styles.logoPlaceholder}>{translations('Team.logo')}</div>
            )}
          </div>
        ) : (
          <div className={styles.logoDisplay}>
            {logoUrl ? (
              <img src={logoUrl} alt="Team Logo" className={styles.logo} />
            ) : (
              <div className={styles.logoPlaceholder}>{translations('Team.drop')}</div>
            )}
          </div>
        )}
      </div>
      <div className={styles.main}>
        <h1 className={styles.titletwo}>{translations('Team.your')}</h1>
        {status.toLowerCase() === 'owner' ? (
          <div className={styles.block}>
            <input
              type="text"
              className={styles.inputField}
              value={newTeamName}
              onChange={handleTeamNameChange}
              disabled={isUpdatingTeam}
            />
            <button
              className={styles.updateButton}
              onClick={handleTeamNameUpdate}
              disabled={isUpdatingTeam}
            >
              {isUpdatingTeam ? (
                <div className={styles.loader}></div>
              ) : (
                "Update"
              )}
            </button>
          </div>
        ) : (
          <div className={styles.team}>{team.name}</div>
        )}
        <h1 className={styles.title}>{translations('Team.status')}</h1>
        <div className={getStatusClass(status)}>{status}</div>
      </div>
      <div className={styles.info}>
        <h2 className={styles.subtitle}>{translations('Team.invite')}</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{translations('Team.other')}</th>
              <th>{translations('Team.invite')}</th>
            </tr>
          </thead>
          <tbody>
            {renderInviteLinks()}
          </tbody>
        </table>
      </div>
      <div className={styles.info}>
        <h2 className={styles.subtitle}>{translations('Team.users')}</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Telegram</th>
              <th>{translations('BuyCard.balance')}</th>
              <th>{translations('Team.create')}</th>
              <th>{translations('Team.update')}</th>
              <th>{translations('Team.other')}</th>
              <th>{translations('Cards.confirm')}</th>
              <th>{translations('Team.reject')}</th>
            </tr>
          </thead>
          <tbody>
            {tempUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.telegram}</td>
                <td>
                  <input
                    type="number"
                    value={user.balance}
                    onChange={(e) => handleBalanceChange(user.id, e.target.value)}
                  />
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>{new Date(user.updatedAt).toLocaleDateString()}</td>
                <td>
                  {temporaryStatus[user.id] ? (
                    "---"
                  ) : (
                    renderStatusDropdown(user)
                  )}
                </td>
                <td>
                  <button
                    className={styles.confirmButton}
                    onClick={() => handleConfirm(user.id)}
                    disabled={loadingUserId === user.id}
                  >
                    {loadingUserId === user.id ? (
                      <div className={styles.loader}></div>
                    ) : (
                      <div>{translations('Cards.confirm')}</div>
                    )}
                  </button>
                </td>
                <td>
                  <button
                    className={styles.rejectButton}
                    onClick={() => handleReject(user.id)}
                  >
                    {translations('Team.reject') || 'Reject' // Добавьте строку 'Reject' для проверки
                    }
                  </button>
                </td>





              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Page;
