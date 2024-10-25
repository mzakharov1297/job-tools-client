import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

const vueTsConfig = vueTsEslintConfig().map(config => {
  return {
      ...config,
  rules: {
    "@typescript-eslint/no-explicit-any": "warn"
  },
    files:
      config.files && config.files.length > 0
        ? config.files
        : ['**/*.{vue,ts,tsx,js,jsx,html}'],
  }
})

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },
  ...pluginVue.configs['flat/essential'],
  ...vueTsConfig,
  skipFormatting,
]
