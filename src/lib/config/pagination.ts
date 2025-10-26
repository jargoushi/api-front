/**
 * 分页配置文件
 * 包含分页组件的全局配置选项
 */

// 每页显示条数选项
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const

// 默认每页显示条数
export const DEFAULT_PAGE_SIZE = 10

// 分页配置类型
export interface PaginationConfig {
  pageSizeOptions: readonly number[]
  defaultPageSize: number
}

// 默认分页配置
export const DEFAULT_PAGINATION_CONFIG: PaginationConfig = {
  pageSizeOptions: PAGE_SIZE_OPTIONS,
  defaultPageSize: DEFAULT_PAGE_SIZE,
}

// 导出配置项供组件使用
export { PAGE_SIZE_OPTIONS as pageSizeOptions }
