import { addons } from 'storybook/manager-api';
import { ThemeVars } from 'storybook/theming';

const shibuiTheme: ThemeVars = {
  base: 'light',
  brandTitle: 'shibui 渋い',
  brandUrl: 'https://lib-ui-b67c5.web.app',
  colorPrimary: '#B85A1E',
  colorSecondary: '#221C16',
  appBg: '#FAF7F4',
  appContentBg: '#FFFFFF',
  appPreviewBg: '#FFFFFF',
  appHoverBg: '#F2EDE6',
  appBorderColor: '#E5DDD3',
  appBorderRadius: 0,
  fontBase: 'system-ui, sans-serif',
  fontCode: '"DM Mono", monospace',
  textColor: '#221C16',
  textMutedColor: '#9A8878',
  textInverseColor: '#FAF7F4',
  barBg: '#FAF7F4',
  barTextColor: '#7A6A5C',
  barSelectedColor: '#B85A1E',
  barHoverColor: '#B85A1E',
  buttonBg: '#F2EDE6',
  buttonBorder: '#E5DDD3',
  booleanBg: '#F2EDE6',
  booleanSelectedBg: '#221C16',
} as ThemeVars;

addons.setConfig({ theme: shibuiTheme });