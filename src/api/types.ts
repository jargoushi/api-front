// 后端通用响应模型
export interface ApiResponse<T = unknown> {
  success: boolean
  code: number
  message: string
  data: T
  timestamp: string
}

// 分页请求参数
export interface PageRequest {
  page: number
  size: number
}

// 分页响应数据
export interface PageResponse<T> {
  total: number
  page: number
  size: number
  pages: number
  items: T[]
}

// 自定义 API 错误类
export class ApiError extends Error {
  constructor(
    public code: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
