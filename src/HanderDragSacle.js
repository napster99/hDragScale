const __REGEXP1__ = /matrix\(|\)/g;

/**
 * @description 拖动缩放类库
 * @date 2023-11-14
 * @useage
 *
 *      const hds = new HanderDragSacle({
 *        ownerDom: document.getElementById('handerWrap'),
 *        allowDrag: true,
 *        allowScale: true,
 *        extendRate: 10, // ops
 *        extendStep: 800, // ops
 *        scaleOrigin: 1, // ops
 *      });
 *
 *
 */
class HanderDragSacle {
  constructor(options) {
    this.ownerDom = options.ownerDom;
    this.allowDrag = options.allowDrag;
    this.allowScale = options.allowScale;
    this.extendRate = options.extendRate || 10; // 单位拓展距离
    this.extendStep = options.extendStep || 800; // 分段因子 越高动画越丝滑
    this.scaleStep = options.scaleStep || 0.2; // 缩放步长
    this.scaleOrigin = options.scaleOrigin || 1; // 初始缩放

    console.log("HanderLayout ...", this.ownerDom);

    this.initListener();
    this.initStyle();
  }

  eventDataMap = {
    allMove: false,
    ox: 0,
    oy: 0,
    preX: 0,
    preY: 0,

    iSpeedX: 0,
    iSpeedY: 0,
    lastX: 0,
    lastY: 0,

    curRealX: 0,
    curRealY: 0,
  };

  isElement(ele) {
    return ele && ele.nodeType === 1;
  }

  get elementTransformStyle() {
    if (this.isElement(this.ownerDom)) {
      const values = this.ownerDom.style.transform
        .replace(__REGEXP1__, "")
        .split(",");
      if (values.length === 6) {
        return {
          tx: parseFloat(values[4]),
          ty: parseFloat(values[5]),
          ts: parseFloat(values[0]), // 等比缩放
        };
      }
      return { tx: 0, ty: 0, ts: 1 };
    }
    return { tx: 0, ty: 0, ts: 1 };
  }

  initStyle() {
    if (this.isElement(this.ownerDom)) {
      this.applyTransform({ realScale: this.scaleOrigin });
    }
  }

  initListener() {
    if (this.allowDrag) {
      this.bindListener(
        this.ownerDom,
        "mousedown",
        this.dragEvent.mousedown.bind(this)
      );
      this.bindListener(
        this.ownerDom,
        "mouseup",
        this.dragEvent.mouseup.bind(this)
      );
      this.bindListener(
        this.ownerDom,
        "mousemove",
        this.dragEvent.mousemove.bind(this)
      );
    }

    if (this.allowScale) {
      // todo 浏览器兼容处理
      this.bindListener(
        this.ownerDom,
        "wheel",
        this.scaleEvent.wheel.bind(this)
      );
    }
  }

  bindListener(ele, eventName, eventFunc) {
    if (this.isElement(ele)) {
      // useCapture false 在冒泡阶段执行
      ele.addEventListener(eventName, eventFunc, false);
    }
  }

