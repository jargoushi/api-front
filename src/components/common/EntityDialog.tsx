'use client'

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
import type { EntityDialogProps, FormField } from './types'

/**
 * 通用实体弹窗组件
 * 支持新增、编辑、查看三种模式，根据配置动态生成表单字段
 */
export default function EntityDialog({
  mode,
  title,
  fields,
  values,
  onChange,
  onSubmit,
  onCancel,
  loading = false,
  open,
}: EntityDialogProps) {
  // 获取弹窗描述文本
  const getDialogDescription = (): string => {
    switch (mode) {
      case 'create':
        return '创建新记录'
      case 'edit':
        return '修改现有记录'
      case 'view':
        return '查看记录详情'
      default:
        return ''
    }
  }

  // 获取提交按钮文本
  const getSubmitButtonText = (): string => {
    switch (mode) {
      case 'create':
        return loading ? '创建中...' : '创建'
      case 'edit':
        return loading ? '更新中...' : '更新'
      case 'view':
        return '关闭'
      default:
        return '确定'
    }
  }

  // 处理字段值变化
  const handleFieldChange = (key: string, value: unknown) => {
    onChange({
      ...values,
      [key]: value,
    })
  }

  // 渲染单个表单字段
  const renderField = (field: FormField) => {
    const value = values[field.key]
    const isDisabled = mode === 'view' || field.disabled

    switch (field.type) {
      case 'input':
      case 'email':
        return (
          <Input
            id={`${mode}-${field.key}`}
            type={field.type}
            placeholder={field.placeholder}
            value={(value as string) || ''}
            onChange={e => handleFieldChange(field.key, e.target.value)}
            disabled={isDisabled}
            required={field.required}
          />
        )

      case 'password':
        return (
          <Input
            id={`${mode}-${field.key}`}
            type="password"
            placeholder={field.placeholder}
            value={(value as string) || ''}
            onChange={e => handleFieldChange(field.key, e.target.value)}
            disabled={isDisabled}
            required={field.required}
          />
        )

      case 'select':
        return (
          <select
            id={`${mode}-${field.key}`}
            className="w-full h-10 px-3 py-2 text-sm border rounded-md disabled:opacity-50"
            value={value === null || value === undefined ? '' : String(value)}
            onChange={e => {
              const newValue = e.target.value
              if (newValue === '') {
                handleFieldChange(field.key, null)
              } else if (newValue === 'true' || newValue === 'false') {
                handleFieldChange(field.key, newValue === 'true')
              } else {
                handleFieldChange(field.key, newValue)
              }
            }}
            disabled={isDisabled}
            required={field.required}
          >
            {field.options?.map(option => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              id={`${mode}-${field.key}`}
              type="checkbox"
              checked={Boolean(value)}
              onChange={e => handleFieldChange(field.key, e.target.checked)}
              disabled={isDisabled}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            {field.placeholder && (
              <Label htmlFor={`${mode}-${field.key}`} className="text-sm">
                {field.placeholder}
              </Label>
            )}
          </div>
        )

      case 'textarea':
        return (
          <textarea
            id={`${mode}-${field.key}`}
            placeholder={field.placeholder}
            value={(value as string) || ''}
            onChange={e => handleFieldChange(field.key, e.target.value)}
            disabled={isDisabled}
            required={field.required}
            className="w-full min-h-[80px] px-3 py-2 text-sm border rounded-md disabled:opacity-50 resize-vertical"
          />
        )

      default:
        return (
          <Input
            id={`${mode}-${field.key}`}
            placeholder={field.placeholder}
            value={(value as string) || ''}
            onChange={e => handleFieldChange(field.key, e.target.value)}
            disabled={isDisabled}
            required={field.required}
          />
        )
    }
  }

  // 处理提交
  const handleSubmit = () => {
    if (mode === 'view') {
      onCancel()
    } else {
      onSubmit()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {fields.map(field => (
            <div key={field.key}>
              <Label htmlFor={`${mode}-${field.key}`}>
                {field.label}
                {field.required && mode !== 'view' && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {renderField(field)}
            </div>
          ))}
        </div>
        <DialogFooter>
          {mode !== 'view' && (
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              取消
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={loading}>
            {getSubmitButtonText()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
