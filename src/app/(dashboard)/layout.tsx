'use client'

import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useBreadcrumb, filterBreadcrumbForDisplay } from '@/utils/breadcrumb'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = useBreadcrumb()
  const displayBreadcrumb = filterBreadcrumbForDisplay(breadcrumb)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          {displayBreadcrumb.length > 0 && (
            <Breadcrumb>
              <BreadcrumbList>
                {displayBreadcrumb.map((item, index) => {
                  const isLast = index === displayBreadcrumb.length - 1
                  const isPlaceholder = item.title === '...'

                  return (
                    <div key={index} className="flex items-center">
                      <BreadcrumbItem className={isPlaceholder ? 'hidden md:block' : ''}>
                        {isLast || isPlaceholder ? (
                          <BreadcrumbPage>{item.title}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
                    </div>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </header>

        {/* 主内容区 */}
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
