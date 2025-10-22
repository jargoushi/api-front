'use client'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useEffect, useState } from 'react'

// 定义一个接口来规范数据类型
interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}

export default function Home() {
  const [data, setData] = useState<Todo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 使用 axios 获取一个示例 TODO
    const fetchData = async () => {
      try {
        const response = await axios.get<Todo>('http://127.0.0.1:8000/api/users/1')
        setData(response.data)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">项目搭建成功！</h1>
        <Button>shadcn/ui 按钮测试</Button>

        <div className="mt-8 p-4 border rounded-lg shadow-sm w-96 text-left">
          <h2 className="text-lg font-semibold mb-2">Axios 数据获取测试:</h2>
          {loading ? (
            <p>Loading...</p>
          ) : data ? (
            <pre className="text-sm bg-gray-100 p-2 rounded">
              <code>{JSON.stringify(data, null, 2)}</code>
            </pre>
          ) : (
            <p>Failed to load data.</p>
          )}
        </div>
      </div>
    </main>
  )
}
