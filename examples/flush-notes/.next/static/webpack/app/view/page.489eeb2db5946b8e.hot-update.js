"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/view/page",{

/***/ "(app-pages-browser)/./src/services/waku.ts":
/*!******************************!*\
  !*** ./src/services/waku.ts ***!
  \******************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Waku: function() { return /* binding */ Waku; },\n/* harmony export */   WakuEvents: function() { return /* binding */ WakuEvents; },\n/* harmony export */   waku: function() { return /* binding */ waku; }\n/* harmony export */ });\n/* harmony import */ var _const__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/const */ \"(app-pages-browser)/./src/const.ts\");\n/* harmony import */ var _waku_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @waku/sdk */ \"(app-pages-browser)/./node_modules/@waku/sdk/dist/index.js\");\n/* harmony import */ var _waku_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @waku/utils */ \"(app-pages-browser)/./node_modules/@waku/utils/dist/index.js\");\n/* __next_internal_client_entry_do_not_use__ WakuEvents,Waku,waku auto */ \n\n\n\nvar WakuEvents;\n(function(WakuEvents) {\n    WakuEvents[\"Status\"] = \"status\";\n})(WakuEvents || (WakuEvents = {}));\nclass Waku {\n    async init() {\n        if (this.initialized || this.initializing) {\n            return;\n        }\n        this.initializing = true;\n        try {\n            this.emitStatusEvent(_const__WEBPACK_IMPORTED_MODULE_0__.WakuStatus.Initializing);\n            this.pubsubTopic = (0,_waku_utils__WEBPACK_IMPORTED_MODULE_2__.contentTopicToPubsubTopic)(_const__WEBPACK_IMPORTED_MODULE_0__.CONTENT_TOPIC);\n            const singleShardInfo = (0,_waku_utils__WEBPACK_IMPORTED_MODULE_2__.pubsubTopicToSingleShardInfo)(this.pubsubTopic);\n            const node = await (0,_waku_sdk__WEBPACK_IMPORTED_MODULE_1__.createLightNode)({\n                defaultBootstrap: true,\n                pubsubTopics: [\n                    this.pubsubTopic\n                ],\n                shardInfo: {\n                    contentTopics: [\n                        _const__WEBPACK_IMPORTED_MODULE_0__.CONTENT_TOPIC\n                    ],\n                    shards: [\n                        singleShardInfo.shard\n                    ],\n                    clusterId: singleShardInfo.clusterId\n                }\n            });\n            await node.start();\n            this.emitStatusEvent(_const__WEBPACK_IMPORTED_MODULE_0__.WakuStatus.WaitingForPeers);\n            await (0,_waku_sdk__WEBPACK_IMPORTED_MODULE_1__.waitForRemotePeer)(node, [\n                _waku_sdk__WEBPACK_IMPORTED_MODULE_1__.Protocols.Filter,\n                _waku_sdk__WEBPACK_IMPORTED_MODULE_1__.Protocols.LightPush,\n                _waku_sdk__WEBPACK_IMPORTED_MODULE_1__.Protocols.Store\n            ]);\n            this.node = node;\n            this.initialized = true;\n            this.emitStatusEvent(_const__WEBPACK_IMPORTED_MODULE_0__.WakuStatus.Connected);\n        } catch (error) {\n            console.error(\"Failed to initialize Waku node:\", error);\n            this.emitStatusEvent(_const__WEBPACK_IMPORTED_MODULE_0__.WakuStatus.Failed);\n        }\n        this.initializing = false;\n    }\n    addEventListener(event, fn) {\n        return this.emitter.addEventListener(event, fn);\n    }\n    removeEventListener(event, fn) {\n        return this.emitter.removeEventListener(event, fn);\n    }\n    send(encoder, message) {\n        var _this_node;\n        this.ensureWakuInitialized();\n        return (_this_node = this.node) === null || _this_node === void 0 ? void 0 : _this_node.lightPush.send(encoder, message);\n    }\n    async getHistory(decoder) {\n        this.ensureWakuInitialized();\n        let messages = [];\n        for await (const promises of this.node.store.queryGenerator([\n            decoder\n        ])){\n            const messagesRaw = await Promise.all(promises);\n            const filteredMessages = messagesRaw.filter((v)=>!!v);\n            messages = [\n                ...messages,\n                ...filteredMessages\n            ];\n        }\n        return messages;\n    }\n    async subscribe(decoder, fn) {\n        this.ensureWakuInitialized();\n        return this.node.filter.subscribe(decoder, fn);\n    }\n    emitStatusEvent(payload) {\n        this.emitter.dispatchEvent(new CustomEvent(\"status\", {\n            detail: payload\n        }));\n    }\n    ensureWakuInitialized() {\n        if (!waku.initialized) {\n            const message = \"Waku is not initialized.\";\n            console.log(message);\n            throw Error(message);\n        }\n    }\n    constructor(){\n        this.emitter = new EventTarget();\n        this.initialized = false;\n        this.initializing = false;\n    }\n}\nconst waku = new Waku();\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNFLFNBQVMsQ0FBQ1gsU0FBU1Q7SUFDOUM7SUFFUXZCLGdCQUFnQjRDLE9BQWUsRUFBRTtRQUN2QyxJQUFJLENBQUNwQixPQUFPLENBQUNxQixhQUFhLENBQ3hCLElBQUlDLHNCQUErQjtZQUFFQyxRQUFRSDtRQUFRO0lBRXpEO0lBRVFmLHdCQUF3QjtRQUM5QixJQUFJLENBQUNtQixLQUFLbEQsV0FBVyxFQUFFO1lBQ3JCLE1BQU04QixVQUFVO1lBQ2hCVCxRQUFROEIsR0FBRyxDQUFDckI7WUFDWixNQUFNc0IsTUFBTXRCO1FBQ2Q7SUFDRjtJQTNGQXVCLGFBQWM7YUFMTjNCLFVBQVUsSUFBSTRCO2FBQ2R0RCxjQUF1QjthQUN2QkMsZUFBd0I7SUFHakI7QUE0RmpCO0FBRU8sTUFBTWlELE9BQU8sSUFBSXBELE9BQU8iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3JjL3NlcnZpY2VzL3dha3UudHM/NTRiMyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBjbGllbnRcIjtcblxuaW1wb3J0IHsgV2FrdVN0YXR1cyB9IGZyb20gXCJAL2NvbnN0XCI7XG5pbXBvcnQge1xuICBJRGVjb2RlcixcbiAgSUVuY29kZXIsXG4gIElNZXNzYWdlLFxuICBMaWdodE5vZGUsXG4gIGNyZWF0ZUxpZ2h0Tm9kZSxcbiAgd2FpdEZvclJlbW90ZVBlZXIsXG4gIElEZWNvZGVkTWVzc2FnZSxcbiAgUHJvdG9jb2xzLFxufSBmcm9tIFwiQHdha3Uvc2RrXCI7XG5pbXBvcnQgeyBDT05URU5UX1RPUElDIH0gZnJvbSBcIkAvY29uc3RcIjtcbmltcG9ydCB7XG4gIGNvbnRlbnRUb3BpY1RvUHVic3ViVG9waWMsXG4gIHB1YnN1YlRvcGljVG9TaW5nbGVTaGFyZEluZm8sXG59IGZyb20gXCJAd2FrdS91dGlsc1wiO1xuXG50eXBlIEV2ZW50TGlzdGVuZXIgPSAoZXZlbnQ6IEN1c3RvbUV2ZW50KSA9PiB2b2lkO1xuXG5leHBvcnQgZW51bSBXYWt1RXZlbnRzIHtcbiAgU3RhdHVzID0gXCJzdGF0dXNcIixcbn1cblxuZXhwb3J0IGNsYXNzIFdha3Uge1xuICBwcml2YXRlIG5vZGU6IHVuZGVmaW5lZCB8IExpZ2h0Tm9kZTtcblxuICBwcml2YXRlIGVtaXR0ZXIgPSBuZXcgRXZlbnRUYXJnZXQoKTtcbiAgcHJpdmF0ZSBpbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIGluaXRpYWxpemluZzogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgcHVic3ViVG9waWM/OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIHB1YmxpYyBhc3luYyBpbml0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkIHx8IHRoaXMuaW5pdGlhbGl6aW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5pbml0aWFsaXppbmcgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmVtaXRTdGF0dXNFdmVudChXYWt1U3RhdHVzLkluaXRpYWxpemluZyk7XG4gICAgICB0aGlzLnB1YnN1YlRvcGljID0gY29udGVudFRvcGljVG9QdWJzdWJUb3BpYyhDT05URU5UX1RPUElDKTtcbiAgICAgIGNvbnN0IHNpbmdsZVNoYXJkSW5mbyA9IHB1YnN1YlRvcGljVG9TaW5nbGVTaGFyZEluZm8oXG4gICAgICAgIHRoaXMucHVic3ViVG9waWNcbiAgICAgICk7XG4gICAgICBjb25zdCBub2RlID0gYXdhaXQgY3JlYXRlTGlnaHROb2RlKHtcbiAgICAgICAgZGVmYXVsdEJvb3RzdHJhcDogdHJ1ZSxcbiAgICAgICAgcHVic3ViVG9waWNzOiBbdGhpcy5wdWJzdWJUb3BpY10sXG4gICAgICAgIHNoYXJkSW5mbzoge1xuICAgICAgICAgIGNvbnRlbnRUb3BpY3M6IFtDT05URU5UX1RPUElDXSxcbiAgICAgICAgICBzaGFyZHM6IFtzaW5nbGVTaGFyZEluZm8uc2hhcmRdLFxuICAgICAgICAgIGNsdXN0ZXJJZDogc2luZ2xlU2hhcmRJbmZvLmNsdXN0ZXJJZCxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgYXdhaXQgbm9kZS5zdGFydCgpO1xuICAgICAgdGhpcy5lbWl0U3RhdHVzRXZlbnQoV2FrdVN0YXR1cy5XYWl0aW5nRm9yUGVlcnMpO1xuICAgICAgYXdhaXQgd2FpdEZvclJlbW90ZVBlZXIobm9kZSwgW1xuICAgICAgICBQcm90b2NvbHMuRmlsdGVyLFxuICAgICAgICBQcm90b2NvbHMuTGlnaHRQdXNoLFxuICAgICAgICBQcm90b2NvbHMuU3RvcmUsXG4gICAgICBdKTtcbiAgICAgIHRoaXMubm9kZSA9IG5vZGU7XG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuZW1pdFN0YXR1c0V2ZW50KFdha3VTdGF0dXMuQ29ubmVjdGVkKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBpbml0aWFsaXplIFdha3Ugbm9kZTpcIiwgZXJyb3IpO1xuICAgICAgdGhpcy5lbWl0U3RhdHVzRXZlbnQoV2FrdVN0YXR1cy5GYWlsZWQpO1xuICAgIH1cbiAgICB0aGlzLmluaXRpYWxpemluZyA9IGZhbHNlO1xuICB9XG5cbiAgcHVibGljIGFkZEV2ZW50TGlzdGVuZXIoZXZlbnQ6IFdha3VFdmVudHMsIGZuOiBFdmVudExpc3RlbmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBmbiBhcyBhbnkpO1xuICB9XG5cbiAgcHVibGljIHJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQ6IFdha3VFdmVudHMsIGZuOiBFdmVudExpc3RlbmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBmbiBhcyBhbnkpO1xuICB9XG5cbiAgcHVibGljIHNlbmQoZW5jb2RlcjogSUVuY29kZXIsIG1lc3NhZ2U6IElNZXNzYWdlKSB7XG4gICAgdGhpcy5lbnN1cmVXYWt1SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5ub2RlPy5saWdodFB1c2guc2VuZChlbmNvZGVyLCBtZXNzYWdlKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRIaXN0b3J5KFxuICAgIGRlY29kZXI6IElEZWNvZGVyPElEZWNvZGVkTWVzc2FnZT5cbiAgKTogUHJvbWlzZTxJRGVjb2RlZE1lc3NhZ2VbXT4ge1xuICAgIHRoaXMuZW5zdXJlV2FrdUluaXRpYWxpemVkKCk7XG5cbiAgICBsZXQgbWVzc2FnZXM6IElEZWNvZGVkTWVzc2FnZVtdID0gW107XG4gICAgZm9yIGF3YWl0IChjb25zdCBwcm9taXNlcyBvZiB0aGlzLm5vZGUhLnN0b3JlLnF1ZXJ5R2VuZXJhdG9yKFtkZWNvZGVyXSkpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2VzUmF3ID0gYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgICAgY29uc3QgZmlsdGVyZWRNZXNzYWdlcyA9IG1lc3NhZ2VzUmF3LmZpbHRlcihcbiAgICAgICAgKHYpOiB2IGlzIElEZWNvZGVkTWVzc2FnZSA9PiAhIXZcbiAgICAgICk7XG5cbiAgICAgIG1lc3NhZ2VzID0gWy4uLm1lc3NhZ2VzLCAuLi5maWx0ZXJlZE1lc3NhZ2VzXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVzc2FnZXM7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc3Vic2NyaWJlKFxuICAgIGRlY29kZXI6IElEZWNvZGVyPElEZWNvZGVkTWVzc2FnZT4sXG4gICAgZm46IChtOiBJRGVjb2RlZE1lc3NhZ2UpID0+IHZvaWRcbiAgKSB7XG4gICAgdGhpcy5lbnN1cmVXYWt1SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5ub2RlIS5maWx0ZXIuc3Vic2NyaWJlKGRlY29kZXIsIGZuKTtcbiAgfVxuXG4gIHByaXZhdGUgZW1pdFN0YXR1c0V2ZW50KHBheWxvYWQ6IHN0cmluZykge1xuICAgIHRoaXMuZW1pdHRlci5kaXNwYXRjaEV2ZW50KFxuICAgICAgbmV3IEN1c3RvbUV2ZW50KFdha3VFdmVudHMuU3RhdHVzLCB7IGRldGFpbDogcGF5bG9hZCB9KVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGVuc3VyZVdha3VJbml0aWFsaXplZCgpIHtcbiAgICBpZiAoIXdha3UuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBcIldha3UgaXMgbm90IGluaXRpYWxpemVkLlwiO1xuICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgICB0aHJvdyBFcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHdha3UgPSBuZXcgV2FrdSgpO1xuIl0sIm5hbWVzIjpbIldha3VTdGF0dXMiLCJjcmVhdGVMaWdodE5vZGUiLCJ3YWl0Rm9yUmVtb3RlUGVlciIsIlByb3RvY29scyIsIkNPTlRFTlRfVE9QSUMiLCJjb250ZW50VG9waWNUb1B1YnN1YlRvcGljIiwicHVic3ViVG9waWNUb1NpbmdsZVNoYXJkSW5mbyIsIldha3VFdmVudHMiLCJXYWt1IiwiaW5pdCIsImluaXRpYWxpemVkIiwiaW5pdGlhbGl6aW5nIiwiZW1pdFN0YXR1c0V2ZW50IiwiSW5pdGlhbGl6aW5nIiwicHVic3ViVG9waWMiLCJzaW5nbGVTaGFyZEluZm8iLCJub2RlIiwiZGVmYXVsdEJvb3RzdHJhcCIsInB1YnN1YlRvcGljcyIsInNoYXJkSW5mbyIsImNvbnRlbnRUb3BpY3MiLCJzaGFyZHMiLCJzaGFyZCIsImNsdXN0ZXJJZCIsInN0YXJ0IiwiV2FpdGluZ0ZvclBlZXJzIiwiRmlsdGVyIiwiTGlnaHRQdXNoIiwiU3RvcmUiLCJDb25uZWN0ZWQiLCJlcnJvciIsImNvbnNvbGUiLCJGYWlsZWQiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJmbiIsImVtaXR0ZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwic2VuZCIsImVuY29kZXIiLCJtZXNzYWdlIiwiZW5zdXJlV2FrdUluaXRpYWxpemVkIiwibGlnaHRQdXNoIiwiZ2V0SGlzdG9yeSIsImRlY29kZXIiLCJtZXNzYWdlcyIsInByb21pc2VzIiwic3RvcmUiLCJxdWVyeUdlbmVyYXRvciIsIm1lc3NhZ2VzUmF3IiwiUHJvbWlzZSIsImFsbCIsImZpbHRlcmVkTWVzc2FnZXMiLCJmaWx0ZXIiLCJ2Iiwic3Vic2NyaWJlIiwicGF5bG9hZCIsImRpc3BhdGNoRXZlbnQiLCJDdXN0b21FdmVudCIsImRldGFpbCIsIndha3UiLCJsb2ciLCJFcnJvciIsImNvbnN0cnVjdG9yIiwiRXZlbnRUYXJnZXQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/services/waku.ts\n"));

/***/ })

});