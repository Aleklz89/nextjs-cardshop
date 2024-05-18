import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
import axios from 'axios';

const INTERVAL = 60000; // Интервал мониторинга в миллисекундах (например, 60000 мс = 60 секунд)

interface Card {
  uuid: string;
  account: {
    balance: number;
  };
}

let previousBalances: { [key: string]: number } = {};

async function fetchAllCards(): Promise<Card[]> {
    let allCards: Card[] = [];
    let currentPage = 1;
    const perPage = 25; // Количество карт на странице
  
    try {
      while (true) {
        const response = await axios.get(`https://api.epn.net/card?page=${currentPage}`, {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ',
          },
        });
  
        if (response.status !== 200) {
          throw new Error(`Error: ${response.status}`);
        }
  
        allCards = allCards.concat(response.data.data);
  
        // Проверяем, есть ли следующая страница
        if (response.data.meta.current_page * perPage >= response.data.meta.total) {
          break;
        }
  
        currentPage++;
      }
  
      return allCards;
    } catch (error) {
      console.error('Error fetching all cards:', error);
      return [];
    }
  }

async function logCardTransaction(cardId: string, amount: number) {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_ROOT_URL}/api/cardtrans`, {
      cardId,
      amount,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 201) {
      console.log(`Logged transaction for card ${cardId}: ${amount}`);
    } else {
      console.error(`Failed to log transaction for card ${cardId}: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error logging transaction for card ${cardId}:`, error);
  }
}

async function monitorBalances() {
  console.log("ТЕСТИРОВАНИЕ")
  const cards = await fetchAllCards();

  for (const card of cards) {
    const currentBalance = card.account.balance;
    const previousBalance = previousBalances[card.uuid];

    if (previousBalance !== undefined && currentBalance !== previousBalance) {
      const amount = currentBalance - previousBalance;
      await logCardTransaction(card.uuid, amount);
    }

    previousBalances[card.uuid] = currentBalance;
  }
}

export async function GET(request: NextRequest) {
  // Запуск мониторинга
  setInterval(monitorBalances, INTERVAL);

  return new NextResponse(
    JSON.stringify({ message: 'Balance monitoring started' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
