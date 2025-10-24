import request from '@/lib/request'
import { UserResponse, UserCreateRequest, UserUpdateRequest, UserListParams } from './types'
import { PageResponse } from '../types'

/**
 * 分页获取用户列表
 * @param params 查询参数
 * @returns Promise<PageResponse<UserResponse>>
 */
export const fetchUserList = (params: UserListParams = {}): Promise<PageResponse<UserResponse>> => {
  return request.post('/api/users/pageList', {}, { params })
}

/**
 * 根据 ID 获取单个用户信息
 * @param userId 用户 ID
 * @returns Promise<UserResponse>
 */
export const fetchUserById = (userId: number): Promise<UserResponse> => {
  return request.get(`/api/users/${userId}`)
}

/**
 * 创建新用户
 * @param data 用户数据
 * @returns Promise<UserResponse>
 */
export const createUser = (data: UserCreateRequest): Promise<UserResponse> => {
  return request.post('/api/users/', data)
}

/**
 * 更新用户信息
 * @param userId 用户 ID
 * @param data 要更新的用户数据
 * @returns Promise<UserResponse>
 */
export const updateUser = (userId: number, data: UserUpdateRequest): Promise<UserResponse> => {
  return request.put(`/api/users/${userId}`, data)
}