  dragEvent = {
    mousedown(ev) {
      this.eventDataMap.allMove = true;
      this.eventDataMap.ox = this.eventDataMap.lastX = ev.clientX;
      this.eventDataMap.oy = this.eventDataMap.lastY = ev.clientY;
    },
    mouseup() {
      this.eventDataMap.allMove = false;
      const [weakXArr, weakYArr] = this.getDataBySpeed(
        this.eventDataMap.iSpeedX,
        this.eventDataMap.iSpeedY
      );
      const idexArr = this.getAnimationCoefficient(weakXArr, weakYArr);

      let index = 0;
      const that = this;
      function run() {
        // eslint-disable-next-line no-undef
        window.requestAnimationFrame(() => {
          if (index < idexArr.length) {
            let applyX = weakXArr[idexArr[index]] + that.eventDataMap.curRealX;
            let applyY = weakYArr[idexArr[index]] + that.eventDataMap.curRealY;
            if (weakXArr.length === 0) {
              applyX = that.eventDataMap.curRealX;
            }
            if (weakYArr.length === 0) {
              applyY = that.eventDataMap.curRealY;
            }
            index += 1;
            that.applyTransform({ realX: applyX, realY: applyY });
            run();
          } else {
            // 最后一帧
            let applyX = weakXArr.pop() + that.eventDataMap.curRealX;
            let applyY = weakYArr.pop() + that.eventDataMap.curRealY;
            if (weakXArr.length === 0) {
              applyX = that.eventDataMap.curRealX;
            }
            if (weakYArr.length === 0) {
              applyY = that.eventDataMap.curRealY;
            }
            that.applyTransform({ realX: applyX, realY: applyY }, true); // isLast: true
            const { tx, ty } = that.elementTransformStyle;
            that.eventDataMap.iSpeedX = 0;
            that.eventDataMap.iSpeedY = 0;
            that.eventDataMap.preY = ty;
            that.eventDataMap.preX = tx;
          }
        });
      }
      run();
    },
    mousemove(ev) {
      if (this.eventDataMap.allMove) {
        const [cx, cy] = [ev.clientX, ev.clientY];
        const realX = cx - this.eventDataMap.ox + this.eventDataMap.preX;
        const realY = cy - this.eventDataMap.oy + this.eventDataMap.preY;
        this.eventDataMap.iSpeedX = cx - this.eventDataMap.lastX;
        this.eventDataMap.iSpeedY = cy - this.eventDataMap.lastY;
        this.eventDataMap.lastX = cx;
        this.eventDataMap.lastY = cy;
        this.applyTransform({ realX, realY });
        this.eventDataMap.curRealX = realX;
        this.eventDataMap.curRealY = realY;
      }
    },
  };

  scaleEvent = {
    wheel(ev) {
      if (ev.deltaY === 0) return;
      console.log(ev);
      const [cx, cy] = [ev.clientX, ev.clientY];
      const { ts } = this.elementTransformStyle;
      const _scaleStep = ev.deltaY < 0 ? -this.scaleStep : this.scaleStep;
      const lastScale = ts + _scaleStep <= 0 ? 0.1 : ts + _scaleStep; // 最小缩放10倍
      this.applyTransform({ realScale: lastScale });

      const x = this.ownerDom.offset;
      console.log("cx, cy", cx, cy);
      console.log("x::", x);
    },
  };

  getAnimationCoefficient(weakXArr, weakYArr) {
    const maxLen = Math.max(weakXArr.length, weakYArr.length);
    const indexArr = [];
    let index = 0;
    let c = 0;
    for (let i = 0; i < maxLen; i++) {
      if (index < maxLen) {
        indexArr.push(index);
      } else {
        break;
      }
      index += c;
      c++;
    }

    let ri = 0;
    let iArr = [];
    for (let i = c; i >= 0; i--) {
      ri += i;
      if (ri > maxLen) {
        ri = maxLen;
        iArr.push(ri);
        break;
      }
      iArr.push(ri);
    }

    return iArr;
  }

  getStepValue(total, step, isNegative) {
    if (total === 0) return [];
    const preStep = total / step;
    const arrs = new Array(parseInt(total / preStep)).fill(preStep);
    const weakArrs = [];
    arrs.reduce((pre, item) => {
      weakArrs.push(isNegative ? -pre : pre);
      return pre + item;
    });

    return weakArrs;
  }

  getDataBySpeed(iSpeedX, iSpeedY) {
    const extendRate = this.extendRate; // 单位拓展距离
    const extendStep = this.extendStep; // 分段因子 越高动画越丝滑
    let _isSpeedX = Math.abs(iSpeedX);
    let _isSpeedY = Math.abs(iSpeedY);
    let extendX = _isSpeedX * extendRate; // 拓展距离 X
    let extendY = _isSpeedY * extendRate; // 拓展距离 Y
    const weakXArr = this.getStepValue(extendX, extendStep, iSpeedX < 0);
    const weakYArr = this.getStepValue(extendY, extendStep, iSpeedY < 0);

    return [weakXArr, weakYArr];
  }

  applyTransform({ realX, realY, realScale }, isLast) {
    const { tx, ty, ts } = this.elementTransformStyle;
    if (typeof realScale === "undefined") {
      realScale = ts;
    }
    if (typeof realX === "undefined") {
      realX = tx;
      realY = ty;
    }
    this.ownerDom.style.transform = `matrix(${realScale}, 0, 0, ${realScale}, ${realX}, ${realY})`;
    if (isLast) {
      this.eventDataMap.curRealX = realX;
      this.eventDataMap.curRealY = realY;
    }
  }
}

export default HanderDragSacle;
