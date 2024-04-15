"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/it-peekable";
exports.ids = ["vendor-chunks/it-peekable"];
exports.modules = {

/***/ "(ssr)/./node_modules/it-peekable/dist/src/index.js":
/*!****************************************************!*\
  !*** ./node_modules/it-peekable/dist/src/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/**\n * @packageDocumentation\n *\n * Lets you look at the contents of an async iterator and decide what to do\n *\n * @example\n *\n * ```javascript\n * import peekable from 'it-peekable'\n *\n * // This can also be an iterator, generator, etc\n * const values = [0, 1, 2, 3, 4]\n *\n * const it = peekable(value)\n *\n * const first = it.peek()\n *\n * console.info(first) // 0\n *\n * it.push(first)\n *\n * console.info([...it])\n * // [ 0, 1, 2, 3, 4 ]\n * ```\n *\n * Async sources must be awaited:\n *\n * ```javascript\n * import peekable from 'it-peekable'\n *\n * const values = async function * () {\n *   yield * [0, 1, 2, 3, 4]\n * }\n *\n * const it = peekable(values())\n *\n * const first = await it.peek()\n *\n * console.info(first) // 0\n *\n * it.push(first)\n *\n * console.info(await all(it))\n * // [ 0, 1, 2, 3, 4 ]\n * ```\n */ function peekable(iterable) {\n    // @ts-expect-error can't use Symbol.asyncIterator to index iterable since it might be Iterable\n    const [iterator, symbol] = iterable[Symbol.asyncIterator] != null ? [\n        iterable[Symbol.asyncIterator](),\n        Symbol.asyncIterator\n    ] : [\n        iterable[Symbol.iterator](),\n        Symbol.iterator\n    ];\n    const queue = [];\n    // @ts-expect-error can't use symbol to index peekable\n    return {\n        peek: ()=>{\n            return iterator.next();\n        },\n        push: (value)=>{\n            queue.push(value);\n        },\n        next: ()=>{\n            if (queue.length > 0) {\n                return {\n                    done: false,\n                    value: queue.shift()\n                };\n            }\n            return iterator.next();\n        },\n        [symbol] () {\n            return this;\n        }\n    };\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (peekable); //# sourceMappingURL=index.js.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXQtcGVla2FibGUvZGlzdC9zcmMvaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0E2Q0MsR0FDRCxTQUFTQSxTQUFTQyxRQUFRO0lBQ3RCLCtGQUErRjtJQUMvRixNQUFNLENBQUNDLFVBQVVDLE9BQU8sR0FBR0YsUUFBUSxDQUFDRyxPQUFPQyxhQUFhLENBQUMsSUFBSSxPQUV2RDtRQUFDSixRQUFRLENBQUNHLE9BQU9DLGFBQWEsQ0FBQztRQUFJRCxPQUFPQyxhQUFhO0tBQUMsR0FFeEQ7UUFBQ0osUUFBUSxDQUFDRyxPQUFPRixRQUFRLENBQUM7UUFBSUUsT0FBT0YsUUFBUTtLQUFDO0lBQ3BELE1BQU1JLFFBQVEsRUFBRTtJQUNoQixzREFBc0Q7SUFDdEQsT0FBTztRQUNIQyxNQUFNO1lBQ0YsT0FBT0wsU0FBU00sSUFBSTtRQUN4QjtRQUNBQyxNQUFNLENBQUNDO1lBQ0hKLE1BQU1HLElBQUksQ0FBQ0M7UUFDZjtRQUNBRixNQUFNO1lBQ0YsSUFBSUYsTUFBTUssTUFBTSxHQUFHLEdBQUc7Z0JBQ2xCLE9BQU87b0JBQ0hDLE1BQU07b0JBQ05GLE9BQU9KLE1BQU1PLEtBQUs7Z0JBQ3RCO1lBQ0o7WUFDQSxPQUFPWCxTQUFTTSxJQUFJO1FBQ3hCO1FBQ0EsQ0FBQ0wsT0FBTztZQUNKLE9BQU8sSUFBSTtRQUNmO0lBQ0o7QUFDSjtBQUNBLGlFQUFlSCxRQUFRQSxFQUFDLENBQ3hCLGlDQUFpQyIsInNvdXJjZXMiOlsid2VicGFjazovL2ZsdXNoLW5vdGVzLy4vbm9kZV9tb2R1bGVzL2l0LXBlZWthYmxlL2Rpc3Qvc3JjL2luZGV4LmpzPzAwZTIiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqXG4gKiBMZXRzIHlvdSBsb29rIGF0IHRoZSBjb250ZW50cyBvZiBhbiBhc3luYyBpdGVyYXRvciBhbmQgZGVjaWRlIHdoYXQgdG8gZG9cbiAqXG4gKiBAZXhhbXBsZVxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCBwZWVrYWJsZSBmcm9tICdpdC1wZWVrYWJsZSdcbiAqXG4gKiAvLyBUaGlzIGNhbiBhbHNvIGJlIGFuIGl0ZXJhdG9yLCBnZW5lcmF0b3IsIGV0Y1xuICogY29uc3QgdmFsdWVzID0gWzAsIDEsIDIsIDMsIDRdXG4gKlxuICogY29uc3QgaXQgPSBwZWVrYWJsZSh2YWx1ZSlcbiAqXG4gKiBjb25zdCBmaXJzdCA9IGl0LnBlZWsoKVxuICpcbiAqIGNvbnNvbGUuaW5mbyhmaXJzdCkgLy8gMFxuICpcbiAqIGl0LnB1c2goZmlyc3QpXG4gKlxuICogY29uc29sZS5pbmZvKFsuLi5pdF0pXG4gKiAvLyBbIDAsIDEsIDIsIDMsIDQgXVxuICogYGBgXG4gKlxuICogQXN5bmMgc291cmNlcyBtdXN0IGJlIGF3YWl0ZWQ6XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHBlZWthYmxlIGZyb20gJ2l0LXBlZWthYmxlJ1xuICpcbiAqIGNvbnN0IHZhbHVlcyA9IGFzeW5jIGZ1bmN0aW9uICogKCkge1xuICogICB5aWVsZCAqIFswLCAxLCAyLCAzLCA0XVxuICogfVxuICpcbiAqIGNvbnN0IGl0ID0gcGVla2FibGUodmFsdWVzKCkpXG4gKlxuICogY29uc3QgZmlyc3QgPSBhd2FpdCBpdC5wZWVrKClcbiAqXG4gKiBjb25zb2xlLmluZm8oZmlyc3QpIC8vIDBcbiAqXG4gKiBpdC5wdXNoKGZpcnN0KVxuICpcbiAqIGNvbnNvbGUuaW5mbyhhd2FpdCBhbGwoaXQpKVxuICogLy8gWyAwLCAxLCAyLCAzLCA0IF1cbiAqIGBgYFxuICovXG5mdW5jdGlvbiBwZWVrYWJsZShpdGVyYWJsZSkge1xuICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgY2FuJ3QgdXNlIFN5bWJvbC5hc3luY0l0ZXJhdG9yIHRvIGluZGV4IGl0ZXJhYmxlIHNpbmNlIGl0IG1pZ2h0IGJlIEl0ZXJhYmxlXG4gICAgY29uc3QgW2l0ZXJhdG9yLCBzeW1ib2xdID0gaXRlcmFibGVbU3ltYm9sLmFzeW5jSXRlcmF0b3JdICE9IG51bGxcbiAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciBjYW4ndCB1c2UgU3ltYm9sLmFzeW5jSXRlcmF0b3IgdG8gaW5kZXggaXRlcmFibGUgc2luY2UgaXQgbWlnaHQgYmUgSXRlcmFibGVcbiAgICAgICAgPyBbaXRlcmFibGVbU3ltYm9sLmFzeW5jSXRlcmF0b3JdKCksIFN5bWJvbC5hc3luY0l0ZXJhdG9yXVxuICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIGNhbid0IHVzZSBTeW1ib2wuaXRlcmF0b3IgdG8gaW5kZXggaXRlcmFibGUgc2luY2UgaXQgbWlnaHQgYmUgQXN5bmNJdGVyYWJsZVxuICAgICAgICA6IFtpdGVyYWJsZVtTeW1ib2wuaXRlcmF0b3JdKCksIFN5bWJvbC5pdGVyYXRvcl07XG4gICAgY29uc3QgcXVldWUgPSBbXTtcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yIGNhbid0IHVzZSBzeW1ib2wgdG8gaW5kZXggcGVla2FibGVcbiAgICByZXR1cm4ge1xuICAgICAgICBwZWVrOiAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICB9LFxuICAgICAgICBwdXNoOiAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2godmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBuZXh0OiAoKSA9PiB7XG4gICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGRvbmU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcXVldWUuc2hpZnQoKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICB9LFxuICAgICAgICBbc3ltYm9sXSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmV4cG9ydCBkZWZhdWx0IHBlZWthYmxlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIl0sIm5hbWVzIjpbInBlZWthYmxlIiwiaXRlcmFibGUiLCJpdGVyYXRvciIsInN5bWJvbCIsIlN5bWJvbCIsImFzeW5jSXRlcmF0b3IiLCJxdWV1ZSIsInBlZWsiLCJuZXh0IiwicHVzaCIsInZhbHVlIiwibGVuZ3RoIiwiZG9uZSIsInNoaWZ0Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/it-peekable/dist/src/index.js\n");

/***/ })

};
;