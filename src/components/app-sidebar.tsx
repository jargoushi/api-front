'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { GalleryVerticalEnd } from 'lucide-react'

// UI组件导入
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar'

// 配置和类型导入 - 现在没有命名冲突了
import { sidebarConfig, SidebarConfigGroup, SidebarConfigItem } from '@/config/sidebar'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  /**
   * 判断菜单项是否应该展开
   * @param item 主菜单配置项
   * @returns 是否应该展开
   */
  const shouldMenuBeOpen = (item: SidebarConfigGroup): boolean => {
    if (!item.items) return false

    return item.items.some(
      (subItem: SidebarConfigItem) =>
        pathname === subItem.url || (subItem.url !== '#' && pathname.startsWith(subItem.url))
    )
  }

  return (
    <Sidebar {...props}>
      {/* ========== 侧边栏头部 ========== */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">管理系统</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ========== 侧边栏内容区域 ========== */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {sidebarConfig.navMain.map(item => (
              <Collapsible
                key={item.title}
                defaultOpen={shouldMenuBeOpen(item)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      {item.icon && <item.icon className="mr-2 size-4" />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map(subItem => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                              <a href={subItem.url}>
                                {subItem.icon && <subItem.icon className="mr-2 size-4" />}
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* ========== 侧边栏拖拽调整器 ========== */}
      <SidebarRail />
    </Sidebar>
  )
}
