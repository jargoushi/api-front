import React from 'react'
import type { SearchField, TableColumn, FormField, DialogMode } from '../common/types'
import type { PageResponse } from '@/api/types'

/**
 * CRUD 模块配置接口
 * 定义业务模块的完整配置结构
 */
export interface CrudModuleConfig<T, TParams, TCreate, TUpdate> {
  // 基础信息
  title: string

  // API 配置
  api: {
    list: (params: TParams) => Promise<PageResponse<T>>
    detail: (id: number) => Promise<T>
    create: (data: TCreate) => Promise<T>
    update: (id: number, data: TUpdate) => Promise<T>
    delete?: (id: number) => Promise<void>
  }

  // 默认搜索参数
  defaultSearchParams: TParams

  // 搜索表单配置
  searchFields: SearchField[]

  // 表格列配置
  tableColumns: TableColumn<T>[]

  // 表单字段配置
  formFields: {
    create: FormField[]
    edit: FormField[]
    view: FormField[]
  }

  // 分页配置
  pagination?: {
    defaultSize: number
    pageSizeOptions: number[]
  }

  // 功能开关
  features?: {
    search?: boolean
    create?: boolean
    edit?: boolean
    view?: boolean
    delete?: boolean
    export?: boolean
  }

  // 文本配置
  texts?: {
    emptyText?: string
    loadingText?: string
    createButtonText?: string
    searchButtonText?: string
    resetButtonText?: string
  }
}

/**
 * CRUD 模块属性接口
 */
export interface CrudModuleProps<T, TParams, TCreate, TUpdate> {
  config: CrudModuleConfig<T, TParams, TCreate, TUpdate>
  customComponents?: {
    headerActions?: React.ReactNode
    tableActions?: (record: T) => React.ReactNode
    beforeTable?: React.ReactNode
    afterTable?: React.ReactNode
    beforeSearch?: React.ReactNode
    afterSearch?: React.ReactNode
  }
  onDataChange?: (data: T[]) => void
  onActionComplete?: (action: string, result: unknown) => void
}

/**
 * 内部状态接口
 */
export interface CrudModuleState<T, TParams> {
  data: T[]
  loading: boolean
  error: string | null
  searchParams: TParams
  pagination: {
    page: number
    size: number
    total: number
    pages: number
  }
  dialogState: {
    open: boolean
    mode: DialogMode
    selectedRecord: T | null
  }
}

/**
 * 操作类型枚举
 */
export type CrudAction =
  | 'load'
  | 'search'
  | 'reset'
  | 'create'
  | 'edit'
  | 'view'
  | 'update'
  | 'delete'
  | 'cancel'
