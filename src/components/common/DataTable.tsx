'use client'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { DataTableProps } from './types'

/**
 * 通用数据表格组件
 * 根据配置动态渲染表格列，支持自定义单元格渲染和操作列
 */
export default function DataTable<T = Record<string, unknown>>({
  columns,
  data,
  loading = false,
  actions,
  emptyText = '暂无数据',
}: DataTableProps<T>) {
  // 渲染单元格内容
  const renderCell = (column: (typeof columns)[0], record: T) => {
    const value = record[column.key as keyof T]

    // 如果有自定义渲染器，使用自定义渲染器
    if (column.render) {
      return column.render(value, record)
    }

    // 默认渲染逻辑
    if (value === null || value === undefined) {
      return '-'
    }

    if (typeof value === 'boolean') {
      return value ? '是' : '否'
    }

    if (typeof value === 'number') {
      return value.toLocaleString()
    }

    if (typeof value === 'string' && value.includes('T') && !isNaN(Date.parse(value))) {
      // 处理 ISO 日期字符串
      return new Date(value).toLocaleString()
    }

    return String(value)
  }

  // 渲染操作列
  const renderActions = (record: T) => {
    if (!actions) {
      return null
    }

    const actionButtons = []

    if (actions.view) {
      actionButtons.push(
        <Button key="view" variant="outline" size="sm" onClick={() => actions.view!(record)}>
          查看
        </Button>
      )
    }

    if (actions.edit) {
      actionButtons.push(
        <Button key="edit" variant="outline" size="sm" onClick={() => actions.edit!(record)}>
          编辑
        </Button>
      )
    }

    if (actions.delete) {
      actionButtons.push(
        <Button
          key="delete"
          variant="outline"
          size="sm"
          onClick={() => actions.delete!(record)}
          className="text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/50"
        >
          删除
        </Button>
      )
    }

    return actionButtons.length > 0 ? <div className="flex space-x-2">{actionButtons}</div> : null
  }

  return (
    <div className="bg-card rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(column => (
              <TableHead key={String(column.key)}>{column.label}</TableHead>
            ))}
            {actions && <TableHead>操作</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-8">
                加载中...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-8">
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            data.map((record, index) => (
              <TableRow key={index}>
                {columns.map(column => (
                  <TableCell key={String(column.key)}>{renderCell(column, record)}</TableCell>
                ))}
                {actions && <TableCell>{renderActions(record)}</TableCell>}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
