'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createUser, fetchUserById, fetchUserList, updateUser } from '@/api/user'
import { UserCreateRequest, UserUpdateRequest, UserResponse } from '@/api/user/types'
import { PageResponse } from '@/api/types'

// 定义结果类型
type ApiResults = {
  create?: UserResponse | Error
  fetch?: UserResponse | Error
  update?: UserResponse | Error
  list?: PageResponse<UserResponse> | Error
}

type LoadingStates = {
  create?: boolean
  fetch?: boolean
  update?: boolean
  list?: boolean
}

export default function UsersPage() {
  const [results, setResults] = useState<ApiResults>({})
  const [loading, setLoading] = useState<LoadingStates>({})

  // 测试创建用户
  const testCreateUser = async () => {
    setLoading(prev => ({ ...prev, create: true }))
    try {
      const userData: UserCreateRequest = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      }
      const result = await createUser(userData)
      setResults(prev => ({ ...prev, create: result }))
      console.log('创建用户结果:', result)
    } catch (error) {
      console.error('创建用户失败:', error)
      setResults(prev => ({
        ...prev,
        create: error instanceof Error ? error : new Error(String(error)),
      }))
    } finally {
      setLoading(prev => ({ ...prev, create: false }))
    }
  }

  // 测试获取单个用户
  const testFetchUser = async () => {
    setLoading(prev => ({ ...prev, fetch: true }))
    try {
      const result = await fetchUserById(1) // 测试用户ID为1
      setResults(prev => ({ ...prev, fetch: result }))
      console.log('获取用户结果:', result)
    } catch (error) {
      console.error('获取用户失败:', error)
      setResults(prev => ({
        ...prev,
        fetch: error instanceof Error ? error : new Error(String(error)),
      }))
    } finally {
      setLoading(prev => ({ ...prev, fetch: false }))
    }
  }

  // 测试更新用户
  const testUpdateUser = async () => {
    setLoading(prev => ({ ...prev, update: true }))
    try {
      const updateData: UserUpdateRequest = {
        username: 'updateduser',
        email: 'updated@example.com',
        is_active: true,
      }
      const result = await updateUser(1, updateData) // 测试用户ID为1
      setResults(prev => ({ ...prev, update: result }))
      console.log('更新用户结果:', result)
    } catch (error) {
      console.error('更新用户失败:', error)
      setResults(prev => ({
        ...prev,
        update: error instanceof Error ? error : new Error(String(error)),
      }))
    } finally {
      setLoading(prev => ({ ...prev, update: false }))
    }
  }

  // 测试获取用户列表
  const testFetchUserList = async () => {
    setLoading(prev => ({ ...prev, list: true }))
    try {
      const result = await fetchUserList({
        page: 1,
        size: 10,
        username: null,
        email: null,
        is_active: null,
      })
      setResults(prev => ({ ...prev, list: result }))
      console.log('获取用户列表结果:', result)
    } catch (error) {
      console.error('获取用户列表失败:', error)
      setResults(prev => ({
        ...prev,
        list: error instanceof Error ? error : new Error(String(error)),
      }))
    } finally {
      setLoading(prev => ({ ...prev, list: false }))
    }
  }

  const ResultDialog = ({
    title,
    result,
  }: {
    title: string
    result: UserResponse | PageResponse<UserResponse> | Error
  }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>API 调用结果（详细数据请查看控制台）</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <pre className="text-xs bg-gray-100 p-4 rounded-md overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">用户模块测试</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 创建用户测试 */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">创建用户测试</h3>
          <Button onClick={testCreateUser} disabled={loading.create} className="w-full">
            {loading.create ? '创建中...' : '测试创建用户'}
          </Button>
          {results.create && <ResultDialog title="创建用户结果" result={results.create} />}
        </div>

        {/* 获取单个用户测试 */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">获取单个用户测试</h3>
          <Button onClick={testFetchUser} disabled={loading.fetch} className="w-full">
            {loading.fetch ? '获取中...' : '测试获取用户(ID:1)'}
          </Button>
          {results.fetch && <ResultDialog title="获取用户结果" result={results.fetch} />}
        </div>

        {/* 更新用户测试 */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">更新用户测试</h3>
          <Button onClick={testUpdateUser} disabled={loading.update} className="w-full">
            {loading.update ? '更新中...' : '测试更新用户(ID:1)'}
          </Button>
          {results.update && <ResultDialog title="更新用户结果" result={results.update} />}
        </div>

        {/* 获取用户列表测试 */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">获取用户列表测试</h3>
          <Button onClick={testFetchUserList} disabled={loading.list} className="w-full">
            {loading.list ? '获取中...' : '测试获取用户列表'}
          </Button>
          {results.list && <ResultDialog title="获取用户列表结果" result={results.list} />}
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">使用说明</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 点击按钮测试对应的 API 接口</li>
          <li>• 详细结果会输出到浏览器控制台</li>
          <li>• 点击查看结果按钮可查看格式化的返回数据</li>
          <li>• 如果接口调用失败，会在控制台显示错误信息</li>
        </ul>
      </div>
    </div>
  )
}
