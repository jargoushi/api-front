import { useState, useCallback } from 'react'

export const useApi = () => {
  const [loading, setLoading] = useState(false)

  const execute = useCallback(async <T>(apiFunction: () => Promise<T>): Promise<T | null> => {
    setLoading(true)
    try {
      const result = await apiFunction()
      return result
    } catch {
      // 错误已经在 request.ts 中通过 toast 显示了
      // 这里返回 null 表示失败，业务代码根据返回值判断
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { execute, loading }
}
