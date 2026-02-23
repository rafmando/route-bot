export const awsConfig = {
  region: 'eu-west-2',
  userPoolId: import.meta.env.VITE_USER_POOL_ID,
  userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
  apiUrl: import.meta.env.VITE_API_URL
}