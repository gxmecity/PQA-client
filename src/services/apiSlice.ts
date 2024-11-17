import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from './service'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery({
    baseUrl: '/api',
  }),
  tagTypes: [
    'Quiz',
    'Events',
    'Dashboard',
    'Teams',
    'Series',
    'Quiz-Details',
    'Event-Details',
    'Series-Details',
  ],
  endpoints: () => ({}),
})
