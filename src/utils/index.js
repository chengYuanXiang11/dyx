/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
    url = url == null ? window.location.href : url;
    const search = url.substring(url.lastIndexOf("?") + 1);
    const obj = {};
    const reg = /([^?&=]+)=([^?&=]*)/g;
    search.replace(reg, (rs, $1, $2) => {
        const name = decodeURIComponent($1);
        let val = decodeURIComponent($2);
        val = String(val);
        obj[name] = val;
        return rs;
    });
    return obj;
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
    // returns the byte length of an utf8 string
    let s = str.length;
    for (var i = str.length - 1; i >= 0; i--) {
        const code = str.charCodeAt(i);
        if (code > 0x7f && code <= 0x7ff) s++;
        else if (code > 0x7ff && code <= 0xffff) s += 2;
        if (code >= 0xDC00 && code <= 0xDFFF) i--;
    }
    return s;
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
    const newArray = [];
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
    if (!json) return "";
    return cleanArray(
        Object.keys(json).map(key => {
            if (json[key] === undefined) return "";
            return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
        })
    ).join("&");
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
    if (typeof target !== "object") {
        target = {};
    }
    if (Array.isArray(source)) {
        return source.slice();
    }
    Object.keys(source).forEach(property => {
        const sourceProperty = source[property];
        if (typeof sourceProperty === "object") {
            target[property] = objectMerge(target[property], sourceProperty);
        } else {
            target[property] = sourceProperty;
        }
    });
    return target;
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
    if (type === "start") {
        return new Date().getTime() - 3600 * 1000 * 24 * 90;
    } else {
        return new Date(new Date().toDateString());
    }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(fn, wait, immediate) {
    let timeout;
    let result;

    // 创建一个debounce防抖函数
    let debounced = function () {
        let context = this;
        let args = arguments;

        if (timeout) {
            clearTimeout(timeout);
        }

        if (immediate) {
            let callNow = !timeout;
            timeout = setTimeout(function () {
                timeout = null;
            }, wait);

            if (callNow) {
                result = fn.apply(context, args);
            }
        } else {
            timeout = setTimeout(function () {
                fn.apply(context, args);
            }, wait);
        }

        return result;
    };

    // 防抖函数新增cancel函数
    debounced.cancel = function () {
        console.log('cancel finished!', timeout);
        clearTimeout(timeout);
        timeout = null;
    };

    return debounced;
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
    if (!source && typeof source !== "object") {
        throw new Error("error arguments", "deepClone");
    }
    const targetObj = source.constructor === Array ? [] : {};
    Object.keys(source).forEach(keys => {
        if (source[keys] && typeof source[keys] === "object") {
            targetObj[keys] = deepClone(source[keys]);
        } else {
            targetObj[keys] = source[keys];
        }
    });
    return targetObj;
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
    return Array.from(new Set(arr));
}

/**
 * @returns {string}
 */
export function createUniqueString() {
    const timestamp = +new Date() + "";
    const randomNum = parseInt((1 + Math.random()) * 65536) + "";
    return (+(randomNum + timestamp)).toString(32);
}

// 首字母大小
export function titleCase(str) {
    return str.replace(/( |^)[a-z]/g, L => L.toUpperCase());
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
    if (!str || str == "undefined" || str == "null") {
        return "";
    }
    return str;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
    id = id || "id";
    parentId = parentId || "parentId";
    children = children || "children";
    // 排序
    function NumCompare(a, b) {
        // 数字比较函数
        return a.orderNum - b.orderNum;
    }
    rootId = rootId || Math.min.apply(Math, data.map(item => {
        return item[parentId];
    })) || 0;
    // 对源数据深度克隆
    const cloneData = JSON.parse(JSON.stringify(data));
    // 循环所有项
    const treeData = cloneData.filter(father => {
        const branchArr = cloneData.filter(child => {
            // 返回每一项的子级数组
            return father[id] === child[parentId];
        });
        branchArr.sort(NumCompare);
        branchArr.length > 0 ? father.children = branchArr : "";
        // 返回第一层
        return father[parentId] === rootId || !father[parentId];
    });
    treeData.sort(NumCompare);
    return treeData !== "" ? treeData : data;
}
// 字符串格式化(%s )
export function sprintf(str) {
    var args = arguments;
    var flag = true;
    var i = 1;
    str = str.replace(/%s/g, function () {
        var arg = args[i++];
        if (typeof arg === "undefined") {
            flag = false;
            return "";
        }
        return arg;
    });
    return flag ? str : "";
}
// 数组指定字段排序
export function compare(property) {
    return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
}