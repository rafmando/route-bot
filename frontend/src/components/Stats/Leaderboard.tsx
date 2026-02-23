import { useEffect, useState } from 'react';
import { getLeaderboard } from '../../services/api';

interface LeaderboardEntry {
  userId: string;
  userEmail: string;
  totalDistance: number;
  algorithm: string;
  createdAt: string;
}

export function Leaderboard({ mapId }: { mapId: string }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    getLeaderboard(mapId).then(data => setEntries(data.leaderboard));
  }, [mapId]);

  return (
    <div>
      <h2>🏆 Leaderboard</h2>
      {entries.map((entry, i) => (
        <div key={entry.createdAt}>
          #{i + 1} {entry.userEmail || entry.userId} — {entry.totalDistance.toFixed(2)}km — {entry.algorithm}
        </div>
      ))}
    </div>
  );
}