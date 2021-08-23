var HighFidelityControls;HighFidelityControls=(()=>{"use strict";var e={893:(e,t,n)=>{n.r(t),n.d(t,{HiFiControls:()=>v});const s="ArrowLeft",i="ArrowUp",h="ArrowRight",o="ArrowDown",a="KeyW",r="KeyA",l="KeyS",c="KeyD",u="KeyQ",d="KeyE";class v{constructor({mainAppElement:e}){this._mouseEventCache=[],this._leftClickStartPositionPX={x:0,y:0},this._rightClickStartPositionPX={x:0,y:0},this._lastLeftDragPosition=null,this._lastRightDragPosition=null,this._lastDistanceBetweenLeftClickEvents=0,this._lastDistanceBetweenRightClickEvents=0,this._lastDistanceBetweenTouchPoints=0,this._lastAngleBetweenTouchPoints=0,e.style&&(e.style.touchAction="none"),window.PointerEvent?(e.addEventListener("pointerdown",this._handleEvent.bind(this),!1),e.addEventListener("pointermove",this._handleEvent.bind(this),!1),e.addEventListener("pointerup",this._handleEvent.bind(this),!1),e.addEventListener("pointerout",this._handleEvent.bind(this),!1)):(e.addEventListener("touchstart",this._handleEvent.bind(this),!1),e.addEventListener("touchmove",this._handleEvent.bind(this),!1),e.addEventListener("touchend",this._handleEvent.bind(this),!1),e.addEventListener("touchcancel",this._handleEvent.bind(this),!1),e.addEventListener("mousedown",this._handleEvent.bind(this),!1)),e.addEventListener("mousewheel",this._handleEvent.bind(this),!1),e.addEventListener("gesturestart",(e=>{e.preventDefault()}),!1),e.addEventListener("gesturechange",(e=>{e.preventDefault()}),!1),e.addEventListener("gestureend",(e=>{e.preventDefault()}),!1),e.addEventListener("contextmenu",(e=>{e.preventDefault()}),!1),this.onCanvasDown=e=>{},this.onCanvasMove=(e,t,n)=>{},this.onLeftDrag=(e,t,n)=>{},this.onRightDrag=(e,t,n)=>{},this.onPinch=(e,t,n)=>{},this.onRotate=(e,t,n)=>{},this.onClick=e=>{},this.onWheel=e=>{},this._keyboardEventCache=[],e.addEventListener("keydown",(e=>{this._onUserKeyDown(e)}),!1),e.addEventListener("keyup",(e=>{this._onUserKeyUp(e)}),!1),this.onTurnLeftKeyDown=()=>{},this.onTurnRightKeyDown=()=>{},this.onMoveForwardKeyDown=()=>{},this.onMoveBackwardKeyDown=()=>{},this.onStrafeLeftKeyDown=()=>{},this.onStrafeRightKeyDown=()=>{},this.onTurnLeftKeyUp=()=>{},this.onTurnRightKeyUp=()=>{},this.onMoveForwardKeyUp=()=>{},this.onMoveBackwardKeyUp=()=>{},this.onStrafeLeftKeyUp=()=>{},this.onStrafeRightKeyUp=()=>{}}_handleEvent(e){switch(e.type){case"pointerdown":case"touchstart":case"mousedown":this._handleGestureOnCanvasStart(e);break;case"pointermove":case"touchmove":case"mousemove":this._handleGestureOnCanvasMove(e);break;case"pointerup":case"touchend":case"mouseup":this._handleGestureOnCanvasEnd(e);break;case"pointerout":case"touchcancel":this._handleGestureOnCanvasCancel(e);break;case"mousewheel":this._handleMouseWheel(e)}}_pushEvent(e){this._mouseEventCache.push(e)}_removeEvent(e){for(let t=0;t<this._mouseEventCache.length;t++)if(this._mouseEventCache[t].pointerId===e.pointerId){this._mouseEventCache.splice(t,1),t--;break}}_getEventFromCacheByID(e){for(let t=0;t<this._mouseEventCache.length;t++)if(this._mouseEventCache[t].pointerId==e)return this._mouseEventCache[t];return null}_getGesturePointFromEvent(e){let t={x:0,y:0};return e.targetTouches?(t.x=e.targetTouches[0].clientX,t.y=e.targetTouches[0].clientY):(t.x=e.clientX,t.y=e.clientY),t}_handleGestureOnCanvasStart(e){if(e.preventDefault(),e.target.focus(),e.pointerId)this._pushEvent(e);else if(e.changedTouches){let t=e.changedTouches;for(let n=0;n<t.length;n++){let s=t[n];e={pointerId:s.identifier,clientX:s.clientX,clientY:s.clientY,button:0,buttons:0},this._pushEvent(e)}}if(e.touches&&e.touches.length>1)return;window.PointerEvent?e.target.setPointerCapture(e.pointerId):(document.addEventListener("mousemove",this._handleEvent.bind(this),!1),document.addEventListener("mouseup",this._handleEvent.bind(this),!1));let t=this._getGesturePointFromEvent(e);0===e.button&&(this._leftClickStartPositionPX=t),2===e.button?this._rightClickStartPositionPX=t:this._mouseEventCache.length<=1?this._lastLeftDragPosition=t:this._mouseEventCache.length>1&&(this._lastLeftDragPosition=null),this.onCanvasDown(e)}_handleGestureOnCanvasMove(e){e.preventDefault();let t=this._getGesturePointFromEvent(e);if(this._mouseEventCache.length<1&&this.onCanvasMove(e),!(2!==e.buttons&&this._mouseEventCache.length<=1)||this._leftClickStartPositionPX||this._rightClickStartPositionPX)if(2!==e.buttons&&this._lastLeftDragPosition&&this._mouseEventCache.length<=1){let n={x:this._lastLeftDragPosition.x-t.x,y:this._lastLeftDragPosition.y-t.y};this._lastLeftDragPosition=t,this.onLeftDrag(e,{base:this._lastDistanceBetweenLeftClickEvents,delta:n})}else if(2===e.buttons&&this._rightClickStartPositionPX&&this._mouseEventCache.length<=1){let n=t.x-this._rightClickStartPositionPX.x,s=n-this._lastDistanceBetweenRightClickEvents;this._lastDistanceBetweenRightClickEvents=n,this.onRightDrag(e,{base:this._lastDistanceBetweenRightClickEvents,delta:s})}else if(2===this._mouseEventCache.length){this._lastLeftDragPosition=null;let t=this._mouseEventCache[0].clientX-this._mouseEventCache[1].clientX,n=this._mouseEventCache[0].clientY-this._mouseEventCache[1].clientY;if(this._lastDistanceBetweenTouchPoints=Math.sqrt(t*t+n*n),this._lastAngleBetweenTouchPoints=Math.atan2(this._mouseEventCache[1].clientY-this._mouseEventCache[0].clientY,this._mouseEventCache[1].clientX-this._mouseEventCache[0].clientX),e.pointerId)for(let t=0;t<this._mouseEventCache.length;t++)this._mouseEventCache[t].pointerId===e.pointerId&&(this._mouseEventCache[t]=e);else if(e.changedTouches){let t=e.changedTouches;for(let e=0;e<t.length;e++){let n=this._getEventFromCacheByID(t[e].identifier);n&&(n.clientX=t[e].clientX,n.clientY=t[e].clientY)}}t=this._mouseEventCache[0].clientX-this._mouseEventCache[1].clientX,n=this._mouseEventCache[0].clientY-this._mouseEventCache[1].clientY;let s=Math.sqrt(t*t+n*n),i=Math.atan2(this._mouseEventCache[1].clientY-this._mouseEventCache[0].clientY,this._mouseEventCache[1].clientX-this._mouseEventCache[0].clientX),h=s-this._lastDistanceBetweenTouchPoints;this.onPinch(e,{base:this._lastDistanceBetweenTouchPoints,delta:h});let o=i-this._lastAngleBetweenTouchPoints;this.onRotate(e,{base:this._lastAngleBetweenTouchPoints,delta:o})}}_handleGestureOnCanvasEnd(e){if(e.preventDefault(),e.pointerId)this._removeEvent(e);else if(e.changedTouches){let t=e.changedTouches;for(let e=t.length-1;e>=0;e--){let n=this._getEventFromCacheByID(t[e].identifier);n&&this._removeEvent(n)}}e.touches&&e.touches.length>0||this._mouseEventCache.length>0||(window.PointerEvent?e.pointerId&&e.target.releasePointerCapture(e.pointerId):(document.removeEventListener("mousemove",this._handleEvent.bind(this),!1),document.removeEventListener("mouseup",this._handleEvent.bind(this),!1)),this._lastLeftDragPosition&&2!==e.button?(this._lastLeftDragPosition=null,this._lastDistanceBetweenLeftClickEvents=0):2===e.button&&this._rightClickStartPositionPX&&(this._rightClickStartPositionPX=null,this._lastDistanceBetweenRightClickEvents=0),0===e.button&&(this.onClick(e),this._leftClickStartPositionPX=null))}_handleGestureOnCanvasCancel(e){this._handleGestureOnCanvasEnd(e)}_handleMouseWheel(e){if(0!=e.deltaY){let t=e.deltaY/Math.abs(e.deltaY);this.onWheel(e,{base:e.deltaY,delta:t})}}_onUserKeyDown(e){let t=!0;for(let n=0;n<this._keyboardEventCache.length;n++)if(this._keyboardEventCache[n].code===e.code){t=!1;break}switch(t&&this._keyboardEventCache.unshift(e),this._keyboardEventCache[0].code){case s:case r:this.onTurnLeftKeyDown();break;case h:case c:this.onTurnRightKeyDown();break;case i:case a:this.onMoveForwardKeyDown();break;case o:case l:this.onMoveBackwardKeyDown();break;case u:this.onStrafeLeftKeyDown();break;case d:this.onStrafeRightKeyDown()}}_onUserKeyUp(e){for(let t=this._keyboardEventCache.length-1;t>=0;t--)this._keyboardEventCache[t].code===e.code&&this._keyboardEventCache.splice(t,1);switch(e.code){case s:case r:this.onTurnLeftKeyUp();break;case h:case c:this.onTurnRightKeyUp();break;case i:case a:this.onMoveForwardKeyUp();break;case o:case l:this.onMoveBackwardKeyUp();break;case u:this.onStrafeLeftKeyUp();break;case d:this.onStrafeRightKeyUp()}this._keyboardEventCache.length>0&&this._onUserKeyDown(this._keyboardEventCache[0])}}}},t={};function n(s){if(t[s])return t[s].exports;var i=t[s]={exports:{}};return e[s](i,i.exports,n),i.exports}return n.d=(e,t)=>{for(var s in t)n.o(t,s)&&!n.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n(893)})();