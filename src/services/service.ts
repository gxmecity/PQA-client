import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { AxiosError } from 'axios'
import axiosInstance from '../interceptors'

const axiosBaseQuery =
  ({ baseUrl }: { baseUrl: string }): BaseQueryFn<any, unknown, unknown> =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
      })
      return { data: result.data }
    } catch (axiosError) {
      let err = axiosError as AxiosError
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      }
    }
  }

export default axiosBaseQuery
