// Utility để quản lý logs - tự động tắt trong production
const isDevelopment = import.meta.env.VITE_PROD === 'development';

export const logger = {
  log: (...args) => {
    if (isDevelopment) console.log(...args);
  },
  error: (...args) => {
    if (isDevelopment) console.error(...args);
  },
  warn: (...args) => {
    if (isDevelopment) console.warn(...args);
  },
  info: (...args) => {
    if (isDevelopment) console.info(...args);
  },
  debug: (...args) => {
    if (isDevelopment) console.debug(...args);
  }
};

// Tắt tất cả console logs trong production (global)
export const disableConsoleInProduction = () => {
  if (!isDevelopment) {
    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};
    console.info = () => {};
    console.debug = () => {};
    // Giữ console.assert và console.table cho debugging nếu cần
  }
};
