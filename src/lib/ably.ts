import * as Ably from 'ably'

export const ablyClient = new Ably.Realtime({
  authUrl: 'https://pqa-server.vercel.app/api/realtime-auth',
})
