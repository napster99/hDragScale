### 简单的拖动缩放库

```javascript
import HanderDragSacle from "@tuya-fe/hDragScale"

new HanderDragSacle({
  ownerDom: document.getElementById("handerWrap"),
  allowDrag: true,
  allowScale: true,
  extendRate: 10, // ops
  extendStep: 800, // ops
  scaleOrigin: 1, // ops
});
```

