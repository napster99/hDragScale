/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === "object" && typeof module === "object")
    module.exports = factory();
  else if (typeof define === "function" && define.amd) define([], factory);
  else if (typeof exports === "object") exports["HanderDragSacle"] = factory();
  else root["HanderDragSacle"] = factory();
})(self, () => {
  return /******/ (() => {
    // webpackBootstrap
    /******/ "use strict";
    /******/ var __webpack_modules__ = {
      /***/ "./src/HanderDragSacle.js":
        /*!********************************!*\
  !*** ./src/HanderDragSacle.js ***!
  \********************************/
        /***/ (
          __unused_webpack_module,
          __webpack_exports__,
          __webpack_require__
        ) => {
          eval(
            '__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst __REGEXP1__ = /matrix\\(|\\)/g;\n\n/**\n * @description 拖动缩放类库\n * @date 2023-11-14\n * @useage\n *\n *      const hds = new HanderDragSacle({\n *        ownerDom: document.getElementById(\'handerWrap\'),\n *        allowDrag: true,\n *        allowScale: true,\n *        extendRate: 10, // ops\n *        extendStep: 800, // ops\n *        scaleOrigin: 1, // ops\n *      });\n *\n *\n */\nclass HanderDragSacle {\n  constructor(options) {\n    this.ownerDom = options.ownerDom;\n    this.allowDrag = options.allowDrag;\n    this.allowScale = options.allowScale;\n    this.extendRate = options.extendRate || 10; // 单位拓展距离\n    this.extendStep = options.extendStep || 800; // 分段因子 越高动画越丝滑\n    this.scaleStep = options.scaleStep || 0.2; // 缩放步长\n    this.scaleOrigin = options.scaleOrigin || 1; // 初始缩放\n\n    console.log("HanderLayout ...", this.ownerDom);\n\n    this.initListener();\n    this.initStyle();\n  }\n\n  eventDataMap = {\n    allMove: false,\n    ox: 0,\n    oy: 0,\n    preX: 0,\n    preY: 0,\n\n    iSpeedX: 0,\n    iSpeedY: 0,\n    lastX: 0,\n    lastY: 0,\n\n    curRealX: 0,\n    curRealY: 0,\n  };\n\n  isElement(ele) {\n    return ele && ele.nodeType === 1;\n  }\n\n  get elementTransformStyle() {\n    if (this.isElement(this.ownerDom)) {\n      const values = this.ownerDom.style.transform\n        .replace(__REGEXP1__, "")\n        .split(",");\n      if (values.length === 6) {\n        return {\n          tx: parseFloat(values[4]),\n          ty: parseFloat(values[5]),\n          ts: parseFloat(values[0]), // 等比缩放\n        };\n      }\n      return { tx: 0, ty: 0, ts: 1 };\n    }\n    return { tx: 0, ty: 0, ts: 1 };\n  }\n\n  initStyle() {\n    if (this.isElement(this.ownerDom)) {\n      this.applyTransform({ realScale: this.scaleOrigin });\n    }\n  }\n\n  initListener() {\n    if (this.allowDrag) {\n      this.bindListener(\n        this.ownerDom,\n        "mousedown",\n        this.dragEvent.mousedown.bind(this)\n      );\n      this.bindListener(\n        this.ownerDom,\n        "mouseup",\n        this.dragEvent.mouseup.bind(this)\n      );\n      this.bindListener(\n        this.ownerDom,\n        "mousemove",\n        this.dragEvent.mousemove.bind(this)\n      );\n    }\n\n    if (this.allowScale) {\n      // todo 浏览器兼容处理\n      this.bindListener(\n        this.ownerDom,\n        "wheel",\n        this.scaleEvent.wheel.bind(this)\n      );\n    }\n  }\n\n  bindListener(ele, eventName, eventFunc) {\n    if (this.isElement(ele)) {\n      // useCapture false 在冒泡阶段执行\n      ele.addEventListener(eventName, eventFunc, false);\n    }\n  }\n\n  dragEvent = {\n    mousedown(ev) {\n      this.eventDataMap.allMove = true;\n      this.eventDataMap.ox = this.eventDataMap.lastX = ev.clientX;\n      this.eventDataMap.oy = this.eventDataMap.lastY = ev.clientY;\n    },\n    mouseup() {\n      this.eventDataMap.allMove = false;\n      const [weakXArr, weakYArr] = this.getDataBySpeed(\n        this.eventDataMap.iSpeedX,\n        this.eventDataMap.iSpeedY\n      );\n      const idexArr = this.getAnimationCoefficient(weakXArr, weakYArr);\n\n      let index = 0;\n      const that = this;\n      function run() {\n        // eslint-disable-next-line no-undef\n        window.requestAnimationFrame(() => {\n          if (index < idexArr.length) {\n            let applyX = weakXArr[idexArr[index]] + that.eventDataMap.curRealX;\n            let applyY = weakYArr[idexArr[index]] + that.eventDataMap.curRealY;\n            if (weakXArr.length === 0) {\n              applyX = that.eventDataMap.curRealX;\n            }\n            if (weakYArr.length === 0) {\n              applyY = that.eventDataMap.curRealY;\n            }\n            index += 1;\n            that.applyTransform({ realX: applyX, realY: applyY });\n            run();\n          } else {\n            // 最后一帧\n            let applyX = weakXArr.pop() + that.eventDataMap.curRealX;\n            let applyY = weakYArr.pop() + that.eventDataMap.curRealY;\n            if (weakXArr.length === 0) {\n              applyX = that.eventDataMap.curRealX;\n            }\n            if (weakYArr.length === 0) {\n              applyY = that.eventDataMap.curRealY;\n            }\n            that.applyTransform({ realX: applyX, realY: applyY }, true); // isLast: true\n            const { tx, ty } = that.elementTransformStyle;\n            that.eventDataMap.iSpeedX = 0;\n            that.eventDataMap.iSpeedY = 0;\n            that.eventDataMap.preY = ty;\n            that.eventDataMap.preX = tx;\n          }\n        });\n      }\n      run();\n    },\n    mousemove(ev) {\n      if (this.eventDataMap.allMove) {\n        const [cx, cy] = [ev.clientX, ev.clientY];\n        const realX = cx - this.eventDataMap.ox + this.eventDataMap.preX;\n        const realY = cy - this.eventDataMap.oy + this.eventDataMap.preY;\n        this.eventDataMap.iSpeedX = cx - this.eventDataMap.lastX;\n        this.eventDataMap.iSpeedY = cy - this.eventDataMap.lastY;\n        this.eventDataMap.lastX = cx;\n        this.eventDataMap.lastY = cy;\n        this.applyTransform({ realX, realY });\n        this.eventDataMap.curRealX = realX;\n        this.eventDataMap.curRealY = realY;\n      }\n    },\n  };\n\n  scaleEvent = {\n    wheel(ev) {\n      if (ev.deltaY === 0) return;\n      console.log(ev);\n      const [cx, cy] = [ev.clientX, ev.clientY];\n      const { ts } = this.elementTransformStyle;\n      const _scaleStep = ev.deltaY < 0 ? -this.scaleStep : this.scaleStep;\n      const lastScale = ts + _scaleStep <= 0 ? 0.1 : ts + _scaleStep; // 最小缩放10倍\n      this.applyTransform({ realScale: lastScale });\n\n      const x = this.ownerDom.offset;\n      console.log("cx, cy", cx, cy);\n      console.log("x::", x);\n    },\n  };\n\n  getAnimationCoefficient(weakXArr, weakYArr) {\n    const maxLen = Math.max(weakXArr.length, weakYArr.length);\n    const indexArr = [];\n    let index = 0;\n    let c = 0;\n    for (let i = 0; i < maxLen; i++) {\n      if (index < maxLen) {\n        indexArr.push(index);\n      } else {\n        break;\n      }\n      index += c;\n      c++;\n    }\n\n    let ri = 0;\n    let iArr = [];\n    for (let i = c; i >= 0; i--) {\n      ri += i;\n      if (ri > maxLen) {\n        ri = maxLen;\n        iArr.push(ri);\n        break;\n      }\n      iArr.push(ri);\n    }\n\n    return iArr;\n  }\n\n  getStepValue(total, step, isNegative) {\n    if (total === 0) return [];\n    const preStep = total / step;\n    const arrs = new Array(parseInt(total / preStep)).fill(preStep);\n    const weakArrs = [];\n    arrs.reduce((pre, item) => {\n      weakArrs.push(isNegative ? -pre : pre);\n      return pre + item;\n    });\n\n    return weakArrs;\n  }\n\n  getDataBySpeed(iSpeedX, iSpeedY) {\n    const extendRate = this.extendRate; // 单位拓展距离\n    const extendStep = this.extendStep; // 分段因子 越高动画越丝滑\n    let _isSpeedX = Math.abs(iSpeedX);\n    let _isSpeedY = Math.abs(iSpeedY);\n    let extendX = _isSpeedX * extendRate; // 拓展距离 X\n    let extendY = _isSpeedY * extendRate; // 拓展距离 Y\n    const weakXArr = this.getStepValue(extendX, extendStep, iSpeedX < 0);\n    const weakYArr = this.getStepValue(extendY, extendStep, iSpeedY < 0);\n\n    return [weakXArr, weakYArr];\n  }\n\n  applyTransform({ realX, realY, realScale }, isLast) {\n    const { tx, ty, ts } = this.elementTransformStyle;\n    if (typeof realScale === "undefined") {\n      realScale = ts;\n    }\n    if (typeof realX === "undefined") {\n      realX = tx;\n      realY = ty;\n    }\n    this.ownerDom.style.transform = `matrix(${realScale}, 0, 0, ${realScale}, ${realX}, ${realY})`;\n    if (isLast) {\n      this.eventDataMap.curRealX = realX;\n      this.eventDataMap.curRealY = realY;\n    }\n  }\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HanderDragSacle);\n\n\n//# sourceURL=webpack://HanderDragSacle/./src/HanderDragSacle.js?'
          );

          /***/
        },

      /******/
    };
    /************************************************************************/
    /******/ // The require scope
    /******/ var __webpack_require__ = {};
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/define property getters */
    /******/ (() => {
      /******/ // define getter functions for harmony exports
      /******/ __webpack_require__.d = (exports, definition) => {
        /******/ for (var key in definition) {
          /******/ if (
            __webpack_require__.o(definition, key) &&
            !__webpack_require__.o(exports, key)
          ) {
            /******/ Object.defineProperty(exports, key, {
              enumerable: true,
              get: definition[key],
            });
            /******/
          }
          /******/
        }
        /******/
      };
      /******/
    })();
    /******/
    /******/ /* webpack/runtime/hasOwnProperty shorthand */
    /******/ (() => {
      /******/ __webpack_require__.o = (obj, prop) =>
        Object.prototype.hasOwnProperty.call(obj, prop);
      /******/
    })();
    /******/
    /******/ /* webpack/runtime/make namespace object */
    /******/ (() => {
      /******/ // define __esModule on exports
      /******/ __webpack_require__.r = (exports) => {
        /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
          /******/ Object.defineProperty(exports, Symbol.toStringTag, {
            value: "Module",
          });
          /******/
        }
        /******/ Object.defineProperty(exports, "__esModule", { value: true });
        /******/
      };
      /******/
    })();
    /******/
    /************************************************************************/
    /******/
    /******/ // startup
    /******/ // Load entry module and return exports
    /******/ // This entry module can't be inlined because the eval devtool is used.
    /******/ var __webpack_exports__ = {};
    /******/ __webpack_modules__["./src/HanderDragSacle.js"](
      0,
      __webpack_exports__,
      __webpack_require__
    );
    /******/
    /******/ return __webpack_exports__;
    /******/
  })();
});
