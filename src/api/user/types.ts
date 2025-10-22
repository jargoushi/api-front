// 用户信息模型
export interface User {
  id: number
  name: string
  email: string
  createdAt: string
}

// 创建用户的请求体模型
export interface CreateUserDto {
  name: string
  email: string
  password: string
}
