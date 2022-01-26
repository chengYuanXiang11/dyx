let seed = 1;
import { createVNode, render } from "vue";

import Main from "./index.vue";
let MessageConstructor = createVNode(Main);
console.log(MessageConstructor);
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
class Message {
  constructor() {
    this.instance = null;
    this.instances = [];
    this.id = 0;
  }
  add(options) {
    let verticalOffset = options.offset || 20;
    const props = __spreadProps(__spreadValues({
      offset: verticalOffset
    }, options), {
      seed,
 
    });
    if (!this.instance) {
      this.instance = createVNode(Main,props);
    }
    
    this.instance.id = this.id++;
    const container = document.createElement("div");
    container.className = `container_${seed++}`;
    render(this.instance, container);
    this.instances.push(this.instance);
    document.body.appendChild(container.firstElementChild);
    // setTimeout(() => {
    //   this.close(this.id);
    // }, options.duration);
    return this.instance; 
  }
  close(id, userOnClose) {
    let len = this.instances.length;
    let index = -1;
    let removedHeight;
    for (let i = 0; i < len; i++) {
      if (id === this.instances[i].id) {
        removedHeight = this.instances[i].$el.offsetHeight;
        index = i;
        if (typeof userOnClose === "function") {
          userOnClose(this.instances[i]);
        }
        console.log(id, this.instances[i].$el);
        this.instances[i].$el.closed = false;
        this.instances.splice(i, 1);
        break;
      }
    }
    if (len <= 1 || index === -1 || index > this.instances.length - 1) return;
    for (let i = index; i < len - 1; i++) {
      let dom = this.instances[i].$el;
      dom.style["top"] =
        parseInt(dom.style["top"], 10) - removedHeight - 16 + "px";
    }
  }

  get() {
    return this.instance;
  }
}
export const withInstallFunction = (fn, name) => {
  fn.install = (app) => {
    app.config.globalProperties[name] = fn;
  };
  return fn;
};
const ElMessage = withInstallFunction(new Message(), "$message");
export default ElMessage;
