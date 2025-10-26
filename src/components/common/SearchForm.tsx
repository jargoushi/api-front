'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { SearchField, SearchFormProps } from './types'

/**
 * 通用搜索表单组件
 * 根据配置动态生成搜索表单，支持多种输入类型
 */
export default function SearchForm({
  fields,
  values,
  onChange,
  onSearch,
  onReset,
  loading = false,
}: SearchFormProps) {
  // 处理字段值变化
  const handleFieldChange = (key: string, value: unknown) => {
    onChange({
      ...values,
      [key]: value,
    })
  }

  // 渲染单个搜索字段
  const renderField = (field: SearchField) => {
    const value = values[field.key]

    switch (field.type) {
      case 'input':
      case 'email':
        return (
          <Input
            id={`search-${field.key}`}
            type={field.type}
            placeholder={field.placeholder}
            value={(value as string) || ''}
            onChange={e => handleFieldChange(field.key, e.target.value || null)}
          />
        )

      case 'select':
        return (
          <select
            id={`search-${field.key}`}
            className="w-full h-10 px-3 py-2 text-sm border rounded-md bg-background text-foreground"
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
          >
            {field.options?.map(option => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'date':
        return (
          <Input
            id={`search-${field.key}`}
            type="date"
            value={(value as string) || ''}
            onChange={e => handleFieldChange(field.key, e.target.value || null)}
          />
        )

      default:
        return (
          <Input
            id={`search-${field.key}`}
            placeholder={field.placeholder}
            value={(value as string) || ''}
            onChange={e => handleFieldChange(field.key, e.target.value || null)}
          />
        )
    }
  }

  return (
    <div className="bg-card p-4 rounded-lg border space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {fields.map(field => (
          <div key={field.key}>
            <Label htmlFor={`search-${field.key}`}>{field.label}</Label>
            {renderField(field)}
          </div>
        ))}

        <div className="flex items-end space-x-2">
          <Button onClick={onSearch} disabled={loading}>
            搜索
          </Button>
          <Button variant="outline" onClick={onReset} disabled={loading}>
            重置
          </Button>
        </div>
      </div>
    </div>
  )
}
