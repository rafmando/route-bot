import { fetchAuthSession } from 'aws-amplify/auth';
import { awsConfig } from '../config/aws';

async function getToken(): Promise<string> {
  const session = await fetchAuthSession();
  return session.tokens?.idToken?.toString() ?? '';
}

export async function saveRoute(routeData: {
  mapId: string;
  algorithm: string;
  totalDistance: number;
  path: string[];
  userEmail?: string;
}) {
  const token = await getToken();
  console.log('body being sent:', JSON.stringify(routeData));
  const response = await fetch(`${awsConfig.apiUrl}/routes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(routeData)
  });

  console.log('Fetching:', `${awsConfig.apiUrl}/routes`);

  return response.json();
}

export async function getLeaderboard(mapId: string) {
  const response = await fetch(`${awsConfig.apiUrl}/leaderboard?mapId=${mapId}`);
  return response.json();
}