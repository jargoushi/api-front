'use client'

import { usePathname } from 'next/navigation'
import { sidebarConfig, SidebarConfigItem } from '@/config/sidebar'

// 面包屑项类型定义
export interface BreadcrumbItem {
  title: string
  url: string
}

/**
 * 根据当前路径生成面包屑数据
 * @param pathname 当前路径
 * @returns 面包屑数据数组
 */
export function generateBreadcrumb(pathname: string): BreadcrumbItem[] {
  const breadcrumb: BreadcrumbItem[] = []

  // 特殊处理 dashboard 路径
  if (pathname === '/dashboard') {
    breadcrumb.push({
      title: '仪表盘',
      url: '/dashboard',
    })
    return breadcrumb
  }

  // 遍历侧边栏配置
  for (const group of sidebarConfig.navMain) {
    // 检查子菜单是否匹配当前路径
    if (group.items && group.items.length > 0) {
      for (const item of group.items) {
        if (pathname === item.url) {
          // 先添加主菜单
          breadcrumb.push({
            title: group.title,
            url: group.url === '#' ? '#' : group.url,
          })
          // 再添加子菜单
          breadcrumb.push({
            title: item.title,
            url: item.url,
          })
          return breadcrumb // 找到匹配后就直接返回
        }
      }
    }

    // 检查主菜单是否匹配（非 # 的情况）
    if (pathname === group.url && group.url !== '#') {
      breadcrumb.push({
        title: group.title,
        url: group.url,
      })
      break // 找到匹配的主菜单后就退出循环
    }
  }

  // 如果没有匹配到任何配置，返回默认面包屑
  if (breadcrumb.length === 0) {
    breadcrumb.push({
      title: '首页',
      url: '/dashboard',
    })
  }

  return breadcrumb
}

/**
 * 获取当前页面的面包屑数据
 * @returns 面包屑数据数组
 */
export function useBreadcrumb(): BreadcrumbItem[] {
  const pathname = usePathname()
  return generateBreadcrumb(pathname)
}

/**
 * 过滤面包屑数据，用于响应式显示
 * @param breadcrumb 面包屑数据
 * @param maxItems 最大显示数量
 * @returns 过滤后的面包屑数据
 */
export function filterBreadcrumbForDisplay(
  breadcrumb: BreadcrumbItem[],
  maxItems: number = 3
): BreadcrumbItem[] {
  if (breadcrumb.length <= maxItems) {
    return breadcrumb
  }

  // 保留第一个、中间的省略号、最后两个
  return [breadcrumb[0], { title: '...', url: '#' }, ...breadcrumb.slice(-2)]
}
