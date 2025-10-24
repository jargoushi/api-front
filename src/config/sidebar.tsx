import {
  Home,
  Settings,
  FileText,
  Cpu,
  Users,
  BookOpen,
  Zap,
  Database,
  Shield,
  Globe,
  Code,
  LucideIcon,
} from 'lucide-react'

// 菜单项配置接口定义
export interface SidebarConfigItem {
  title: string
  url: string
  isActive?: boolean
  icon?: LucideIcon
}

// 主菜单配置接口定义
export interface SidebarConfigGroup {
  title: string
  url: string
  icon?: LucideIcon
  items?: SidebarConfigItem[]
}

export const sidebarConfig = {
  navMain: [
    {
      title: '快速开始',
      url: '#',
      icon: Home,
      items: [
        {
          title: '安装指南',
          url: '#',
          icon: Zap,
        },
        {
          title: '项目结构',
          url: '#',
          icon: FileText,
        },
      ],
    },
    {
      title: '应用管理',
      url: '#',
      icon: Settings,
      items: [
        {
          title: '路由管理',
          url: '#',
          icon: Globe,
        },
        {
          title: '数据获取',
          url: '#',
          icon: Database,
        },
      ],
    },
    {
      title: '接口文档',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: '组件库',
          url: '#',
          icon: Code,
        },
        {
          title: '文件规范',
          url: '#',
          icon: FileText,
        },
      ],
    },
    {
      title: '系统架构',
      url: '#',
      icon: Cpu,
      items: [
        {
          title: '无障碍访问',
          url: '#',
          icon: Shield,
        },
      ],
    },
    {
      title: '社区资源',
      url: '#',
      icon: Users,
      items: [
        {
          title: '贡献指南',
          url: '#',
          icon: BookOpen,
        },
      ],
    },
  ],
}
