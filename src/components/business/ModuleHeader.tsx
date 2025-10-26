import React from 'react'
import { Button } from '@/components/ui/button'
import type { ModuleHeaderProps } from './types'

/**
 * 模块头部组件
 * 显示模块标题和操作按钮
 */
export default function ModuleHeader({
  title,
  actions,
  onCreate,
  showCreateButton = true,
  createButtonText = '新增',
}: ModuleHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex space-x-2">
        {actions}
        {showCreateButton && <Button onClick={onCreate}>{createButtonText}</Button>}
      </div>
    </div>
  )
}
