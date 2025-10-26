'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fetchUserList, fetchUserById, createUser, updateUser } from '@/api/user'
import {
  UserResponse,
  UserCreateRequest,
  UserUpdateRequest,
  UserListParams,
} from '@/api/user/types'
import { useApi } from '@/hooks/useApi'
import Pagination from '@/components/Pagination'

// 主要状态管理
interface DialogStates {
  detail: boolean
  create: boolean
  edit: boolean
}

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
  const [dialogs, setDialogs] = useState<DialogStates>({
    detail: false,
    create: false,
    edit: false,
  })

  // 表单数据
  const [formData, setFormData] = useState<UserCreateRequest & { is_active?: boolean }>({
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
      setDialogs(prev => ({ ...prev, detail: true }))
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
      setDialogs(prev => ({ ...prev, edit: true }))
    }
  }

  // 创建用户
  const handleCreateUser = async () => {
    const result = await createApi.execute(() => createUser(formData as UserCreateRequest))
    if (result) {
      setDialogs(prev => ({ ...prev, create: false }))
      setFormData({ username: '', email: '', password: '', is_active: true })
      loadUsers() // 重新加载列表
    }
  }

  // 更新用户
  const handleUpdateUser = async () => {
    if (!selectedUser) return

    const result = await updateApi.execute(() =>
      updateUser(selectedUser.id, formData as UserUpdateRequest)
    )
    if (result) {
      setDialogs(prev => ({ ...prev, edit: false }))
      setSelectedUser(null)
      setFormData({ username: '', email: '', password: '', is_active: true })
      loadUsers() // 重新加载列表
    }
  }

  // 搜索处理
  const handleSearch = () => {
    loadUsers({
      ...searchParams,
      page: 1,
    })
  }

  // 重置搜索
  const handleResetSearch = () => {
    const params = {
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
        <Button
          onClick={() => {
            setFormData({ username: '', email: '', password: '', is_active: true })
            setDialogs(prev => ({ ...prev, create: true }))
          }}
        >
          新增用户
        </Button>
      </div>

      {/* 搜索筛选表单 */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="username">用户名</Label>
            <Input
              id="username"
              placeholder="请输入用户名"
              value={searchParams.username || ''}
              onChange={e =>
                setSearchParams(prev => ({
                  ...prev,
                  username: e.target.value || null,
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              placeholder="请输入邮箱"
              value={searchParams.email || ''}
              onChange={e =>
                setSearchParams(prev => ({
                  ...prev,
                  email: e.target.value || null,
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="status">状态</Label>
            <select
              id="status"
              className="w-full h-10 px-3 py-2 text-sm border rounded-md"
              value={
                searchParams.is_active === null ? '' : searchParams.is_active ? 'true' : 'false'
              }
              onChange={e =>
                setSearchParams(prev => ({
                  ...prev,
                  is_active: e.target.value === '' ? null : e.target.value === 'true',
                }))
              }
            >
              <option value="">全部</option>
              <option value="true">启用</option>
              <option value="false">禁用</option>
            </select>
          </div>
          <div className="flex items-end space-x-2">
            <Button onClick={handleSearch} disabled={listApi.loading}>
              搜索
            </Button>
            <Button variant="outline" onClick={handleResetSearch}>
              重置
            </Button>
          </div>
        </div>
      </div>

      {/* 用户列表表格 */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>用户名</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>更新时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listApi.loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  加载中...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.is_active ? '启用' : '禁用'}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                  <TableCell>{new Date(user.updated_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewUser(user.id)}
                        disabled={detailApi.loading}
                      >
                        查看
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editUser(user.id)}
                        disabled={detailApi.loading}
                      >
                        编辑
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 分页组件 */}
      <Pagination
        pagination={pagination}
        onPageChange={handlePageChange}
        onSizeChange={handleSizeChange}
        loading={listApi.loading}
      />

      {/* 用户详情弹窗 */}
      <Dialog
        open={dialogs.detail}
        onOpenChange={open => setDialogs(prev => ({ ...prev, detail: open }))}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>用户详情</DialogTitle>
            <DialogDescription>查看用户的详细信息</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="detail-id">ID</Label>
                <Input id="detail-id" value={selectedUser.id.toString()} disabled />
              </div>
              <div>
                <Label htmlFor="detail-username">用户名</Label>
                <Input id="detail-username" value={selectedUser.username} disabled />
              </div>
              <div>
                <Label htmlFor="detail-email">邮箱</Label>
                <Input id="detail-email" value={selectedUser.email} disabled />
              </div>
              <div>
                <Label htmlFor="detail-status">状态</Label>
                <Input
                  id="detail-status"
                  value={selectedUser.is_active ? '启用' : '禁用'}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="detail-created">创建时间</Label>
                <Input
                  id="detail-created"
                  value={new Date(selectedUser.created_at).toLocaleString()}
                  disabled
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDialogs(prev => ({ ...prev, detail: false }))}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 新增用户弹窗 */}
      <Dialog
        open={dialogs.create}
        onOpenChange={open => setDialogs(prev => ({ ...prev, create: open }))}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>新增用户</DialogTitle>
            <DialogDescription>创建一个新的用户账号</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="create-username">用户名</Label>
              <Input
                id="create-username"
                value={formData.username || ''}
                onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="请输入用户名"
              />
            </div>
            <div>
              <Label htmlFor="create-email">邮箱</Label>
              <Input
                id="create-email"
                type="email"
                value={formData.email || ''}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="请输入邮箱"
              />
            </div>
            <div>
              <Label htmlFor="create-password">密码</Label>
              <Input
                id="create-password"
                type="password"
                value={formData.password || ''}
                onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="请输入密码"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogs(prev => ({ ...prev, create: false }))}
            >
              取消
            </Button>
            <Button onClick={handleCreateUser} disabled={createApi.loading}>
              {createApi.loading ? '创建中...' : '创建'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑用户弹窗 */}
      <Dialog
        open={dialogs.edit}
        onOpenChange={open => setDialogs(prev => ({ ...prev, edit: open }))}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>编辑用户</DialogTitle>
            <DialogDescription>修改用户信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-username">用户名</Label>
              <Input
                id="edit-username"
                value={formData.username || ''}
                onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="请输入用户名"
              />
            </div>
            <div>
              <Label htmlFor="edit-email">邮箱</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email || ''}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="请输入邮箱"
              />
            </div>
            <div>
              <Label htmlFor="edit-status">状态</Label>
              <select
                id="edit-status"
                className="w-full h-10 px-3 py-2 text-sm border rounded-md"
                value={formData.is_active ? 'true' : 'false'}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    is_active: e.target.value === 'true',
                  }))
                }
              >
                <option value="true">启用</option>
                <option value="false">禁用</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogs(prev => ({ ...prev, edit: false }))}
            >
              取消
            </Button>
            <Button onClick={handleUpdateUser} disabled={updateApi.loading}>
              {updateApi.loading ? '更新中...' : '更新'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
