import {
  UserResponse,
  UserListParams,
  UserCreateRequest,
  UserUpdateRequest,
} from '@/api/user/types'
import type { CrudModuleConfig } from '@/components/business/types'

/**
 * 用户模块配置
 * 使用 CrudModule 的完整配置
 * 注意：API 函数在页面中动态注入
 */
export const userCrudConfig: Omit<
  CrudModuleConfig<UserResponse, UserListParams, UserCreateRequest, UserUpdateRequest>,
  'api'
> = {
  title: '用户管理',

  // 默认搜索参数
  defaultSearchParams: {
    page: 1,
    size: 10,
    username: null,
    email: null,
    is_active: null,
  },

  // 搜索表单配置
  searchFields: [
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
  ],

  // 表格列配置
  tableColumns: [
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
  ],

  // 表单字段配置
  formFields: {
    create: [
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
    ],
    edit: [
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
    ],
    view: [
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
    ],
  },

  // 分页配置
  pagination: {
    defaultSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
  },

  // 功能开关
  features: {
    search: true,
    create: true,
    edit: false,
    view: true,
    delete: false, // 暂时禁用删除功能
    export: false,
  },

  // 文本配置
  texts: {
    emptyText: '暂无用户数据',
    loadingText: '加载中...',
    createButtonText: '新增用户',
    searchButtonText: '搜索',
    resetButtonText: '重置',
  },
}
