import request from '@/lib/request'
import { User, CreateUserDto } from './types'
import { PageRequest, PageResponse } from '../types'

/**
 * 获取用户列表（分页）
 * @param params 分页参数
 * @returns Promise<PageResponse<User>>
 */
export const fetchUserList = (params: PageRequest): Promise<PageResponse<User>> => {
  return request.get('/users', { params })
}

/**
 * 根据 ID 获取单个用户信息
 * @param id 用户 ID
 * @returns Promise<User>
 */
export const fetchUserById = (id: number): Promise<User> => {
  return request.get(`/users/${id}`)
}

/**
 * 创建新用户
 * @param data 用户数据
 * @returns Promise<User>
 */
export const createUser = (data: CreateUserDto): Promise<User> => {
  return request.post('/users', data)
}

/**
 * 更新用户信息
 * @param id 用户 ID
 * @param data 要更新的用户数据
 * @returns Promise<User>
 */
export const updateUser = (id: number, data: Partial<CreateUserDto>): Promise<User> => {
  return request.put(`/users/${id}`, data)
}

/**
 * 删除用户
 * @param id 用户 ID
 * @returns Promise<void>
 */
export const deleteUser = (id: number): Promise<void> => {
  return request.delete(`/users/${id}`)
}
