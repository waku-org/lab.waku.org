"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/page",{

/***/ "(app-pages-browser)/./src/services/notes.ts":
/*!*******************************!*\
  !*** ./src/services/notes.ts ***!
  \*******************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Notes: function() { return /* binding */ Notes; },\n/* harmony export */   notes: function() { return /* binding */ notes; }\n/* harmony export */ });\n/* harmony import */ var _services_waku__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/services/waku */ \"(app-pages-browser)/./src/services/waku.ts\");\n/* harmony import */ var _const__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/const */ \"(app-pages-browser)/./src/const.ts\");\n/* harmony import */ var _waku_message_encryption_symmetric__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @waku/message-encryption/symmetric */ \"(app-pages-browser)/./node_modules/@waku/message-encryption/dist/symmetric.js\");\n/* harmony import */ var _waku_sdk__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @waku/sdk */ \"(app-pages-browser)/./node_modules/@waku/sdk/dist/index.js\");\n/* harmony import */ var _waku_utils_bytes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @waku/utils/bytes */ \"(app-pages-browser)/./node_modules/@waku/utils/dist/bytes/index.js\");\n/* harmony import */ var _waku_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @waku/utils */ \"(app-pages-browser)/./node_modules/@waku/utils/dist/index.js\");\n/* __next_internal_client_entry_do_not_use__ Notes,notes auto */ \n\n\n\n\n\nconst UUID_V4_STR_LEN = 8 + 1 + 4 + 1 + 4 + 1 + 4 + 1 + 12; // 8-4-4-4-12 format\nclass Notes {\n    async createNote(content) {\n        const symKey = (0,_waku_message_encryption_symmetric__WEBPACK_IMPORTED_MODULE_2__.generateSymmetricKey)();\n        const encoder = (0,_waku_message_encryption_symmetric__WEBPACK_IMPORTED_MODULE_2__.createEncoder)({\n            contentTopic: _const__WEBPACK_IMPORTED_MODULE_1__.CONTENT_TOPIC,\n            symKey,\n            pubsubTopicShardInfo: (0,_waku_utils__WEBPACK_IMPORTED_MODULE_5__.pubsubTopicToSingleShardInfo)((0,_waku_utils__WEBPACK_IMPORTED_MODULE_5__.contentTopicToPubsubTopic)(_const__WEBPACK_IMPORTED_MODULE_1__.CONTENT_TOPIC)),\n            pubsubTopic: (0,_waku_utils__WEBPACK_IMPORTED_MODULE_5__.contentTopicToPubsubTopic)(_const__WEBPACK_IMPORTED_MODULE_1__.CONTENT_TOPIC)\n        });\n        console.log(encoder);\n        const id = self.crypto.randomUUID();\n        if (id.length !== UUID_V4_STR_LEN) {\n            throw \"Unexpected uuid length\";\n        }\n        const result = await _services_waku__WEBPACK_IMPORTED_MODULE_0__.waku.send(encoder, {\n            payload: (0,_waku_sdk__WEBPACK_IMPORTED_MODULE_3__.utf8ToBytes)(id + content)\n        });\n        console.log(result);\n        return {\n            id,\n            key: (0,_waku_utils_bytes__WEBPACK_IMPORTED_MODULE_4__.bytesToHex)(symKey)\n        };\n    }\n    async readNote(id, key) {\n        await this.initMessages((0,_waku_utils_bytes__WEBPACK_IMPORTED_MODULE_4__.hexToBytes)(key));\n        const message = this.messages.map((m)=>{\n            try {\n                const str = (0,_waku_sdk__WEBPACK_IMPORTED_MODULE_3__.bytesToUtf8)(m.payload);\n                const id = str.substring(0, UUID_V4_STR_LEN);\n                const content = str.substring(UUID_V4_STR_LEN);\n                return {\n                    id,\n                    content\n                };\n            } catch (error) {\n                console.log(\"Failed to read message:\", error);\n            }\n        }).find((v)=>{\n            if ((v === null || v === void 0 ? void 0 : v.id) === id) {\n                return true;\n            }\n        });\n        return message === null || message === void 0 ? void 0 : message.content;\n    }\n    async initMessages(key) {\n        if (this.subscription) {\n            return;\n        }\n        const decoder = (0,_waku_message_encryption_symmetric__WEBPACK_IMPORTED_MODULE_2__.createDecoder)(_const__WEBPACK_IMPORTED_MODULE_1__.CONTENT_TOPIC, key, (0,_waku_utils__WEBPACK_IMPORTED_MODULE_5__.pubsubTopicToSingleShardInfo)((0,_waku_utils__WEBPACK_IMPORTED_MODULE_5__.contentTopicToPubsubTopic)(_const__WEBPACK_IMPORTED_MODULE_1__.CONTENT_TOPIC)));\n        this.messages = await _services_waku__WEBPACK_IMPORTED_MODULE_0__.waku.getHistory(decoder);\n        this.subscription = await _services_waku__WEBPACK_IMPORTED_MODULE_0__.waku.subscribe(decoder, (message)=>{\n            this.messages.push(message);\n        });\n    }\n    constructor(){\n        this.messages = [];\n    }\n}\nconst notes = new Notes();\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9zZXJ2aWNlcy9ub3Rlcy50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztpRUFFdUM7QUFDQztBQUtJO0FBRXNCO0FBQ1A7QUFJdEM7QUFFckIsTUFBTVcsa0JBQWtCLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLG9CQUFvQjtBQVl6RSxNQUFNQztJQU1YLE1BQWFDLFdBQVdDLE9BQWUsRUFBdUI7UUFDNUQsTUFBTUMsU0FBU1gsd0ZBQW9CQTtRQUVuQyxNQUFNWSxVQUFVZCxpRkFBYUEsQ0FBQztZQUM1QmUsY0FBY2hCLGlEQUFhQTtZQUMzQmM7WUFDQUcsc0JBQXNCUix5RUFBNEJBLENBQ2hERCxzRUFBeUJBLENBQUNSLGlEQUFhQTtZQUV6Q2tCLGFBQWFWLHNFQUF5QkEsQ0FBQ1IsaURBQWFBO1FBQ3REO1FBQ0FtQixRQUFRQyxHQUFHLENBQUNMO1FBQ1osTUFBTU0sS0FBS0MsS0FBS0MsTUFBTSxDQUFDQyxVQUFVO1FBRWpDLElBQUlILEdBQUdJLE1BQU0sS0FBS2YsaUJBQWlCO1lBQ2pDLE1BQU07UUFDUjtRQUVBLE1BQU1nQixTQUFTLE1BQU0zQixnREFBSUEsQ0FBQzRCLElBQUksQ0FBQ1osU0FBUztZQUN0Q2EsU0FBU3hCLHNEQUFXQSxDQUFDaUIsS0FBS1I7UUFDNUI7UUFDQU0sUUFBUUMsR0FBRyxDQUFDTTtRQUVaLE9BQU87WUFDTEw7WUFDQVEsS0FBS3ZCLDZEQUFVQSxDQUFDUTtRQUNsQjtJQUNGO0lBRUEsTUFBYWdCLFNBQVNULEVBQVUsRUFBRVEsR0FBVyxFQUErQjtRQUMxRSxNQUFNLElBQUksQ0FBQ0UsWUFBWSxDQUFDeEIsNkRBQVVBLENBQUNzQjtRQUVuQyxNQUFNRyxVQUFVLElBQUksQ0FBQ0MsUUFBUSxDQUMxQkMsR0FBRyxDQUFDLENBQUNDO1lBQ0osSUFBSTtnQkFDRixNQUFNQyxNQUFNL0Isc0RBQVdBLENBQUM4QixFQUFFUCxPQUFPO2dCQUVqQyxNQUFNUCxLQUFLZSxJQUFJQyxTQUFTLENBQUMsR0FBRzNCO2dCQUM1QixNQUFNRyxVQUFVdUIsSUFBSUMsU0FBUyxDQUFDM0I7Z0JBRTlCLE9BQU87b0JBQUVXO29CQUFJUjtnQkFBUTtZQUN2QixFQUFFLE9BQU95QixPQUFPO2dCQUNkbkIsUUFBUUMsR0FBRyxDQUFDLDJCQUEyQmtCO1lBQ3pDO1FBQ0YsR0FDQ0MsSUFBSSxDQUFDLENBQUNDO1lBQ0wsSUFBSUEsQ0FBQUEsY0FBQUEsd0JBQUFBLEVBQUduQixFQUFFLE1BQUtBLElBQUk7Z0JBQ2hCLE9BQU87WUFDVDtRQUNGO1FBRUYsT0FBT1csb0JBQUFBLDhCQUFBQSxRQUFTbkIsT0FBTztJQUN6QjtJQUVBLE1BQWNrQixhQUFhRixHQUFlLEVBQUU7UUFDMUMsSUFBSSxJQUFJLENBQUNZLFlBQVksRUFBRTtZQUNyQjtRQUNGO1FBRUEsTUFBTUMsVUFBVXhDLGlGQUFhQSxDQUMzQkYsaURBQWFBLEVBQ2I2QixLQUNBcEIseUVBQTRCQSxDQUFDRCxzRUFBeUJBLENBQUNSLGlEQUFhQTtRQUd0RSxJQUFJLENBQUNpQyxRQUFRLEdBQUcsTUFBTWxDLGdEQUFJQSxDQUFDNEMsVUFBVSxDQUFDRDtRQUN0QyxJQUFJLENBQUNELFlBQVksR0FBRyxNQUFNMUMsZ0RBQUlBLENBQUM2QyxTQUFTLENBQUNGLFNBQVMsQ0FBQ1Y7WUFDakQsSUFBSSxDQUFDQyxRQUFRLENBQUNZLElBQUksQ0FBQ2I7UUFDckI7SUFDRjtJQXZFQWMsYUFBYzthQUhOYixXQUE2QixFQUFFO0lBR3hCO0FBd0VqQjtBQUVPLE1BQU1jLFFBQVEsSUFBSXBDLFFBQVEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3JjL3NlcnZpY2VzL25vdGVzLnRzPzQ4Y2YiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgY2xpZW50XCI7XG5cbmltcG9ydCB7IHdha3UgfSBmcm9tIFwiQC9zZXJ2aWNlcy93YWt1XCI7XG5pbXBvcnQgeyBDT05URU5UX1RPUElDIH0gZnJvbSBcIkAvY29uc3RcIjtcbmltcG9ydCB7XG4gIGNyZWF0ZUVuY29kZXIsXG4gIGNyZWF0ZURlY29kZXIsXG4gIGdlbmVyYXRlU3ltbWV0cmljS2V5LFxufSBmcm9tIFwiQHdha3UvbWVzc2FnZS1lbmNyeXB0aW9uL3N5bW1ldHJpY1wiO1xuaW1wb3J0IHsgRGVjb2RlZE1lc3NhZ2UgfSBmcm9tIFwiQHdha3UvbWVzc2FnZS1lbmNyeXB0aW9uXCI7XG5pbXBvcnQgeyBVbnN1YnNjcmliZSwgdXRmOFRvQnl0ZXMsIGJ5dGVzVG9VdGY4IH0gZnJvbSBcIkB3YWt1L3Nka1wiO1xuaW1wb3J0IHsgYnl0ZXNUb0hleCwgaGV4VG9CeXRlcyB9IGZyb20gXCJAd2FrdS91dGlscy9ieXRlc1wiO1xuaW1wb3J0IHtcbiAgY29udGVudFRvcGljVG9QdWJzdWJUb3BpYyxcbiAgcHVic3ViVG9waWNUb1NpbmdsZVNoYXJkSW5mbyxcbn0gZnJvbSBcIkB3YWt1L3V0aWxzXCI7XG5cbmNvbnN0IFVVSURfVjRfU1RSX0xFTiA9IDggKyAxICsgNCArIDEgKyA0ICsgMSArIDQgKyAxICsgMTI7IC8vIDgtNC00LTQtMTIgZm9ybWF0XG5cbnR5cGUgTm90ZSA9IHtcbiAgaWQ6IHN0cmluZztcbiAgY29udGVudDogc3RyaW5nO1xufTtcblxudHlwZSBOb3RlUmVzdWx0ID0ge1xuICBpZDogc3RyaW5nO1xuICBrZXk6IHN0cmluZztcbn07XG5cbmV4cG9ydCBjbGFzcyBOb3RlcyB7XG4gIHByaXZhdGUgbWVzc2FnZXM6IERlY29kZWRNZXNzYWdlW10gPSBbXTtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb246IHVuZGVmaW5lZCB8IFVuc3Vic2NyaWJlO1xuXG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBwdWJsaWMgYXN5bmMgY3JlYXRlTm90ZShjb250ZW50OiBzdHJpbmcpOiBQcm9taXNlPE5vdGVSZXN1bHQ+IHtcbiAgICBjb25zdCBzeW1LZXkgPSBnZW5lcmF0ZVN5bW1ldHJpY0tleSgpO1xuXG4gICAgY29uc3QgZW5jb2RlciA9IGNyZWF0ZUVuY29kZXIoe1xuICAgICAgY29udGVudFRvcGljOiBDT05URU5UX1RPUElDLFxuICAgICAgc3ltS2V5LFxuICAgICAgcHVic3ViVG9waWNTaGFyZEluZm86IHB1YnN1YlRvcGljVG9TaW5nbGVTaGFyZEluZm8oXG4gICAgICAgIGNvbnRlbnRUb3BpY1RvUHVic3ViVG9waWMoQ09OVEVOVF9UT1BJQylcbiAgICAgICksXG4gICAgICBwdWJzdWJUb3BpYzogY29udGVudFRvcGljVG9QdWJzdWJUb3BpYyhDT05URU5UX1RPUElDKVxuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKGVuY29kZXIpXG4gICAgY29uc3QgaWQgPSBzZWxmLmNyeXB0by5yYW5kb21VVUlEKCk7XG5cbiAgICBpZiAoaWQubGVuZ3RoICE9PSBVVUlEX1Y0X1NUUl9MRU4pIHtcbiAgICAgIHRocm93IFwiVW5leHBlY3RlZCB1dWlkIGxlbmd0aFwiO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHdha3Uuc2VuZChlbmNvZGVyLCB7XG4gICAgICBwYXlsb2FkOiB1dGY4VG9CeXRlcyhpZCArIGNvbnRlbnQpLFxuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKHJlc3VsdClcblxuICAgIHJldHVybiB7XG4gICAgICBpZCxcbiAgICAgIGtleTogYnl0ZXNUb0hleChzeW1LZXkpLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgcmVhZE5vdGUoaWQ6IHN0cmluZywga2V5OiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4ge1xuICAgIGF3YWl0IHRoaXMuaW5pdE1lc3NhZ2VzKGhleFRvQnl0ZXMoa2V5KSk7XG5cbiAgICBjb25zdCBtZXNzYWdlID0gdGhpcy5tZXNzYWdlc1xuICAgICAgLm1hcCgobSkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHN0ciA9IGJ5dGVzVG9VdGY4KG0ucGF5bG9hZCk7XG5cbiAgICAgICAgICBjb25zdCBpZCA9IHN0ci5zdWJzdHJpbmcoMCwgVVVJRF9WNF9TVFJfTEVOKTtcbiAgICAgICAgICBjb25zdCBjb250ZW50ID0gc3RyLnN1YnN0cmluZyhVVUlEX1Y0X1NUUl9MRU4pO1xuXG4gICAgICAgICAgcmV0dXJuIHsgaWQsIGNvbnRlbnQgfSBhcyBOb3RlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmFpbGVkIHRvIHJlYWQgbWVzc2FnZTpcIiwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmZpbmQoKHYpID0+IHtcbiAgICAgICAgaWYgKHY/LmlkID09PSBpZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHJldHVybiBtZXNzYWdlPy5jb250ZW50O1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBpbml0TWVzc2FnZXMoa2V5OiBVaW50OEFycmF5KSB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZGVjb2RlciA9IGNyZWF0ZURlY29kZXIoXG4gICAgICBDT05URU5UX1RPUElDLFxuICAgICAga2V5LFxuICAgICAgcHVic3ViVG9waWNUb1NpbmdsZVNoYXJkSW5mbyhjb250ZW50VG9waWNUb1B1YnN1YlRvcGljKENPTlRFTlRfVE9QSUMpKVxuICAgICk7XG5cbiAgICB0aGlzLm1lc3NhZ2VzID0gYXdhaXQgd2FrdS5nZXRIaXN0b3J5KGRlY29kZXIpIGFzIERlY29kZWRNZXNzYWdlW107XG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSBhd2FpdCB3YWt1LnN1YnNjcmliZShkZWNvZGVyLCAobWVzc2FnZSkgPT4ge1xuICAgICAgdGhpcy5tZXNzYWdlcy5wdXNoKG1lc3NhZ2UgYXMgRGVjb2RlZE1lc3NhZ2UpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBub3RlcyA9IG5ldyBOb3RlcygpO1xuIl0sIm5hbWVzIjpbIndha3UiLCJDT05URU5UX1RPUElDIiwiY3JlYXRlRW5jb2RlciIsImNyZWF0ZURlY29kZXIiLCJnZW5lcmF0ZVN5bW1ldHJpY0tleSIsInV0ZjhUb0J5dGVzIiwiYnl0ZXNUb1V0ZjgiLCJieXRlc1RvSGV4IiwiaGV4VG9CeXRlcyIsImNvbnRlbnRUb3BpY1RvUHVic3ViVG9waWMiLCJwdWJzdWJUb3BpY1RvU2luZ2xlU2hhcmRJbmZvIiwiVVVJRF9WNF9TVFJfTEVOIiwiTm90ZXMiLCJjcmVhdGVOb3RlIiwiY29udGVudCIsInN5bUtleSIsImVuY29kZXIiLCJjb250ZW50VG9waWMiLCJwdWJzdWJUb3BpY1NoYXJkSW5mbyIsInB1YnN1YlRvcGljIiwiY29uc29sZSIsImxvZyIsImlkIiwic2VsZiIsImNyeXB0byIsInJhbmRvbVVVSUQiLCJsZW5ndGgiLCJyZXN1bHQiLCJzZW5kIiwicGF5bG9hZCIsImtleSIsInJlYWROb3RlIiwiaW5pdE1lc3NhZ2VzIiwibWVzc2FnZSIsIm1lc3NhZ2VzIiwibWFwIiwibSIsInN0ciIsInN1YnN0cmluZyIsImVycm9yIiwiZmluZCIsInYiLCJzdWJzY3JpcHRpb24iLCJkZWNvZGVyIiwiZ2V0SGlzdG9yeSIsInN1YnNjcmliZSIsInB1c2giLCJjb25zdHJ1Y3RvciIsIm5vdGVzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/services/notes.ts\n"));

/***/ })

});