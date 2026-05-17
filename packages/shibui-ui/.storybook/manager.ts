import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const shibuiTheme = create({
  base: 'light',
  brandTitle: 'shibui 渋い',
  brandUrl: 'https://lib-ui-b67c5.web.app',

  // Brand
  colorPrimary:   '#B85A1E',  // kaki-500
  colorSecondary: '#221C16',  // washi-900

  // UI shell backgrounds
  appBg:        '#FAF7F4',    // washi-50
  appContentBg: '#FFFFFF',
  appPreviewBg: '#FFFFFF',
  appHoverBg:   '#F2EDE6',    // washi-100

  // Borders
  appBorderColor:  '#E5DDD3', // washi-200
  appBorderRadius: 0,

  // Typography
  fontBase: '"Shippori Mincho", serif',
  fontCode: '"DM Mono", monospace',

  // Text
  textColor:        '#221C16', // washi-900
  textMutedColor:   '#9A8878', // washi-500
  textInverseColor: '#FAF7F4', // washi-50

  // Navigation bar
  barBg:            '#FAF7F4', // washi-50
  barTextColor:     '#7A6A5C', // washi-600
  barSelectedColor: '#B85A1E', // kaki-500
  barHoverColor:    '#B85A1E',

  // Buttons
  buttonBg:     '#F2EDE6',    // washi-100
  buttonBorder: '#E5DDD3',    // washi-200

  // Booleans (toggle controls)
  booleanBg:         '#F2EDE6', // washi-100
  booleanSelectedBg: '#221C16', // washi-900

  // Input controls (Controls panel + Docs arg tables)
  inputBg:           '#FFFFFF',
  inputBorder:       '#E5DDD3', // washi-200
  inputTextColor:    '#221C16', // washi-900
  inputBorderRadius: 0,
});

addons.setConfig({ theme: shibuiTheme });