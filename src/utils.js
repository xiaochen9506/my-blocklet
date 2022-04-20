// 创世target
// eslint-disable-next-line no-restricted-properties
const CreationTarget = Number('0x00ffff') * Math.pow(256, 26);

// 计算当前target
export const getTarget = (bits) => {
  const hex = bits.toString(16);
  const exponent = hex.slice(0, 2);
  const coefficient = hex.slice(2);
  // eslint-disable-next-line no-restricted-properties
  return Number(`0x${coefficient}`) * Math.pow(256, Number(`0x${exponent}`) - 3);
};

// 计算难度值 = 创世target / 当前target
export const getDifficulty = (bits) => {
  return CreationTarget / getTarget(bits);
};

// 数字格式化
export const numberFormat = (number) => {
  if (number.toString().includes('.')) return number.toLocaleString();
  return number.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
};

// 获取类型
export const getType = (arg) => Object.prototype.toString.call(arg).toLowerCase().slice(8, -1);

/**
 * 转换成btc
 * @param number 数值
 * @param symbol 单位
 * @returns {string}
 */
export const toBTC = (number, symbol = 'BTC') => {
  const str = (number / 100000000).toFixed(8);
  const dotIndex = str.indexOf('.');

  if (dotIndex !== -1) {
    return `${numberFormat(str.slice(0, dotIndex))}${str.slice(dotIndex)} ${symbol}`;
  }
  return `${str} ${symbol}`;
};

// eslint-disable-next-line no-extend-native
export const dateFormat = (date, fmt) => {
  let str = fmt;
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    str = str.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length));
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      str = str.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length));
    }
  }
  return str;
};
