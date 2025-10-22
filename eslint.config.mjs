import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // 添加 Prettier 配置
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // 关闭所有与 Prettier 冲突的 ESLint 规则
      ...prettierConfig.rules,
      // 将 Prettier 格式化错误作为 ESLint 错误显示
      'prettier/prettier': 'error',
    },
  },
  // 保持原有的忽略配置
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])

export default eslintConfig
