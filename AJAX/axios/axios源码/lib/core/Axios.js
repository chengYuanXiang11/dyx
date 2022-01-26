'use strict';

var utils = require('./../utils');
var buildURL = require('../helpers/buildURL');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // 连接拦截器中间件
  // dispatchRequest 转换请求数据 ==> 调用xhrAdapter发请求 ==>请求返回后转换响应数据,返回promise
  // dispatchRequest中处理了请求,因为后面是一组两个取到的，所以要放一个undefined占位
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    // [1,2]先遍历出来 1,2
    // 再unshift [2,1,....]
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    // [1,2]先遍历出来 1,2
    // 再push [....,1,2]

    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  // 最后chain为
  // [
  //   res[1].fulfilled,//请求拦截
  //   res[1].rejected,
  //   res[0].fulfilled,
  //   res[0].rejected,
  //   dispatchRequest,//发请求
  //   undefined,
  //   rej[0].fulfilled,//响应拦截
  //   rej[0].rejected,
  //   rej[1].fulfilled,
  //   rej[1].rejected
  // ]
  while (chain.length) {
    // 取到最开头的那个即先取到成功(res[1].fulfilled,)，再取到失败( res[1].rejected)
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  }; 
});

module.exports = Axios;
