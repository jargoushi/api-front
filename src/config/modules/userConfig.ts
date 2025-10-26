import type { SearchField, TableColumn, FormField } from '@/components/common/types'
import type { UserResponse } from '@/api/user/types'

/**
 * 用户模块配置
 * 定义用户管理页面的搜索表单、表格列、表单字段等配置
 */

// 搜索字段配置
export const searchFields: SearchField[] = [
  {
    key: 'username',
    label: '用户名',
    type: 'input',
    placeholder: '请输入用户名',
  },
  {
    key: 'email',
    label: '邮箱',
    type: 'email',
    placeholder: '请输入邮箱',
  },
  {
    key: 'is_active',
    label: '状态',
    type: 'select',
    options: [
      { label: '全部', value: '' },
      { label: '启用', value: true },
      { label: '禁用', value: false },
    ],
  },
]

// 表格列配置
export const tableColumns: Omit<TableColumn<UserResponse>, 'render'>[] = [
  {
    key: 'id',
    label: 'ID',
  },
  {
    key: 'username',
    label: '用户名',
  },
  {
    key: 'email',
    label: '邮箱',
  },
  {
    key: 'is_active',
    label: '状态',
  },
  {
    key: 'created_at',
    label: '创建时间',
  },
]

// 新增表单字段配置
export const createFormFields: FormField[] = [
  {
    key: 'username',
    label: '用户名',
    type: 'input',
    required: true,
    placeholder: '请输入用户名',
  },
  {
    key: 'email',
    label: '邮箱',
    type: 'email',
    required: true,
    placeholder: '请输入邮箱',
  },
  {
    key: 'password',
    label: '密码',
    type: 'password',
    required: true,
    placeholder: '请输入密码',
  },
]

// 编辑表单字段配置
export const editFormFields: FormField[] = [
  {
    key: 'username',
    label: '用户名',
    type: 'input',
    required: true,
    placeholder: '请输入用户名',
  },
  {
    key: 'email',
    label: '邮箱',
    type: 'email',
    required: true,
    placeholder: '请输入邮箱',
  },
  {
    key: 'is_active',
    label: '状态',
    type: 'select',
    required: true,
    options: [
      { label: '启用', value: true },
      { label: '禁用', value: false },
    ],
  },
]

// 查看表单字段配置
export const viewFormFields: FormField[] = [
  {
    key: 'id',
    label: 'ID',
    type: 'input',
    disabled: true,
  },
  {
    key: 'username',
    label: '用户名',
    type: 'input',
    disabled: true,
  },
  {
    key: 'email',
    label: '邮箱',
    type: 'email',
    disabled: true,
  },
  {
    key: 'is_active',
    label: '状态',
    type: 'select',
    disabled: true,
    options: [
      { label: '启用', value: true },
      { label: '禁用', value: false },
    ],
  },
  {
    key: 'created_at',
    label: '创建时间',
    type: 'input',
    disabled: true,
  },
]

// 用户模块配置对象
export const userConfig = {
  name: '用户',
  searchFields,
  tableColumns,
  formFields: {
    create: createFormFields,
    edit: editFormFields,
    view: viewFormFields,
  },
}
