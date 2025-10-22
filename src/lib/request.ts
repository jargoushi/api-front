import axios from 'axios'
import { ApiError } from '@/api/types'

// 创建 axios 实例
const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // 从环境变量读取 API 地址
  timeout: 10000, // 请求超时时间
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么，例如加入 token
    // 假设 token 存储在 localStorage 中
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    const apiResponse = response.data

    // 如果后端返回的业务状态为成功
    if (apiResponse.success) {
      // 直接返回 data 部分，剥离外层包装
      return apiResponse.data
    }

    throw new ApiError(apiResponse.code, apiResponse.message)
  },
  error => {
    // 对响应错误做点什么
    // 处理 HTTP 错误状态码，如 401, 404, 500
    if (error.response) {
      const { status, data } = error.response
      // 尝试使用后端返回的错误信息，否则使用默认信息
      const message = data?.message || `请求失败，状态码: ${status}`
      throw new ApiError(status, message)
    }
    // 处理网络错误或请求超时
    else if (error.request) {
      throw new ApiError(0, '网络错误，请检查您的网络连接')
    }
    // 其他错误
    else {
      throw new ApiError(0, error.message || '发生未知错误')
    }
  }
)

export default request
