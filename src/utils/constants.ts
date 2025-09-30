// erp_colors.ts
const lightColors = {
  ERP_APP_COLOR: '#251d50',
  ERP_DE_ACTIVE_BUTTON: '#c2bdbdff',
  ERP_REMOVE_BUTTON: '#ff3b30',
  ERP_WHITE: '#FFFFFF',
  ERP_BLACK: '#000000',
  ERP_BORDER: '#e0e0e0',
  ERP_ACTIVE_BACKGROUND: '#f0f8ff',
  ERP_ERROR: '#9d261d',
  ERP_BORDER_LINE: '#ccc',
  ERP_COLOR: '#007bff',
  ERP_ddd: '#ddd',
  ERP_222: '#222',
  ERP_333: '#333',
  ERP_444: '#444',
  ERP_555: '#555',
  ERP_666: '#666',
  ERP_777: '#777',
  ERP_888: '#888',
  ERP_999: '#999',
  ERP_e0e0e0: '#e0e0e0',
  ERP_fafafa: '#fafafa',
  ERP_f0f0f0: '#f0f0f0',
  ERP_007AFF: '#007AFF',
  ERP_1A1A1A: '#1A1A1A',
  ERP_F8F9FA: '#F8F9FA',
  ERP_161515: '#161515',
  ERP_eee: '#eee',
  ERP_6C757D: '#6C757D',
  ERP_green: 'green',
  ERP_ICON: '#FFFFFF'
};

const darkColors = {
  ERP_APP_COLOR: '#1A1A1A',
  ERP_DE_ACTIVE_BUTTON: '#555555',
  ERP_REMOVE_BUTTON: '#ff453a',
  ERP_WHITE: '#000000',
  ERP_BLACK: '#FFFFFF',
  ERP_ICON: '#ffffff',
  ERP_BORDER: '#444444',
  ERP_ACTIVE_BACKGROUND: '#222222',
  ERP_ERROR: '#ff6b6b',
  ERP_BORDER_LINE: '#555555',
  ERP_COLOR: '#0A84FF',
  ERP_ddd: '#444444',
  ERP_222: '#dddddd',
  ERP_333: '#cccccc',
  ERP_444: '#bbbbbb',
  ERP_555: '#aaaaaa',
  ERP_666: '#999999',
  ERP_777: '#888888',
  ERP_888: '#777777',
  ERP_999: '#666666',
  ERP_e0e0e0: '#555555',
  ERP_fafafa: '#1e1e1e',
  ERP_f0f0f0: '#2a2a2a',
  ERP_007AFF: '#0A84FF',
  ERP_1A1A1A: '#2a2a2a',
  ERP_F8F9FA: '#121212',
  ERP_161515: '#222222',
  ERP_eee: '#333333',
  ERP_6C757D: '#aaaaaa',
  ERP_green: '#00c851',
};

let currentTheme: 'light' | 'dark' = 'light';

export const setERPTheme = (theme: 'light' | 'dark') => {
  currentTheme = theme;
};

export const ERP_COLOR_CODE = new Proxy(lightColors, {
  get(target, prop: string) {
    const themeColors = currentTheme === 'light' ? lightColors : darkColors;
    return themeColors[prop as keyof typeof themeColors];
  },
});

export const ERP_SCREEN_NAME = {
  ERP_LOGIN: 'Login',
};

export const ERP_SCREEN_HEADER_TITLE = {};
