// app/users/page.tsx
'use client'

import CrudModule from '@/components/business/CrudModule'
import { userCrudConfig } from '@/config/modules/userCrudConfig'
import { fetchUserList, fetchUserById, createUser, updateUser } from '@/api/user'

/**
 * 用户管理页面
 * 使用 CrudModule 组件，只需要配置即可实现完整功能
 */
export default function UsersPage() {
  // ✅ 直接传递配置，API 函数已经是稳定的引用
  const completeConfig = {
    ...userCrudConfig,
    api: {
      list: fetchUserList,
      detail: fetchUserById,
      create: createUser,
      update: updateUser,
    },
  }

  return <CrudModule config={completeConfig} />
}
