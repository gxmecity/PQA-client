import * as Ably from 'ably'

export const ablyClient = new Ably.Realtime({
  authUrl: 'https://pqa-server.onrender.com/api/realtime-auth',
})
