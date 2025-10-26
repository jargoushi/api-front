import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { pageSizeOptions } from '@/lib/config/pagination'

interface PaginationProps {
  pagination: {
    page: number
    size: number
    total: number
    pages: number
  }
  onPageChange: (page: number) => void
  onSizeChange: (size: number) => void
  loading?: boolean
  className?: string
}

// 生成页码的辅助函数
const generatePageNumbers = (currentPage: number, totalPages: number): (number | string)[] => {
  const pages: (number | string)[] = []

  if (totalPages > 0) pages.push(1)

  let startPage = Math.max(2, currentPage - 2)
  let endPage = Math.min(totalPages - 1, currentPage + 2)

  if (currentPage <= 3) {
    startPage = 2
    endPage = Math.min(totalPages - 1, 5)
  }

  if (currentPage >= totalPages - 2) {
    startPage = Math.max(2, totalPages - 4)
    endPage = totalPages - 1
  }

  if (startPage > 2) pages.push('...')

  for (let i = startPage; i <= endPage; i++) {
    if (i > 1 && i < totalPages) pages.push(i)
  }

  if (endPage < totalPages - 1) pages.push('...')

  if (totalPages > 1) pages.push(totalPages)

  return pages
}

export default function Pagination({
  pagination,
  onPageChange,
  onSizeChange,
  loading = false,
  className = '',
}: PaginationProps) {
  const { page, size, total, pages } = pagination

  // 只有大于1页或有数据时才显示
  if (pages <= 1 && total === 0) {
    return null
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* 左侧：分页控件 */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || loading}
        >
          上一页
        </Button>

        {/* 页码显示 */}
        <div className="flex items-center space-x-1">
          {generatePageNumbers(page, pages).map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                  ...
                </span>
              )
            }

            return (
              <Button
                key={pageNum}
                variant={pageNum === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(pageNum as number)}
                disabled={loading}
                className="w-8 h-8 p-0"
              >
                {pageNum}
              </Button>
            )
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages || loading}
        >
          下一页
        </Button>

        {/* 每页显示条数选择器 */}
        <div className="flex items-center space-x-2 ml-4">
          <span className="text-sm text-muted-foreground">每页</span>
          <select
            value={size}
            onChange={e => onSizeChange(parseInt(e.target.value))}
            disabled={loading}
            className="h-8 px-2 text-sm border rounded-md"
          >
            {pageSizeOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="text-sm text-muted-foreground">条</span>
        </div>

        {/* 跳转到指定页码 */}
        <div className="flex items-center space-x-2 ml-4">
          <span className="text-sm text-muted-foreground">跳至</span>
          <Input
            type="number"
            min={1}
            max={pages}
            defaultValue={page}
            disabled={loading}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const newPage = parseInt((e.target as HTMLInputElement).value)
                if (newPage >= 1 && newPage <= pages) {
                  onPageChange(newPage)
                  ;(e.target as HTMLInputElement).value = page.toString()
                }
              }
            }}
            onBlur={e => {
              // 失焦时恢复当前页码
              e.target.value = page.toString()
            }}
            className="w-16 h-8 text-sm"
            placeholder="页"
          />
          <span className="text-sm text-muted-foreground">页</span>
        </div>
      </div>

      {/* 右侧：记录统计 */}
      <div className="text-sm text-muted-foreground">
        共 {total} 条记录，第 {page} / {pages} 页
      </div>
    </div>
  )
}
