
/**
 * @param {string} path
 * @returns {Boolean}
 */
// 是否为有效url
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
// 身份判定 存在则返回true
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  // indexof判断是否存在,存在则返回大于0,否则返回-1
  return valid_map.indexOf(str.trim()) >= 0
}
