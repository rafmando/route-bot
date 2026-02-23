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
}) {
  const token = await getToken();

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