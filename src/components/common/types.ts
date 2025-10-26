/**
 * 通用组件类型定义
 * 为搜索表单、数据表格、实体弹窗等组件提供统一的类型支持
 */

// 搜索字段类型
export interface SearchField {
  key: string
  label: string
  type: 'input' | 'email' | 'select' | 'date'
  placeholder?: string
  options?: Array<{ label: string; value: string | number | boolean }>
}

// 表格列类型
export interface TableColumn<T = unknown> {
  key: keyof T | string
  label: string
  render?: (value: unknown, record: T) => React.ReactNode
}

// 表单字段类型
export interface FormField {
  key: string
  label: string
  type: 'input' | 'email' | 'password' | 'select' | 'checkbox' | 'textarea'
  required?: boolean
  placeholder?: string
  options?: Array<{ label: string; value: string | number | boolean }>
  disabled?: boolean
}

// 搜索表单属性类型
export interface SearchFormProps {
  fields: SearchField[]
  values: Record<string, unknown>
  onChange: (values: Record<string, unknown>) => void
  onSearch: () => void
  onReset: () => void
  loading?: boolean
}

// 数据表格属性类型
export interface DataTableProps<T = unknown> {
  columns: TableColumn<T>[]
  data: T[]
  loading?: boolean
  actions?: {
    view?: (record: T) => void
    edit?: (record: T) => void
    delete?: (record: T) => void
  }
  emptyText?: string
}

// 实体弹窗模式类型
export type DialogMode = 'create' | 'edit' | 'view'

// 实体弹窗属性类型
export interface EntityDialogProps {
  mode: DialogMode
  title: string
  fields: FormField[]
  values: Record<string, unknown>
  onChange: (values: Record<string, unknown>) => void
  onSubmit: () => void
  onCancel: () => void
  loading?: boolean
  open: boolean
}

// 表格行操作按钮类型
export interface ActionButton<T = Record<string, unknown>> {
  key: string
  label: string
  onClick: (record: T) => void
  disabled?: (record: T) => boolean
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

// 扩展的数据表格属性类型，支持自定义操作按钮
export interface DataTableExtendedProps<T = unknown> extends Omit<DataTableProps<T>, 'actions'> {
  customActions?: ActionButton<T>[]
}
