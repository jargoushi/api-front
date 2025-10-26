// src/components/business/CrudModule.tsx
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import ModuleHeader from './ModuleHeader'
import SearchForm from '@/components/common/SearchForm'
import DataTable from '@/components/common/DataTable'
import EntityDialog from '@/components/common/EntityDialog'
import Pagination from '@/components/Pagination'
import type { CrudModuleProps, CrudModuleState } from './types'

/**
 * CRUD 模块组件
 * 自包含的业务组件，提供完整的 CRUD 功能
 */
export default function CrudModule<T, TParams, TCreate, TUpdate>({
  config,
  customComponents,
  onDataChange,
  onActionComplete,
}: CrudModuleProps<T, TParams, TCreate, TUpdate>) {
  // ✅ 使用 useMemo 来稳定 API 函数引用
  const apiFunctions = useMemo(() => config.api, [config.api])

  // 初始化状态
  const [state, setState] = useState<CrudModuleState<T, TParams>>({
    data: [],
    loading: false,
    error: null,
    searchParams: config.defaultSearchParams,
    pagination: {
      page: 1,
      size: config.pagination?.defaultSize || 10,
      total: 0,
      pages: 0,
    },
    dialogState: {
      open: false,
      mode: 'create',
      selectedRecord: null,
    },
  })

  // 表单数据
  const [formData, setFormData] = useState<Record<string, unknown>>({})

  // 加载数据
  const loadData = async (params: TParams = state.searchParams) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const result = await apiFunctions.list(params)
      setState(prev => ({
        ...prev,
        data: result.items,
        pagination: {
          page: result.page,
          size: result.size,
          total: result.total,
          pages: result.pages,
        },
        searchParams: params,
        loading: false,
      }))
      onDataChange?.(result.items)
      onActionComplete?.('load', result)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载失败'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
    }
  }

  // 处理搜索
  const handleSearch = () => {
    const searchParams = {
      ...state.searchParams,
      page: 1,
    }
    loadData(searchParams)
    onActionComplete?.('search', searchParams)
  }

  // 重置搜索
  const handleResetSearch = () => {
    const searchParams = { ...config.defaultSearchParams }
    setState(prev => ({ ...prev, searchParams }))
    loadData(searchParams)
    onActionComplete?.('reset', searchParams)
  }

  // 搜索参数变化
  const handleSearchChange = (values: Record<string, unknown>) => {
    setState(prev => ({ ...prev, searchParams: values as TParams }))
  }

  // 分页变化
  const handlePageChange = (page: number) => {
    const params = {
      ...state.searchParams,
      page,
    }
    loadData(params)
  }

  // 分页大小变化
  const handleSizeChange = (size: number) => {
    const params = {
      ...state.searchParams,
      page: 1,
      size,
    }
    loadData(params)
  }

  // 打开新增弹窗
  const handleCreate = () => {
    setFormData({})
    setState(prev => ({
      ...prev,
      dialogState: {
        open: true,
        mode: 'create',
        selectedRecord: null,
      },
    }))
  }

  // 查看详情
  const handleView = async (record: T) => {
    try {
      const recordId = (record as Record<string, unknown>).id as number
      const detail = await apiFunctions.detail(recordId)
      setFormData(detail as Record<string, unknown>)
      setState(prev => ({
        ...prev,
        dialogState: {
          open: true,
          mode: 'view',
          selectedRecord: record,
        },
      }))
      onActionComplete?.('view', detail)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取详情失败'
      setState(prev => ({ ...prev, error: errorMessage }))
    }
  }

  // 编辑
  const handleEdit = async (record: T) => {
    try {
      const recordId = (record as Record<string, unknown>).id as number
      const detail = await apiFunctions.detail(recordId)
      setFormData(detail as Record<string, unknown>)
      setState(prev => ({
        ...prev,
        dialogState: {
          open: true,
          mode: 'edit',
          selectedRecord: record,
        },
      }))
      onActionComplete?.('edit', detail)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取编辑数据失败'
      setState(prev => ({ ...prev, error: errorMessage }))
    }
  }

  // 删除
  const handleDelete = async (record: T) => {
    if (!apiFunctions.delete) return

    if (!confirm('确定要删除这条记录吗？')) return

    try {
      const recordId = (record as Record<string, unknown>).id as number
      await apiFunctions.delete(recordId)
      loadData(state.searchParams)
      onActionComplete?.('delete', record)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除失败'
      setState(prev => ({ ...prev, error: errorMessage }))
    }
  }

  // 弹窗表单提交
  const handleDialogSubmit = async () => {
    const { mode, selectedRecord } = state.dialogState

    try {
      if (mode === 'create') {
        const createData = formData as TCreate
        await apiFunctions.create(createData)
      } else if (mode === 'edit' && selectedRecord) {
        const updateData = formData as TUpdate
        const recordId = (selectedRecord as Record<string, unknown>).id as number
        await apiFunctions.update(recordId, updateData)
      }

      setState(prev => ({
        ...prev,
        dialogState: { ...prev.dialogState, open: false },
      }))
      loadData(state.searchParams)
      onActionComplete?.('submit', { mode, data: formData })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '操作失败'
      setState(prev => ({ ...prev, error: errorMessage }))
    }
  }

  // 弹窗取消
  const handleDialogCancel = () => {
    setState(prev => ({
      ...prev,
      dialogState: { ...prev.dialogState, open: false },
    }))
    setFormData({})
  }

  // 初始加载
  useEffect(() => {
    if (config.defaultSearchParams) {
      loadData(config.defaultSearchParams)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 获取功能开关
  const features = config.features || {}
  const showCreate = features.create !== false
  const showEdit = features.edit !== false
  const showView = features.view !== false
  const showDelete = features.delete !== false
  const showSearch = features.search !== false

  return (
    <div className={'container mx-auto p-6 space-y-6'}>
      {/* 错误提示 */}
      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {state.error}
        </div>
      )}

      {/* 模块头部 */}
      <ModuleHeader
        title={config.title}
        actions={customComponents?.headerActions}
        onCreate={showCreate ? handleCreate : () => {}}
        showCreateButton={showCreate}
        createButtonText={config.texts?.createButtonText}
      />

      {/* 搜索表单 */}
      {showSearch && (
        <>
          {customComponents?.beforeSearch}
          <SearchForm
            fields={config.searchFields}
            values={state.searchParams as Record<string, unknown>}
            onChange={handleSearchChange}
            onSearch={handleSearch}
            onReset={handleResetSearch}
            loading={state.loading}
          />
          {customComponents?.afterSearch}
        </>
      )}

      {/* 数据表格 */}
      {customComponents?.beforeTable}
      <DataTable
        columns={config.tableColumns.map(col => ({
          ...col,
          render: (value: unknown): React.ReactNode => {
            // 自定义渲染逻辑
            if (col.key === 'is_active') {
              const isActive = Boolean(value)
              return (
                <span
                  className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {isActive ? '启用' : '禁用'}
                </span>
              )
            }
            if (
              (col.key === 'created_at' || col.key === 'updated_at') &&
              typeof value === 'string'
            ) {
              return new Date(value).toLocaleString()
            }
            return value as React.ReactNode
          },
        }))}
        data={state.data}
        loading={state.loading}
        actions={{
          view: showView ? handleView : undefined,
          edit: showEdit ? handleEdit : undefined,
          delete: showDelete ? handleDelete : undefined,
        }}
      />
      {customComponents?.tableActions && (
        <div className="mt-4">
          {state.data.map((record, index) => (
            <div key={index}>{customComponents.tableActions!(record)}</div>
          ))}
        </div>
      )}
      {customComponents?.afterTable}

      {/* 分页 */}
      <Pagination
        pagination={state.pagination}
        onPageChange={handlePageChange}
        onSizeChange={handleSizeChange}
        loading={state.loading}
      />

      {/* 实体弹窗 */}
      <EntityDialog
        mode={state.dialogState.mode}
        title={
          state.dialogState.mode === 'create'
            ? `新增${config.title}`
            : state.dialogState.mode === 'edit'
              ? `编辑${config.title}`
              : `${config.title}详情`
        }
        fields={
          state.dialogState.mode === 'create'
            ? config.formFields.create
            : state.dialogState.mode === 'edit'
              ? config.formFields.edit
              : config.formFields.view
        }
        values={formData}
        onChange={setFormData}
        onSubmit={handleDialogSubmit}
        onCancel={handleDialogCancel}
        loading={state.loading}
        open={state.dialogState.open}
      />
    </div>
  )
}
