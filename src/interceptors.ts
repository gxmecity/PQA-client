import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'

const axiosInstance: AxiosInstance = axios.create({
  // baseURL: 'https://pqa-server.vercel.app',
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const access_token = localStorage.getItem('pqa_user_token')

    if (access_token && config.headers) {
      config.headers.Authorization = `Bearer ${access_token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => Promise.reject(error)
)

export default axiosInstance
