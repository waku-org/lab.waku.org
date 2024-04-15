"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/it-pipe";
exports.ids = ["vendor-chunks/it-pipe"];
exports.modules = {

/***/ "(ssr)/./node_modules/it-pipe/dist/src/index.js":
/*!************************************************!*\
  !*** ./node_modules/it-pipe/dist/src/index.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   pipe: () => (/* binding */ pipe),\n/* harmony export */   rawPipe: () => (/* binding */ rawPipe)\n/* harmony export */ });\n/* harmony import */ var it_pushable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! it-pushable */ \"(ssr)/./node_modules/it-pushable/dist/src/index.js\");\n/* harmony import */ var it_merge__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! it-merge */ \"(ssr)/./node_modules/it-merge/dist/src/index.js\");\n\n\nfunction pipe(first, ...rest) {\n    if (first == null) {\n        throw new Error(\"Empty pipeline\");\n    }\n    // Duplex at start: wrap in function and return duplex source\n    if (isDuplex(first)) {\n        const duplex = first;\n        first = ()=>duplex.source;\n    // Iterable at start: wrap in function\n    } else if (isIterable(first) || isAsyncIterable(first)) {\n        const source = first;\n        first = ()=>source;\n    }\n    const fns = [\n        first,\n        ...rest\n    ];\n    if (fns.length > 1) {\n        // Duplex at end: use duplex sink\n        if (isDuplex(fns[fns.length - 1])) {\n            fns[fns.length - 1] = fns[fns.length - 1].sink;\n        }\n    }\n    if (fns.length > 2) {\n        // Duplex in the middle, consume source with duplex sink and return duplex source\n        for(let i = 1; i < fns.length - 1; i++){\n            if (isDuplex(fns[i])) {\n                fns[i] = duplexPipelineFn(fns[i]);\n            }\n        }\n    }\n    return rawPipe(...fns);\n}\nconst rawPipe = (...fns)=>{\n    let res;\n    while(fns.length > 0){\n        res = fns.shift()(res);\n    }\n    return res;\n};\nconst isAsyncIterable = (obj)=>{\n    return obj?.[Symbol.asyncIterator] != null;\n};\nconst isIterable = (obj)=>{\n    return obj?.[Symbol.iterator] != null;\n};\nconst isDuplex = (obj)=>{\n    if (obj == null) {\n        return false;\n    }\n    return obj.sink != null && obj.source != null;\n};\nconst duplexPipelineFn = (duplex)=>{\n    return (source)=>{\n        const p = duplex.sink(source);\n        if (p?.then != null) {\n            const stream = (0,it_pushable__WEBPACK_IMPORTED_MODULE_0__.pushable)({\n                objectMode: true\n            });\n            p.then(()=>{\n                stream.end();\n            }, (err)=>{\n                stream.end(err);\n            });\n            let sourceWrap;\n            const source = duplex.source;\n            if (isAsyncIterable(source)) {\n                sourceWrap = async function*() {\n                    yield* source;\n                    stream.end();\n                };\n            } else if (isIterable(source)) {\n                sourceWrap = function*() {\n                    yield* source;\n                    stream.end();\n                };\n            } else {\n                throw new Error(\"Unknown duplex source type - must be Iterable or AsyncIterable\");\n            }\n            return (0,it_merge__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(stream, sourceWrap());\n        }\n        return duplex.source;\n    };\n}; //# sourceMappingURL=index.js.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXQtcGlwZS9kaXN0L3NyYy9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQXVDO0FBQ1Y7QUFDdEIsU0FBU0UsS0FBS0MsS0FBSyxFQUFFLEdBQUdDLElBQUk7SUFDL0IsSUFBSUQsU0FBUyxNQUFNO1FBQ2YsTUFBTSxJQUFJRSxNQUFNO0lBQ3BCO0lBQ0EsNkRBQTZEO0lBQzdELElBQUlDLFNBQVNILFFBQVE7UUFDakIsTUFBTUksU0FBU0o7UUFDZkEsUUFBUSxJQUFNSSxPQUFPQyxNQUFNO0lBQzNCLHNDQUFzQztJQUMxQyxPQUNLLElBQUlDLFdBQVdOLFVBQVVPLGdCQUFnQlAsUUFBUTtRQUNsRCxNQUFNSyxTQUFTTDtRQUNmQSxRQUFRLElBQU1LO0lBQ2xCO0lBQ0EsTUFBTUcsTUFBTTtRQUFDUjtXQUFVQztLQUFLO0lBQzVCLElBQUlPLElBQUlDLE1BQU0sR0FBRyxHQUFHO1FBQ2hCLGlDQUFpQztRQUNqQyxJQUFJTixTQUFTSyxHQUFHLENBQUNBLElBQUlDLE1BQU0sR0FBRyxFQUFFLEdBQUc7WUFDL0JELEdBQUcsQ0FBQ0EsSUFBSUMsTUFBTSxHQUFHLEVBQUUsR0FBR0QsR0FBRyxDQUFDQSxJQUFJQyxNQUFNLEdBQUcsRUFBRSxDQUFDQyxJQUFJO1FBQ2xEO0lBQ0o7SUFDQSxJQUFJRixJQUFJQyxNQUFNLEdBQUcsR0FBRztRQUNoQixpRkFBaUY7UUFDakYsSUFBSyxJQUFJRSxJQUFJLEdBQUdBLElBQUlILElBQUlDLE1BQU0sR0FBRyxHQUFHRSxJQUFLO1lBQ3JDLElBQUlSLFNBQVNLLEdBQUcsQ0FBQ0csRUFBRSxHQUFHO2dCQUNsQkgsR0FBRyxDQUFDRyxFQUFFLEdBQUdDLGlCQUFpQkosR0FBRyxDQUFDRyxFQUFFO1lBQ3BDO1FBQ0o7SUFDSjtJQUNBLE9BQU9FLFdBQVdMO0FBQ3RCO0FBQ08sTUFBTUssVUFBVSxDQUFDLEdBQUdMO0lBQ3ZCLElBQUlNO0lBQ0osTUFBT04sSUFBSUMsTUFBTSxHQUFHLEVBQUc7UUFDbkJLLE1BQU1OLElBQUlPLEtBQUssR0FBR0Q7SUFDdEI7SUFDQSxPQUFPQTtBQUNYLEVBQUU7QUFDRixNQUFNUCxrQkFBa0IsQ0FBQ1M7SUFDckIsT0FBT0EsS0FBSyxDQUFDQyxPQUFPQyxhQUFhLENBQUMsSUFBSTtBQUMxQztBQUNBLE1BQU1aLGFBQWEsQ0FBQ1U7SUFDaEIsT0FBT0EsS0FBSyxDQUFDQyxPQUFPRSxRQUFRLENBQUMsSUFBSTtBQUNyQztBQUNBLE1BQU1oQixXQUFXLENBQUNhO0lBQ2QsSUFBSUEsT0FBTyxNQUFNO1FBQ2IsT0FBTztJQUNYO0lBQ0EsT0FBT0EsSUFBSU4sSUFBSSxJQUFJLFFBQVFNLElBQUlYLE1BQU0sSUFBSTtBQUM3QztBQUNBLE1BQU1PLG1CQUFtQixDQUFDUjtJQUN0QixPQUFPLENBQUNDO1FBQ0osTUFBTWUsSUFBSWhCLE9BQU9NLElBQUksQ0FBQ0w7UUFDdEIsSUFBSWUsR0FBR0MsUUFBUSxNQUFNO1lBQ2pCLE1BQU1DLFNBQVN6QixxREFBUUEsQ0FBQztnQkFDcEIwQixZQUFZO1lBQ2hCO1lBQ0FILEVBQUVDLElBQUksQ0FBQztnQkFDSEMsT0FBT0UsR0FBRztZQUNkLEdBQUcsQ0FBQ0M7Z0JBQ0FILE9BQU9FLEdBQUcsQ0FBQ0M7WUFDZjtZQUNBLElBQUlDO1lBQ0osTUFBTXJCLFNBQVNELE9BQU9DLE1BQU07WUFDNUIsSUFBSUUsZ0JBQWdCRixTQUFTO2dCQUN6QnFCLGFBQWE7b0JBQ1QsT0FBT3JCO29CQUNQaUIsT0FBT0UsR0FBRztnQkFDZDtZQUNKLE9BQ0ssSUFBSWxCLFdBQVdELFNBQVM7Z0JBQ3pCcUIsYUFBYTtvQkFDVCxPQUFPckI7b0JBQ1BpQixPQUFPRSxHQUFHO2dCQUNkO1lBQ0osT0FDSztnQkFDRCxNQUFNLElBQUl0QixNQUFNO1lBQ3BCO1lBQ0EsT0FBT0osb0RBQUtBLENBQUN3QixRQUFRSTtRQUN6QjtRQUNBLE9BQU90QixPQUFPQyxNQUFNO0lBQ3hCO0FBQ0osR0FDQSxpQ0FBaUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mbHVzaC1ub3Rlcy8uL25vZGVfbW9kdWxlcy9pdC1waXBlL2Rpc3Qvc3JjL2luZGV4LmpzPzNlMjciXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcHVzaGFibGUgfSBmcm9tICdpdC1wdXNoYWJsZSc7XG5pbXBvcnQgbWVyZ2UgZnJvbSAnaXQtbWVyZ2UnO1xuZXhwb3J0IGZ1bmN0aW9uIHBpcGUoZmlyc3QsIC4uLnJlc3QpIHtcbiAgICBpZiAoZmlyc3QgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VtcHR5IHBpcGVsaW5lJyk7XG4gICAgfVxuICAgIC8vIER1cGxleCBhdCBzdGFydDogd3JhcCBpbiBmdW5jdGlvbiBhbmQgcmV0dXJuIGR1cGxleCBzb3VyY2VcbiAgICBpZiAoaXNEdXBsZXgoZmlyc3QpKSB7XG4gICAgICAgIGNvbnN0IGR1cGxleCA9IGZpcnN0O1xuICAgICAgICBmaXJzdCA9ICgpID0+IGR1cGxleC5zb3VyY2U7XG4gICAgICAgIC8vIEl0ZXJhYmxlIGF0IHN0YXJ0OiB3cmFwIGluIGZ1bmN0aW9uXG4gICAgfVxuICAgIGVsc2UgaWYgKGlzSXRlcmFibGUoZmlyc3QpIHx8IGlzQXN5bmNJdGVyYWJsZShmaXJzdCkpIHtcbiAgICAgICAgY29uc3Qgc291cmNlID0gZmlyc3Q7XG4gICAgICAgIGZpcnN0ID0gKCkgPT4gc291cmNlO1xuICAgIH1cbiAgICBjb25zdCBmbnMgPSBbZmlyc3QsIC4uLnJlc3RdO1xuICAgIGlmIChmbnMubGVuZ3RoID4gMSkge1xuICAgICAgICAvLyBEdXBsZXggYXQgZW5kOiB1c2UgZHVwbGV4IHNpbmtcbiAgICAgICAgaWYgKGlzRHVwbGV4KGZuc1tmbnMubGVuZ3RoIC0gMV0pKSB7XG4gICAgICAgICAgICBmbnNbZm5zLmxlbmd0aCAtIDFdID0gZm5zW2Zucy5sZW5ndGggLSAxXS5zaW5rO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChmbnMubGVuZ3RoID4gMikge1xuICAgICAgICAvLyBEdXBsZXggaW4gdGhlIG1pZGRsZSwgY29uc3VtZSBzb3VyY2Ugd2l0aCBkdXBsZXggc2luayBhbmQgcmV0dXJuIGR1cGxleCBzb3VyY2VcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBmbnMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaXNEdXBsZXgoZm5zW2ldKSkge1xuICAgICAgICAgICAgICAgIGZuc1tpXSA9IGR1cGxleFBpcGVsaW5lRm4oZm5zW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmF3UGlwZSguLi5mbnMpO1xufVxuZXhwb3J0IGNvbnN0IHJhd1BpcGUgPSAoLi4uZm5zKSA9PiB7XG4gICAgbGV0IHJlcztcbiAgICB3aGlsZSAoZm5zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVzID0gZm5zLnNoaWZ0KCkocmVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn07XG5jb25zdCBpc0FzeW5jSXRlcmFibGUgPSAob2JqKSA9PiB7XG4gICAgcmV0dXJuIG9iaj8uW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSAhPSBudWxsO1xufTtcbmNvbnN0IGlzSXRlcmFibGUgPSAob2JqKSA9PiB7XG4gICAgcmV0dXJuIG9iaj8uW1N5bWJvbC5pdGVyYXRvcl0gIT0gbnVsbDtcbn07XG5jb25zdCBpc0R1cGxleCA9IChvYmopID0+IHtcbiAgICBpZiAob2JqID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gb2JqLnNpbmsgIT0gbnVsbCAmJiBvYmouc291cmNlICE9IG51bGw7XG59O1xuY29uc3QgZHVwbGV4UGlwZWxpbmVGbiA9IChkdXBsZXgpID0+IHtcbiAgICByZXR1cm4gKHNvdXJjZSkgPT4ge1xuICAgICAgICBjb25zdCBwID0gZHVwbGV4LnNpbmsoc291cmNlKTtcbiAgICAgICAgaWYgKHA/LnRoZW4gIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3Qgc3RyZWFtID0gcHVzaGFibGUoe1xuICAgICAgICAgICAgICAgIG9iamVjdE1vZGU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBzdHJlYW0uZW5kKCk7XG4gICAgICAgICAgICB9LCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgc3RyZWFtLmVuZChlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBsZXQgc291cmNlV3JhcDtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZSA9IGR1cGxleC5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoaXNBc3luY0l0ZXJhYmxlKHNvdXJjZSkpIHtcbiAgICAgICAgICAgICAgICBzb3VyY2VXcmFwID0gYXN5bmMgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQqIHNvdXJjZTtcbiAgICAgICAgICAgICAgICAgICAgc3RyZWFtLmVuZCgpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc0l0ZXJhYmxlKHNvdXJjZSkpIHtcbiAgICAgICAgICAgICAgICBzb3VyY2VXcmFwID0gZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQqIHNvdXJjZTtcbiAgICAgICAgICAgICAgICAgICAgc3RyZWFtLmVuZCgpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZHVwbGV4IHNvdXJjZSB0eXBlIC0gbXVzdCBiZSBJdGVyYWJsZSBvciBBc3luY0l0ZXJhYmxlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbWVyZ2Uoc3RyZWFtLCBzb3VyY2VXcmFwKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkdXBsZXguc291cmNlO1xuICAgIH07XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIl0sIm5hbWVzIjpbInB1c2hhYmxlIiwibWVyZ2UiLCJwaXBlIiwiZmlyc3QiLCJyZXN0IiwiRXJyb3IiLCJpc0R1cGxleCIsImR1cGxleCIsInNvdXJjZSIsImlzSXRlcmFibGUiLCJpc0FzeW5jSXRlcmFibGUiLCJmbnMiLCJsZW5ndGgiLCJzaW5rIiwiaSIsImR1cGxleFBpcGVsaW5lRm4iLCJyYXdQaXBlIiwicmVzIiwic2hpZnQiLCJvYmoiLCJTeW1ib2wiLCJhc3luY0l0ZXJhdG9yIiwiaXRlcmF0b3IiLCJwIiwidGhlbiIsInN0cmVhbSIsIm9iamVjdE1vZGUiLCJlbmQiLCJlcnIiLCJzb3VyY2VXcmFwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/it-pipe/dist/src/index.js\n");

/***/ })

};
;