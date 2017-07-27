import objectAssign from 'object-assign';
import axios from 'axios';
import qs from 'querystring';
import { HashLocation } from 'react-router';

let api;
const rest = function (url, ...val) {
  val.forEach((v) => {
    if (Array.isArray(v)) {
      v.forEach((i) => {
        url += `/${i}`;
      });
    } else {
      url += `/ ${v}`;
    }
  });
  return url;
};

/**
 * 设置请求参数
 * @param {object} obj
 * @param {object} params
 * @return {object} axios的ajax请求对象
 */

const assignParams = function (obj, params) {
  if (obj.isFormData && ['post', 'put', 'patch'].indexOf(obj.method) >= 0) {
    obj.data = qs.stringify(params);
  } else if (['get', 'delete', 'head'].indexOf(obj.method) >= 0) {
    obj.url = `${obj.url}?${qs.stringify(params)}`;
  } else {
    obj.data = params;
  }
  return obj;
};
const requestApi = function (obj, params, otherParams) {
  if (obj.method == null) {
    obj.method = 'get';
  }
  if (params) {
    if (Array.isArray(params)) {
      obj.url = rest(obj.url, params);
      if (otherParams) {
        /**
         * ajax请求
         * @param {object} obj
         * @param {object|array} params
         * @param {object} otherParams
         * @return {Promise<R>|Promise.<T>}
         */
        obj = assignParams(obj, otherParams);
      }
    } else {
      obj = assignParams(obj, params);
    }
  }
  const p = axios.request(obj);
  return Promise.resolve(p).then(v => new Promise((resolve, reject) => {
    if (v.data.code !== 2 && v.data.code) {
      console.error("状态有误",v.data,obj.url)
      return;
    }
    if (api.defaultErrorHandler) {
      const handleResult = api.defaultErrorHandler(v.data);
      if (!handleResult) {
        return;
      }
    }
    resolve(v);
  })).catch(err => new Promise((resolve, reject) => {
    reject(err);
  }));
};
const requestApi2 = function (obj, params, otherParams) {
  const p = requestApi(obj, params, otherParams);
  return Promise.resolve(p).then(v => new Promise((resolve, reject) => {
    if (v.data.success) {
      resolve(v.data);
    } else {
      if (api.defaultErrorHandler) {
        const handleResult = api.defaultErrorHandler(v.data);
        if (!handleResult) {
          return;
        }
      }
      reject(v.data);
    }
  })).catch(err => new Promise((resolve, reject) => {
    reject(err);
  }));
};
const defineReq = function (obj, commonSettings) {
  if (obj.url) {
    obj = objectAssign({}, obj, commonSettings);
    obj.request = (params, otherParams) =>
      /**
       * 发送ajax请求
       * @param {object} obj
       * @param {object|array} params
       * @param {object} otherParams
       * @return {Promise<R>}
       */
       requestApi(objectAssign({}, obj), params, otherParams);
    obj.req = (params, otherParams) => requestApi2(objectAssign({}, obj), params, otherParams);
  }
  /* eslint-disable no-restricted-syntax*/
  for (const property in obj) {
    /*eslint-disable */
    if (obj.hasOwnProperty(property) && typeof obj[property] === 'object') {
      obj[property] = defineReq(obj[property], commonSettings);
    }
  }
  return obj;
};


/**
 * Created by wuhao on 2017/1/16.
 */

const defineApi = function (apiObj, commonSettings) {
  const newObj = objectAssign({}, apiObj);
  api = defineReq(newObj, commonSettings);
  return api;
};
module.exports.define = defineApi;
