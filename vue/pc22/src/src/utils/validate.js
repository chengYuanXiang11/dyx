/**
 * 判断字符串是否https?:|mailto:|tel:开头
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * 验证用户名
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
    const valid_map = ["admin", "editor"];
    return valid_map.indexOf(str.trim()) >= 0;
}

/**
 * 验证url地址
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
    const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return reg.test(url);
}

/**
 * 验证是否小写字母
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
    const reg = /^[a-z]+$/;
    return reg.test(str);
}

/**
 * 验证是否大写字母
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
    const reg = /^[A-Z]+$/;
    return reg.test(str);
}

/**
 * 验证是否字母
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
    const reg = /^[A-Za-z]+$/;
    return reg.test(str);
}

/**
 * 验证邮箱
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
}

/**
 * 验证是否字符串
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
    if (typeof str === "string" || str instanceof String) {
        return true;
    }
    return false;
}

/**
 * 验证是否数组
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
    if (typeof Array.isArray === "undefined") {
        return Object.prototype.toString.call(arg) === "[object Array]";
    }
    return Array.isArray(arg);
}

export function isNumberStr(str) {
    return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str);
}

// 是否函数
export const isFunction = (o) => {
    return Object.prototype.toString.call(o).slice(8, -1) === "Function";
};

// 是否对象
export const isObj = (o) => {
    return Object.prototype.toString.call(o).slice(8, -1) === "Object";
};

export const isTel = (rule, value, callback) => {

    if (value === "") {

        callback(new Error("请输入手机号"));

    } else {

        if (!/^1[3456789]\d{9}$/.test(value)) {

            callback(new Error("请输入正确的手机号"));

        } else {

            callback();

        }

    }

};