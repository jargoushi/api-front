'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  // 使用 resolvedTheme 避免水合错误
  // resolvedTheme 在客户端挂载后会返回实际的主题
  if (resolvedTheme === undefined) {
    return (
      <button
        className="flex items-center justify-center w-9 h-9 rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
        aria-label="切换主题"
      >
        <div className="h-4 w-4 animate-pulse bg-muted rounded" />
      </button>
    )
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-105"
            aria-label="切换主题"
          >
            <div className="relative h-4 w-4">
              <Sun
                className={`absolute inset-0 h-4 w-4 transition-all duration-300 ${
                  resolvedTheme === 'dark'
                    ? 'rotate-0 scale-100 opacity-100'
                    : 'rotate-90 scale-0 opacity-0'
                }`}
              />
              <Moon
                className={`absolute inset-0 h-4 w-4 transition-all duration-300 ${
                  resolvedTheme === 'dark'
                    ? '-rotate-90 scale-0 opacity-0'
                    : 'rotate-0 scale-100 opacity-100'
                }`}
              />
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>切换到{resolvedTheme === 'dark' ? '浅色' : '深色'}模式</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
