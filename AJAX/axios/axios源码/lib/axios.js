'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
//创建一个axios对象
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);
  // bind的返回的是个闭包函数wrap，使不同axios实例之间可以隔离作用域。
  // 所有的请求[axios, axios.get, axios.post等...]内部调用的都是Axios.prototype.request。


  // 将Axios原型对象上的方法拷贝到instance:request()/get()/post()
  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // 将Axios实例对象上的方法拷贝到instance:defaults,interceptors属性
  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// 创建要导出的默认实例
var axios = createInstance(defaults);

// 公开Axios类以允许类继承
axios.Axios = Axios;

// 用于创建新实例的工厂
axios.create = function create(instanceConfig) {
                      //合并两个配置对象(默认配置对象和自定义配置对象)
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken 取消请求方法
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

// Expose isAxiosError
axios.isAxiosError = require('./helpers/isAxiosError');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;
