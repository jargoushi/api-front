'use client'

import { useState, useEffect } from 'react'
import React from 'react'
import { Button } from '@/components/ui/button'
import { fetchUserList, fetchUserById, createUser, updateUser } from '@/api/user'
import {
  UserResponse,
  UserCreateRequest,
  UserUpdateRequest,
  UserListParams,
} from '@/api/user/types'
import { useApi } from '@/hooks/useApi'
import Pagination from '@/components/Pagination'
import SearchForm from '@/components/common/SearchForm'
import DataTable from '@/components/common/DataTable'
import EntityDialog from '@/components/common/EntityDialog'
import { userConfig } from '@/config/modules/userConfig'
import type { DialogMode } from '@/components/common/types'

export default function UsersPage() {
  // 用户列表数据
  const [users, setUsers] = useState<UserResponse[]>([])

  // 分页信息
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total: 0,
    pages: 0,
  })

  // 搜索参数
  const [searchParams, setSearchParams] = useState<UserListParams>({
    page: 1,
    size: 10,
    username: null,
    email: null,
    is_active: null,
  })

  // 选中的用户
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null)

  // API Hooks
  const listApi = useApi()
  const detailApi = useApi()
  const createApi = useApi()
  const updateApi = useApi()

  // 弹窗状态
  const [dialogMode, setDialogMode] = useState<DialogMode>('create')
  const [dialogOpen, setDialogOpen] = useState(false)

  // 表单数据
  const [formData, setFormData] = useState<Record<string, unknown>>({
    username: '',
    email: '',
    password: '',
    is_active: true,
  })

  // 加载用户列表
  const loadUsers = async (params: UserListParams = searchParams) => {
    const result = await listApi.execute(() => fetchUserList(params))
    if (result) {
      setUsers(result.items)
      setPagination({
        page: result.page,
        size: result.size,
        total: result.total,
        pages: result.pages,
      })
      setSearchParams(params)
    }
  }

  // 查看用户详情
  const viewUser = async (userId: number) => {
    const user = await detailApi.execute(() => fetchUserById(userId))
    if (user) {
      setSelectedUser(user)
      setFormData({
        id: user.id,
        username: user.username,
        email: user.email,
        is_active: user.is_active,
        created_at: new Date(user.created_at).toLocaleString(),
      })
      setDialogMode('view')
      setDialogOpen(true)
    }
  }

  // 编辑用户
  const editUser = async (userId: number) => {
    const user = await detailApi.execute(() => fetchUserById(userId))
    if (user) {
      setSelectedUser(user)
      setFormData({
        username: user.username,
        email: user.email,
        password: '', // 编辑时密码为空
        is_active: user.is_active,
      })
      setDialogMode('edit')
      setDialogOpen(true)
    }
  }

  // 创建用户
  const handleCreateUser = async () => {
    const createRequest: UserCreateRequest = {
      username: formData.username as string,
      email: formData.email as string,
      password: formData.password as string,
    }
    const result = await createApi.execute(() => createUser(createRequest))
    if (result) {
      setDialogOpen(false)
      setFormData({ username: '', email: '', password: '', is_active: true })
      loadUsers() // 重新加载列表
    }
  }

  // 更新用户
  const handleUpdateUser = async () => {
    if (!selectedUser) return

    const updateRequest: UserUpdateRequest = {
      username: formData.username as string,
      email: formData.email as string,
      is_active: formData.is_active as boolean,
    }
    const result = await updateApi.execute(() => updateUser(selectedUser.id, updateRequest))
    if (result) {
      setDialogOpen(false)
      setSelectedUser(null)
      setFormData({ username: '', email: '', password: '', is_active: true })
      loadUsers() // 重新加载列表
    }
  }

  // 处理弹窗提交
  const handleDialogSubmit = () => {
    if (dialogMode === 'create') {
      handleCreateUser()
    } else if (dialogMode === 'edit') {
      handleUpdateUser()
    }
    // 'view' 模式下不执行提交，直接关闭
  }

  // 处理弹窗取消
  const handleDialogCancel = () => {
    setDialogOpen(false)
    setSelectedUser(null)
    setFormData({ username: '', email: '', password: '', is_active: true })
  }

  // 打开新增弹窗
  const handleCreateUserClick = () => {
    setFormData({ username: '', email: '', password: '', is_active: true })
    setDialogMode('create')
    setDialogOpen(true)
  }

  // 搜索处理
  const handleSearch = () => {
    const params: UserListParams = {
      ...searchParams,
      page: 1,
    }
    loadUsers(params)
  }

  // 重置搜索
  const handleResetSearch = () => {
    const params: UserListParams = {
      page: 1,
      size: 10,
      username: null,
      email: null,
      is_active: null,
    }
    setSearchParams(params)
    loadUsers(params)
  }

  // 分页处理
  const handlePageChange = (page: number) => {
    loadUsers({
      ...searchParams,
      page,
    })
  }

  // 每页条数变化处理
  const handleSizeChange = (size: number) => {
    setPagination(prev => ({ ...prev, size }))
    loadUsers({
      ...searchParams,
      page: 1,
      size,
    })
  }

  // 初始加载
  useEffect(() => {
    const initLoadUsers = async () => {
      await loadUsers()
    }
    initLoadUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题和操作区 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <Button onClick={handleCreateUserClick}>新增用户</Button>
      </div>

      {/* 搜索筛选表单 */}
      <SearchForm
        fields={userConfig.searchFields}
        values={searchParams as Record<string, unknown>}
        onChange={values => setSearchParams(values as UserListParams)}
        onSearch={handleSearch}
        onReset={handleResetSearch}
        loading={listApi.loading}
      />

      {/* 用户列表表格 */}
      <DataTable
        columns={userConfig.tableColumns.map(col => ({
          ...col,
          render: (value: unknown): React.ReactNode => {
            if (col.key === 'is_active') {
              const isActive = Boolean(value)
              return (
                <span
                  className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {isActive ? '启用' : '禁用'}
                </span>
              )
            }
            if (
              (col.key === 'created_at' || col.key === 'updated_at') &&
              typeof value === 'string'
            ) {
              return new Date(value).toLocaleString()
            }
            return value as React.ReactNode
          },
        }))}
        data={users}
        loading={listApi.loading}
        actions={{
          view: (user: UserResponse) => viewUser(user.id),
          edit: (user: UserResponse) => editUser(user.id),
        }}
      />

      {/* 分页组件 */}
      <Pagination
        pagination={pagination}
        onPageChange={handlePageChange}
        onSizeChange={handleSizeChange}
        loading={listApi.loading}
      />

      {/* 通用实体弹窗 */}
      <EntityDialog
        mode={dialogMode}
        title={
          dialogMode === 'create' ? '新增用户' : dialogMode === 'edit' ? '编辑用户' : '用户详情'
        }
        fields={userConfig.formFields[dialogMode]}
        values={formData}
        onChange={setFormData}
        onSubmit={handleDialogSubmit}
        onCancel={handleDialogCancel}
        loading={createApi.loading || updateApi.loading}
        open={dialogOpen}
      />
    </div>
  )
}
