// 用户响应模型
export interface UserResponse {
  id: number
  username: string
  email: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// 创建用户的请求体模型
export interface UserCreateRequest {
  username: string
  email: string
  password: string
}

// 更新用户的请求体模型
export interface UserUpdateRequest {
  username?: string | null
  email?: string | null
  is_active?: boolean | null
}

// 用户列表查询参数
export interface UserListParams {
  page?: number
  size?: number
  username?: string | null
  email?: string | null
  is_active?: boolean | null
}
