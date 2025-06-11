import * as Ably from 'ably'

export const ablyClient = new Ably.Realtime({
  authUrl: 'http://localhost:5000/api/realtime-auth',
  // authUrl: 'https://pqa-server.vercel.app/api/realtime-auth',
})
