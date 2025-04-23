import { io, Socket } from 'socket.io-client';

export function useLeaderboard(date: string): Socket {
  return io(`${import.meta.env.VITE_API_URL?.replace('/api','')}/leaderboard`, {
    query: { date },
  });
}
