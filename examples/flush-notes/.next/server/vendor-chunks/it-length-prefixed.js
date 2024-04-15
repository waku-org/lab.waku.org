"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/it-length-prefixed";
exports.ids = ["vendor-chunks/it-length-prefixed"];
exports.modules = {

/***/ "(ssr)/./node_modules/it-length-prefixed/dist/src/decode.js":
/*!************************************************************!*\
  !*** ./node_modules/it-length-prefixed/dist/src/decode.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   MAX_DATA_LENGTH: () => (/* binding */ MAX_DATA_LENGTH),\n/* harmony export */   MAX_LENGTH_LENGTH: () => (/* binding */ MAX_LENGTH_LENGTH),\n/* harmony export */   decode: () => (/* binding */ decode)\n/* harmony export */ });\n/* harmony import */ var err_code__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! err-code */ \"(ssr)/./node_modules/err-code/index.js\");\n/* harmony import */ var uint8_varint__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uint8-varint */ \"(ssr)/./node_modules/uint8-varint/dist/src/index.js\");\n/* harmony import */ var uint8arraylist__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! uint8arraylist */ \"(ssr)/./node_modules/uint8arraylist/dist/src/index.js\");\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ \"(ssr)/./node_modules/it-length-prefixed/dist/src/utils.js\");\n/* eslint max-depth: [\"error\", 6] */ \n\n\n\n// Maximum length of the length section of the message\nconst MAX_LENGTH_LENGTH = 8; // Varint.encode(Number.MAX_SAFE_INTEGER).length\n// Maximum length of the data section of the message\nconst MAX_DATA_LENGTH = 1024 * 1024 * 4;\nvar ReadMode;\n(function(ReadMode) {\n    ReadMode[ReadMode[\"LENGTH\"] = 0] = \"LENGTH\";\n    ReadMode[ReadMode[\"DATA\"] = 1] = \"DATA\";\n})(ReadMode || (ReadMode = {}));\nconst defaultDecoder = (buf)=>{\n    const length = uint8_varint__WEBPACK_IMPORTED_MODULE_1__.decode(buf);\n    defaultDecoder.bytes = uint8_varint__WEBPACK_IMPORTED_MODULE_1__.encodingLength(length);\n    return length;\n};\ndefaultDecoder.bytes = 0;\nfunction decode(source, options) {\n    const buffer = new uint8arraylist__WEBPACK_IMPORTED_MODULE_2__.Uint8ArrayList();\n    let mode = ReadMode.LENGTH;\n    let dataLength = -1;\n    const lengthDecoder = options?.lengthDecoder ?? defaultDecoder;\n    const maxLengthLength = options?.maxLengthLength ?? MAX_LENGTH_LENGTH;\n    const maxDataLength = options?.maxDataLength ?? MAX_DATA_LENGTH;\n    function* maybeYield() {\n        while(buffer.byteLength > 0){\n            if (mode === ReadMode.LENGTH) {\n                // read length, ignore errors for short reads\n                try {\n                    dataLength = lengthDecoder(buffer);\n                    if (dataLength < 0) {\n                        throw err_code__WEBPACK_IMPORTED_MODULE_0__(new Error(\"invalid message length\"), \"ERR_INVALID_MSG_LENGTH\");\n                    }\n                    if (dataLength > maxDataLength) {\n                        throw err_code__WEBPACK_IMPORTED_MODULE_0__(new Error(\"message length too long\"), \"ERR_MSG_DATA_TOO_LONG\");\n                    }\n                    const dataLengthLength = lengthDecoder.bytes;\n                    buffer.consume(dataLengthLength);\n                    if (options?.onLength != null) {\n                        options.onLength(dataLength);\n                    }\n                    mode = ReadMode.DATA;\n                } catch (err) {\n                    if (err instanceof RangeError) {\n                        if (buffer.byteLength > maxLengthLength) {\n                            throw err_code__WEBPACK_IMPORTED_MODULE_0__(new Error(\"message length length too long\"), \"ERR_MSG_LENGTH_TOO_LONG\");\n                        }\n                        break;\n                    }\n                    throw err;\n                }\n            }\n            if (mode === ReadMode.DATA) {\n                if (buffer.byteLength < dataLength) {\n                    break;\n                }\n                const data = buffer.sublist(0, dataLength);\n                buffer.consume(dataLength);\n                if (options?.onData != null) {\n                    options.onData(data);\n                }\n                yield data;\n                mode = ReadMode.LENGTH;\n            }\n        }\n    }\n    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isAsyncIterable)(source)) {\n        return async function*() {\n            for await (const buf of source){\n                buffer.append(buf);\n                yield* maybeYield();\n            }\n            if (buffer.byteLength > 0) {\n                throw err_code__WEBPACK_IMPORTED_MODULE_0__(new Error(\"unexpected end of input\"), \"ERR_UNEXPECTED_EOF\");\n            }\n        }();\n    }\n    return function*() {\n        for (const buf of source){\n            buffer.append(buf);\n            yield* maybeYield();\n        }\n        if (buffer.byteLength > 0) {\n            throw err_code__WEBPACK_IMPORTED_MODULE_0__(new Error(\"unexpected end of input\"), \"ERR_UNEXPECTED_EOF\");\n        }\n    }();\n}\ndecode.fromReader = (reader, options)=>{\n    let byteLength = 1; // Read single byte chunks until the length is known\n    const varByteSource = async function*() {\n        while(true){\n            try {\n                const { done, value } = await reader.next(byteLength);\n                if (done === true) {\n                    return;\n                }\n                if (value != null) {\n                    yield value;\n                }\n            } catch (err) {\n                if (err.code === \"ERR_UNDER_READ\") {\n                    return {\n                        done: true,\n                        value: null\n                    };\n                }\n                throw err;\n            } finally{\n                // Reset the byteLength so we continue to check for varints\n                byteLength = 1;\n            }\n        }\n    }();\n    /**\n     * Once the length has been parsed, read chunk for that length\n     */ const onLength = (l)=>{\n        byteLength = l;\n    };\n    return decode(varByteSource, {\n        ...options ?? {},\n        onLength\n    });\n}; //# sourceMappingURL=decode.js.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXQtbGVuZ3RoLXByZWZpeGVkL2Rpc3Qvc3JjL2RlY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsa0NBQWtDLEdBQ0g7QUFDUTtBQUNTO0FBQ0g7QUFDN0Msc0RBQXNEO0FBQy9DLE1BQU1JLG9CQUFvQixFQUFFLENBQUMsZ0RBQWdEO0FBQ3BGLG9EQUFvRDtBQUM3QyxNQUFNQyxrQkFBa0IsT0FBTyxPQUFPLEVBQUU7QUFDL0MsSUFBSUM7QUFDSCxVQUFVQSxRQUFRO0lBQ2ZBLFFBQVEsQ0FBQ0EsUUFBUSxDQUFDLFNBQVMsR0FBRyxFQUFFLEdBQUc7SUFDbkNBLFFBQVEsQ0FBQ0EsUUFBUSxDQUFDLE9BQU8sR0FBRyxFQUFFLEdBQUc7QUFDckMsR0FBR0EsWUFBYUEsQ0FBQUEsV0FBVyxDQUFDO0FBQzVCLE1BQU1DLGlCQUFpQixDQUFDQztJQUNwQixNQUFNQyxTQUFTUixnREFBYSxDQUFDTztJQUM3QkQsZUFBZUksS0FBSyxHQUFHVix3REFBcUIsQ0FBQ1E7SUFDN0MsT0FBT0E7QUFDWDtBQUNBRixlQUFlSSxLQUFLLEdBQUc7QUFDaEIsU0FBU0QsT0FBT0csTUFBTSxFQUFFQyxPQUFPO0lBQ2xDLE1BQU1DLFNBQVMsSUFBSWIsMERBQWNBO0lBQ2pDLElBQUljLE9BQU9WLFNBQVNXLE1BQU07SUFDMUIsSUFBSUMsYUFBYSxDQUFDO0lBQ2xCLE1BQU1DLGdCQUFnQkwsU0FBU0ssaUJBQWlCWjtJQUNoRCxNQUFNYSxrQkFBa0JOLFNBQVNNLG1CQUFtQmhCO0lBQ3BELE1BQU1pQixnQkFBZ0JQLFNBQVNPLGlCQUFpQmhCO0lBQ2hELFVBQVVpQjtRQUNOLE1BQU9QLE9BQU9RLFVBQVUsR0FBRyxFQUFHO1lBQzFCLElBQUlQLFNBQVNWLFNBQVNXLE1BQU0sRUFBRTtnQkFDMUIsNkNBQTZDO2dCQUM3QyxJQUFJO29CQUNBQyxhQUFhQyxjQUFjSjtvQkFDM0IsSUFBSUcsYUFBYSxHQUFHO3dCQUNoQixNQUFNbEIscUNBQU9BLENBQUMsSUFBSXdCLE1BQU0sMkJBQTJCO29CQUN2RDtvQkFDQSxJQUFJTixhQUFhRyxlQUFlO3dCQUM1QixNQUFNckIscUNBQU9BLENBQUMsSUFBSXdCLE1BQU0sNEJBQTRCO29CQUN4RDtvQkFDQSxNQUFNQyxtQkFBbUJOLGNBQWNSLEtBQUs7b0JBQzVDSSxPQUFPVyxPQUFPLENBQUNEO29CQUNmLElBQUlYLFNBQVNhLFlBQVksTUFBTTt3QkFDM0JiLFFBQVFhLFFBQVEsQ0FBQ1Q7b0JBQ3JCO29CQUNBRixPQUFPVixTQUFTc0IsSUFBSTtnQkFDeEIsRUFDQSxPQUFPQyxLQUFLO29CQUNSLElBQUlBLGVBQWVDLFlBQVk7d0JBQzNCLElBQUlmLE9BQU9RLFVBQVUsR0FBR0gsaUJBQWlCOzRCQUNyQyxNQUFNcEIscUNBQU9BLENBQUMsSUFBSXdCLE1BQU0sbUNBQW1DO3dCQUMvRDt3QkFDQTtvQkFDSjtvQkFDQSxNQUFNSztnQkFDVjtZQUNKO1lBQ0EsSUFBSWIsU0FBU1YsU0FBU3NCLElBQUksRUFBRTtnQkFDeEIsSUFBSWIsT0FBT1EsVUFBVSxHQUFHTCxZQUFZO29CQUVoQztnQkFDSjtnQkFDQSxNQUFNYSxPQUFPaEIsT0FBT2lCLE9BQU8sQ0FBQyxHQUFHZDtnQkFDL0JILE9BQU9XLE9BQU8sQ0FBQ1I7Z0JBQ2YsSUFBSUosU0FBU21CLFVBQVUsTUFBTTtvQkFDekJuQixRQUFRbUIsTUFBTSxDQUFDRjtnQkFDbkI7Z0JBQ0EsTUFBTUE7Z0JBQ05mLE9BQU9WLFNBQVNXLE1BQU07WUFDMUI7UUFDSjtJQUNKO0lBQ0EsSUFBSWQsMERBQWVBLENBQUNVLFNBQVM7UUFDekIsT0FBTztZQUNILFdBQVcsTUFBTUwsT0FBT0ssT0FBUTtnQkFDNUJFLE9BQU9tQixNQUFNLENBQUMxQjtnQkFDZCxPQUFPYztZQUNYO1lBQ0EsSUFBSVAsT0FBT1EsVUFBVSxHQUFHLEdBQUc7Z0JBQ3ZCLE1BQU12QixxQ0FBT0EsQ0FBQyxJQUFJd0IsTUFBTSw0QkFBNEI7WUFDeEQ7UUFDSjtJQUNKO0lBQ0EsT0FBTztRQUNILEtBQUssTUFBTWhCLE9BQU9LLE9BQVE7WUFDdEJFLE9BQU9tQixNQUFNLENBQUMxQjtZQUNkLE9BQU9jO1FBQ1g7UUFDQSxJQUFJUCxPQUFPUSxVQUFVLEdBQUcsR0FBRztZQUN2QixNQUFNdkIscUNBQU9BLENBQUMsSUFBSXdCLE1BQU0sNEJBQTRCO1FBQ3hEO0lBQ0o7QUFDSjtBQUNBZCxPQUFPeUIsVUFBVSxHQUFHLENBQUNDLFFBQVF0QjtJQUN6QixJQUFJUyxhQUFhLEdBQUcsb0RBQW9EO0lBQ3hFLE1BQU1jLGdCQUFpQjtRQUNuQixNQUFPLEtBQU07WUFDVCxJQUFJO2dCQUNBLE1BQU0sRUFBRUMsSUFBSSxFQUFFQyxLQUFLLEVBQUUsR0FBRyxNQUFNSCxPQUFPSSxJQUFJLENBQUNqQjtnQkFDMUMsSUFBSWUsU0FBUyxNQUFNO29CQUNmO2dCQUNKO2dCQUNBLElBQUlDLFNBQVMsTUFBTTtvQkFDZixNQUFNQTtnQkFDVjtZQUNKLEVBQ0EsT0FBT1YsS0FBSztnQkFDUixJQUFJQSxJQUFJWSxJQUFJLEtBQUssa0JBQWtCO29CQUMvQixPQUFPO3dCQUFFSCxNQUFNO3dCQUFNQyxPQUFPO29CQUFLO2dCQUNyQztnQkFDQSxNQUFNVjtZQUNWLFNBQ1E7Z0JBQ0osMkRBQTJEO2dCQUMzRE4sYUFBYTtZQUNqQjtRQUNKO0lBQ0o7SUFDQTs7S0FFQyxHQUNELE1BQU1JLFdBQVcsQ0FBQ2U7UUFBUW5CLGFBQWFtQjtJQUFHO0lBQzFDLE9BQU9oQyxPQUFPMkIsZUFBZTtRQUN6QixHQUFJdkIsV0FBVyxDQUFDLENBQUM7UUFDakJhO0lBQ0o7QUFDSixHQUNBLGtDQUFrQyIsInNvdXJjZXMiOlsid2VicGFjazovL2ZsdXNoLW5vdGVzLy4vbm9kZV9tb2R1bGVzL2l0LWxlbmd0aC1wcmVmaXhlZC9kaXN0L3NyYy9kZWNvZGUuanM/NWIxZCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQgbWF4LWRlcHRoOiBbXCJlcnJvclwiLCA2XSAqL1xuaW1wb3J0IGVyckNvZGUgZnJvbSAnZXJyLWNvZGUnO1xuaW1wb3J0ICogYXMgdmFyaW50IGZyb20gJ3VpbnQ4LXZhcmludCc7XG5pbXBvcnQgeyBVaW50OEFycmF5TGlzdCB9IGZyb20gJ3VpbnQ4YXJyYXlsaXN0JztcbmltcG9ydCB7IGlzQXN5bmNJdGVyYWJsZSB9IGZyb20gJy4vdXRpbHMuanMnO1xuLy8gTWF4aW11bSBsZW5ndGggb2YgdGhlIGxlbmd0aCBzZWN0aW9uIG9mIHRoZSBtZXNzYWdlXG5leHBvcnQgY29uc3QgTUFYX0xFTkdUSF9MRU5HVEggPSA4OyAvLyBWYXJpbnQuZW5jb2RlKE51bWJlci5NQVhfU0FGRV9JTlRFR0VSKS5sZW5ndGhcbi8vIE1heGltdW0gbGVuZ3RoIG9mIHRoZSBkYXRhIHNlY3Rpb24gb2YgdGhlIG1lc3NhZ2VcbmV4cG9ydCBjb25zdCBNQVhfREFUQV9MRU5HVEggPSAxMDI0ICogMTAyNCAqIDQ7XG52YXIgUmVhZE1vZGU7XG4oZnVuY3Rpb24gKFJlYWRNb2RlKSB7XG4gICAgUmVhZE1vZGVbUmVhZE1vZGVbXCJMRU5HVEhcIl0gPSAwXSA9IFwiTEVOR1RIXCI7XG4gICAgUmVhZE1vZGVbUmVhZE1vZGVbXCJEQVRBXCJdID0gMV0gPSBcIkRBVEFcIjtcbn0pKFJlYWRNb2RlIHx8IChSZWFkTW9kZSA9IHt9KSk7XG5jb25zdCBkZWZhdWx0RGVjb2RlciA9IChidWYpID0+IHtcbiAgICBjb25zdCBsZW5ndGggPSB2YXJpbnQuZGVjb2RlKGJ1Zik7XG4gICAgZGVmYXVsdERlY29kZXIuYnl0ZXMgPSB2YXJpbnQuZW5jb2RpbmdMZW5ndGgobGVuZ3RoKTtcbiAgICByZXR1cm4gbGVuZ3RoO1xufTtcbmRlZmF1bHREZWNvZGVyLmJ5dGVzID0gMDtcbmV4cG9ydCBmdW5jdGlvbiBkZWNvZGUoc291cmNlLCBvcHRpb25zKSB7XG4gICAgY29uc3QgYnVmZmVyID0gbmV3IFVpbnQ4QXJyYXlMaXN0KCk7XG4gICAgbGV0IG1vZGUgPSBSZWFkTW9kZS5MRU5HVEg7XG4gICAgbGV0IGRhdGFMZW5ndGggPSAtMTtcbiAgICBjb25zdCBsZW5ndGhEZWNvZGVyID0gb3B0aW9ucz8ubGVuZ3RoRGVjb2RlciA/PyBkZWZhdWx0RGVjb2RlcjtcbiAgICBjb25zdCBtYXhMZW5ndGhMZW5ndGggPSBvcHRpb25zPy5tYXhMZW5ndGhMZW5ndGggPz8gTUFYX0xFTkdUSF9MRU5HVEg7XG4gICAgY29uc3QgbWF4RGF0YUxlbmd0aCA9IG9wdGlvbnM/Lm1heERhdGFMZW5ndGggPz8gTUFYX0RBVEFfTEVOR1RIO1xuICAgIGZ1bmN0aW9uKiBtYXliZVlpZWxkKCkge1xuICAgICAgICB3aGlsZSAoYnVmZmVyLmJ5dGVMZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAobW9kZSA9PT0gUmVhZE1vZGUuTEVOR1RIKSB7XG4gICAgICAgICAgICAgICAgLy8gcmVhZCBsZW5ndGgsIGlnbm9yZSBlcnJvcnMgZm9yIHNob3J0IHJlYWRzXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YUxlbmd0aCA9IGxlbmd0aERlY29kZXIoYnVmZmVyKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFMZW5ndGggPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJDb2RlKG5ldyBFcnJvcignaW52YWxpZCBtZXNzYWdlIGxlbmd0aCcpLCAnRVJSX0lOVkFMSURfTVNHX0xFTkdUSCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhTGVuZ3RoID4gbWF4RGF0YUxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyQ29kZShuZXcgRXJyb3IoJ21lc3NhZ2UgbGVuZ3RoIHRvbyBsb25nJyksICdFUlJfTVNHX0RBVEFfVE9PX0xPTkcnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhTGVuZ3RoTGVuZ3RoID0gbGVuZ3RoRGVjb2Rlci5ieXRlcztcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyLmNvbnN1bWUoZGF0YUxlbmd0aExlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zPy5vbkxlbmd0aCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm9uTGVuZ3RoKGRhdGFMZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG1vZGUgPSBSZWFkTW9kZS5EQVRBO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBSYW5nZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYnVmZmVyLmJ5dGVMZW5ndGggPiBtYXhMZW5ndGhMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJDb2RlKG5ldyBFcnJvcignbWVzc2FnZSBsZW5ndGggbGVuZ3RoIHRvbyBsb25nJyksICdFUlJfTVNHX0xFTkdUSF9UT09fTE9ORycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtb2RlID09PSBSZWFkTW9kZS5EQVRBKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJ1ZmZlci5ieXRlTGVuZ3RoIDwgZGF0YUxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBub3QgZW5vdWdoIGRhdGEsIHdhaXQgZm9yIG1vcmVcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBidWZmZXIuc3VibGlzdCgwLCBkYXRhTGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBidWZmZXIuY29uc3VtZShkYXRhTGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucz8ub25EYXRhICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5vbkRhdGEoZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHlpZWxkIGRhdGE7XG4gICAgICAgICAgICAgICAgbW9kZSA9IFJlYWRNb2RlLkxFTkdUSDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNBc3luY0l0ZXJhYmxlKHNvdXJjZSkpIHtcbiAgICAgICAgcmV0dXJuIChhc3luYyBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgZm9yIGF3YWl0IChjb25zdCBidWYgb2Ygc291cmNlKSB7XG4gICAgICAgICAgICAgICAgYnVmZmVyLmFwcGVuZChidWYpO1xuICAgICAgICAgICAgICAgIHlpZWxkKiBtYXliZVlpZWxkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYnVmZmVyLmJ5dGVMZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyQ29kZShuZXcgRXJyb3IoJ3VuZXhwZWN0ZWQgZW5kIG9mIGlucHV0JyksICdFUlJfVU5FWFBFQ1RFRF9FT0YnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkoKTtcbiAgICB9XG4gICAgcmV0dXJuIChmdW5jdGlvbiogKCkge1xuICAgICAgICBmb3IgKGNvbnN0IGJ1ZiBvZiBzb3VyY2UpIHtcbiAgICAgICAgICAgIGJ1ZmZlci5hcHBlbmQoYnVmKTtcbiAgICAgICAgICAgIHlpZWxkKiBtYXliZVlpZWxkKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJ1ZmZlci5ieXRlTGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhyb3cgZXJyQ29kZShuZXcgRXJyb3IoJ3VuZXhwZWN0ZWQgZW5kIG9mIGlucHV0JyksICdFUlJfVU5FWFBFQ1RFRF9FT0YnKTtcbiAgICAgICAgfVxuICAgIH0pKCk7XG59XG5kZWNvZGUuZnJvbVJlYWRlciA9IChyZWFkZXIsIG9wdGlvbnMpID0+IHtcbiAgICBsZXQgYnl0ZUxlbmd0aCA9IDE7IC8vIFJlYWQgc2luZ2xlIGJ5dGUgY2h1bmtzIHVudGlsIHRoZSBsZW5ndGggaXMga25vd25cbiAgICBjb25zdCB2YXJCeXRlU291cmNlID0gKGFzeW5jIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZG9uZSwgdmFsdWUgfSA9IGF3YWl0IHJlYWRlci5uZXh0KGJ5dGVMZW5ndGgpO1xuICAgICAgICAgICAgICAgIGlmIChkb25lID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIuY29kZSA9PT0gJ0VSUl9VTkRFUl9SRUFEJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBkb25lOiB0cnVlLCB2YWx1ZTogbnVsbCB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAvLyBSZXNldCB0aGUgYnl0ZUxlbmd0aCBzbyB3ZSBjb250aW51ZSB0byBjaGVjayBmb3IgdmFyaW50c1xuICAgICAgICAgICAgICAgIGJ5dGVMZW5ndGggPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSgpKTtcbiAgICAvKipcbiAgICAgKiBPbmNlIHRoZSBsZW5ndGggaGFzIGJlZW4gcGFyc2VkLCByZWFkIGNodW5rIGZvciB0aGF0IGxlbmd0aFxuICAgICAqL1xuICAgIGNvbnN0IG9uTGVuZ3RoID0gKGwpID0+IHsgYnl0ZUxlbmd0aCA9IGw7IH07XG4gICAgcmV0dXJuIGRlY29kZSh2YXJCeXRlU291cmNlLCB7XG4gICAgICAgIC4uLihvcHRpb25zID8/IHt9KSxcbiAgICAgICAgb25MZW5ndGhcbiAgICB9KTtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kZWNvZGUuanMubWFwIl0sIm5hbWVzIjpbImVyckNvZGUiLCJ2YXJpbnQiLCJVaW50OEFycmF5TGlzdCIsImlzQXN5bmNJdGVyYWJsZSIsIk1BWF9MRU5HVEhfTEVOR1RIIiwiTUFYX0RBVEFfTEVOR1RIIiwiUmVhZE1vZGUiLCJkZWZhdWx0RGVjb2RlciIsImJ1ZiIsImxlbmd0aCIsImRlY29kZSIsImJ5dGVzIiwiZW5jb2RpbmdMZW5ndGgiLCJzb3VyY2UiLCJvcHRpb25zIiwiYnVmZmVyIiwibW9kZSIsIkxFTkdUSCIsImRhdGFMZW5ndGgiLCJsZW5ndGhEZWNvZGVyIiwibWF4TGVuZ3RoTGVuZ3RoIiwibWF4RGF0YUxlbmd0aCIsIm1heWJlWWllbGQiLCJieXRlTGVuZ3RoIiwiRXJyb3IiLCJkYXRhTGVuZ3RoTGVuZ3RoIiwiY29uc3VtZSIsIm9uTGVuZ3RoIiwiREFUQSIsImVyciIsIlJhbmdlRXJyb3IiLCJkYXRhIiwic3VibGlzdCIsIm9uRGF0YSIsImFwcGVuZCIsImZyb21SZWFkZXIiLCJyZWFkZXIiLCJ2YXJCeXRlU291cmNlIiwiZG9uZSIsInZhbHVlIiwibmV4dCIsImNvZGUiLCJsIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/it-length-prefixed/dist/src/decode.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/it-length-prefixed/dist/src/encode.js":
/*!************************************************************!*\
  !*** ./node_modules/it-length-prefixed/dist/src/encode.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   encode: () => (/* binding */ encode)\n/* harmony export */ });\n/* harmony import */ var uint8_varint__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uint8-varint */ \"(ssr)/./node_modules/uint8-varint/dist/src/index.js\");\n/* harmony import */ var uint8arraylist__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uint8arraylist */ \"(ssr)/./node_modules/uint8arraylist/dist/src/index.js\");\n/* harmony import */ var uint8arrays_alloc__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! uint8arrays/alloc */ \"(ssr)/./node_modules/uint8arrays/dist/src/alloc.node.js\");\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ \"(ssr)/./node_modules/it-length-prefixed/dist/src/utils.js\");\n\n\n\n\nconst defaultEncoder = (length)=>{\n    const lengthLength = uint8_varint__WEBPACK_IMPORTED_MODULE_0__.encodingLength(length);\n    const lengthBuf = (0,uint8arrays_alloc__WEBPACK_IMPORTED_MODULE_2__.allocUnsafe)(lengthLength);\n    uint8_varint__WEBPACK_IMPORTED_MODULE_0__.encode(length, lengthBuf);\n    defaultEncoder.bytes = lengthLength;\n    return lengthBuf;\n};\ndefaultEncoder.bytes = 0;\nfunction encode(source, options) {\n    options = options ?? {};\n    const encodeLength = options.lengthEncoder ?? defaultEncoder;\n    function* maybeYield(chunk) {\n        // length + data\n        const length = encodeLength(chunk.byteLength);\n        // yield only Uint8Arrays\n        if (length instanceof Uint8Array) {\n            yield length;\n        } else {\n            yield* length;\n        }\n        // yield only Uint8Arrays\n        if (chunk instanceof Uint8Array) {\n            yield chunk;\n        } else {\n            yield* chunk;\n        }\n    }\n    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isAsyncIterable)(source)) {\n        return async function*() {\n            for await (const chunk of source){\n                yield* maybeYield(chunk);\n            }\n        }();\n    }\n    return function*() {\n        for (const chunk of source){\n            yield* maybeYield(chunk);\n        }\n    }();\n}\nencode.single = (chunk, options)=>{\n    options = options ?? {};\n    const encodeLength = options.lengthEncoder ?? defaultEncoder;\n    return new uint8arraylist__WEBPACK_IMPORTED_MODULE_1__.Uint8ArrayList(encodeLength(chunk.byteLength), chunk);\n}; //# sourceMappingURL=encode.js.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXQtbGVuZ3RoLXByZWZpeGVkL2Rpc3Qvc3JjL2VuY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUF1QztBQUNTO0FBQ0E7QUFDSDtBQUM3QyxNQUFNSSxpQkFBaUIsQ0FBQ0M7SUFDcEIsTUFBTUMsZUFBZU4sd0RBQXFCLENBQUNLO0lBQzNDLE1BQU1HLFlBQVlOLDhEQUFXQSxDQUFDSTtJQUM5Qk4sZ0RBQWEsQ0FBQ0ssUUFBUUc7SUFDdEJKLGVBQWVNLEtBQUssR0FBR0o7SUFDdkIsT0FBT0U7QUFDWDtBQUNBSixlQUFlTSxLQUFLLEdBQUc7QUFDaEIsU0FBU0QsT0FBT0UsTUFBTSxFQUFFQyxPQUFPO0lBQ2xDQSxVQUFVQSxXQUFXLENBQUM7SUFDdEIsTUFBTUMsZUFBZUQsUUFBUUUsYUFBYSxJQUFJVjtJQUM5QyxVQUFVVyxXQUFXQyxLQUFLO1FBQ3RCLGdCQUFnQjtRQUNoQixNQUFNWCxTQUFTUSxhQUFhRyxNQUFNQyxVQUFVO1FBQzVDLHlCQUF5QjtRQUN6QixJQUFJWixrQkFBa0JhLFlBQVk7WUFDOUIsTUFBTWI7UUFDVixPQUNLO1lBQ0QsT0FBT0E7UUFDWDtRQUNBLHlCQUF5QjtRQUN6QixJQUFJVyxpQkFBaUJFLFlBQVk7WUFDN0IsTUFBTUY7UUFDVixPQUNLO1lBQ0QsT0FBT0E7UUFDWDtJQUNKO0lBQ0EsSUFBSWIsMERBQWVBLENBQUNRLFNBQVM7UUFDekIsT0FBTztZQUNILFdBQVcsTUFBTUssU0FBU0wsT0FBUTtnQkFDOUIsT0FBT0ksV0FBV0M7WUFDdEI7UUFDSjtJQUNKO0lBQ0EsT0FBTztRQUNILEtBQUssTUFBTUEsU0FBU0wsT0FBUTtZQUN4QixPQUFPSSxXQUFXQztRQUN0QjtJQUNKO0FBQ0o7QUFDQVAsT0FBT1UsTUFBTSxHQUFHLENBQUNILE9BQU9KO0lBQ3BCQSxVQUFVQSxXQUFXLENBQUM7SUFDdEIsTUFBTUMsZUFBZUQsUUFBUUUsYUFBYSxJQUFJVjtJQUM5QyxPQUFPLElBQUlILDBEQUFjQSxDQUFDWSxhQUFhRyxNQUFNQyxVQUFVLEdBQUdEO0FBQzlELEdBQ0Esa0NBQWtDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmx1c2gtbm90ZXMvLi9ub2RlX21vZHVsZXMvaXQtbGVuZ3RoLXByZWZpeGVkL2Rpc3Qvc3JjL2VuY29kZS5qcz80M2ZiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHZhcmludCBmcm9tICd1aW50OC12YXJpbnQnO1xuaW1wb3J0IHsgVWludDhBcnJheUxpc3QgfSBmcm9tICd1aW50OGFycmF5bGlzdCc7XG5pbXBvcnQgeyBhbGxvY1Vuc2FmZSB9IGZyb20gJ3VpbnQ4YXJyYXlzL2FsbG9jJztcbmltcG9ydCB7IGlzQXN5bmNJdGVyYWJsZSB9IGZyb20gJy4vdXRpbHMuanMnO1xuY29uc3QgZGVmYXVsdEVuY29kZXIgPSAobGVuZ3RoKSA9PiB7XG4gICAgY29uc3QgbGVuZ3RoTGVuZ3RoID0gdmFyaW50LmVuY29kaW5nTGVuZ3RoKGxlbmd0aCk7XG4gICAgY29uc3QgbGVuZ3RoQnVmID0gYWxsb2NVbnNhZmUobGVuZ3RoTGVuZ3RoKTtcbiAgICB2YXJpbnQuZW5jb2RlKGxlbmd0aCwgbGVuZ3RoQnVmKTtcbiAgICBkZWZhdWx0RW5jb2Rlci5ieXRlcyA9IGxlbmd0aExlbmd0aDtcbiAgICByZXR1cm4gbGVuZ3RoQnVmO1xufTtcbmRlZmF1bHRFbmNvZGVyLmJ5dGVzID0gMDtcbmV4cG9ydCBmdW5jdGlvbiBlbmNvZGUoc291cmNlLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgPz8ge307XG4gICAgY29uc3QgZW5jb2RlTGVuZ3RoID0gb3B0aW9ucy5sZW5ndGhFbmNvZGVyID8/IGRlZmF1bHRFbmNvZGVyO1xuICAgIGZ1bmN0aW9uKiBtYXliZVlpZWxkKGNodW5rKSB7XG4gICAgICAgIC8vIGxlbmd0aCArIGRhdGFcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gZW5jb2RlTGVuZ3RoKGNodW5rLmJ5dGVMZW5ndGgpO1xuICAgICAgICAvLyB5aWVsZCBvbmx5IFVpbnQ4QXJyYXlzXG4gICAgICAgIGlmIChsZW5ndGggaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgICAgICAgICB5aWVsZCBsZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB5aWVsZCogbGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIC8vIHlpZWxkIG9ubHkgVWludDhBcnJheXNcbiAgICAgICAgaWYgKGNodW5rIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuICAgICAgICAgICAgeWllbGQgY2h1bms7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB5aWVsZCogY2h1bms7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzQXN5bmNJdGVyYWJsZShzb3VyY2UpKSB7XG4gICAgICAgIHJldHVybiAoYXN5bmMgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgY2h1bmsgb2Ygc291cmNlKSB7XG4gICAgICAgICAgICAgICAgeWllbGQqIG1heWJlWWllbGQoY2h1bmspO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSgpO1xuICAgIH1cbiAgICByZXR1cm4gKGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGZvciAoY29uc3QgY2h1bmsgb2Ygc291cmNlKSB7XG4gICAgICAgICAgICB5aWVsZCogbWF5YmVZaWVsZChjaHVuayk7XG4gICAgICAgIH1cbiAgICB9KSgpO1xufVxuZW5jb2RlLnNpbmdsZSA9IChjaHVuaywgb3B0aW9ucykgPT4ge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zID8/IHt9O1xuICAgIGNvbnN0IGVuY29kZUxlbmd0aCA9IG9wdGlvbnMubGVuZ3RoRW5jb2RlciA/PyBkZWZhdWx0RW5jb2RlcjtcbiAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXlMaXN0KGVuY29kZUxlbmd0aChjaHVuay5ieXRlTGVuZ3RoKSwgY2h1bmspO1xufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVuY29kZS5qcy5tYXAiXSwibmFtZXMiOlsidmFyaW50IiwiVWludDhBcnJheUxpc3QiLCJhbGxvY1Vuc2FmZSIsImlzQXN5bmNJdGVyYWJsZSIsImRlZmF1bHRFbmNvZGVyIiwibGVuZ3RoIiwibGVuZ3RoTGVuZ3RoIiwiZW5jb2RpbmdMZW5ndGgiLCJsZW5ndGhCdWYiLCJlbmNvZGUiLCJieXRlcyIsInNvdXJjZSIsIm9wdGlvbnMiLCJlbmNvZGVMZW5ndGgiLCJsZW5ndGhFbmNvZGVyIiwibWF5YmVZaWVsZCIsImNodW5rIiwiYnl0ZUxlbmd0aCIsIlVpbnQ4QXJyYXkiLCJzaW5nbGUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/it-length-prefixed/dist/src/encode.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/it-length-prefixed/dist/src/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/it-length-prefixed/dist/src/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   decode: () => (/* reexport safe */ _decode_js__WEBPACK_IMPORTED_MODULE_1__.decode),\n/* harmony export */   encode: () => (/* reexport safe */ _encode_js__WEBPACK_IMPORTED_MODULE_0__.encode)\n/* harmony export */ });\n/* harmony import */ var _encode_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./encode.js */ \"(ssr)/./node_modules/it-length-prefixed/dist/src/encode.js\");\n/* harmony import */ var _decode_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./decode.js */ \"(ssr)/./node_modules/it-length-prefixed/dist/src/decode.js\");\n\n //# sourceMappingURL=index.js.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXQtbGVuZ3RoLXByZWZpeGVkL2Rpc3Qvc3JjL2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBcUM7QUFDQSxDQUNyQyxpQ0FBaUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mbHVzaC1ub3Rlcy8uL25vZGVfbW9kdWxlcy9pdC1sZW5ndGgtcHJlZml4ZWQvZGlzdC9zcmMvaW5kZXguanM/OTZjOSJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgeyBlbmNvZGUgfSBmcm9tICcuL2VuY29kZS5qcyc7XG5leHBvcnQgeyBkZWNvZGUgfSBmcm9tICcuL2RlY29kZS5qcyc7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiXSwibmFtZXMiOlsiZW5jb2RlIiwiZGVjb2RlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/it-length-prefixed/dist/src/index.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/it-length-prefixed/dist/src/utils.js":
/*!***********************************************************!*\
  !*** ./node_modules/it-length-prefixed/dist/src/utils.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   isAsyncIterable: () => (/* binding */ isAsyncIterable)\n/* harmony export */ });\nfunction isAsyncIterable(thing) {\n    return thing[Symbol.asyncIterator] != null;\n} //# sourceMappingURL=utils.js.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXQtbGVuZ3RoLXByZWZpeGVkL2Rpc3Qvc3JjL3V0aWxzLmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBTyxTQUFTQSxnQkFBZ0JDLEtBQUs7SUFDakMsT0FBT0EsS0FBSyxDQUFDQyxPQUFPQyxhQUFhLENBQUMsSUFBSTtBQUMxQyxFQUNBLGlDQUFpQyIsInNvdXJjZXMiOlsid2VicGFjazovL2ZsdXNoLW5vdGVzLy4vbm9kZV9tb2R1bGVzL2l0LWxlbmd0aC1wcmVmaXhlZC9kaXN0L3NyYy91dGlscy5qcz84N2E4Il0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBpc0FzeW5jSXRlcmFibGUodGhpbmcpIHtcbiAgICByZXR1cm4gdGhpbmdbU3ltYm9sLmFzeW5jSXRlcmF0b3JdICE9IG51bGw7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD11dGlscy5qcy5tYXAiXSwibmFtZXMiOlsiaXNBc3luY0l0ZXJhYmxlIiwidGhpbmciLCJTeW1ib2wiLCJhc3luY0l0ZXJhdG9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/it-length-prefixed/dist/src/utils.js\n");

/***/ })

};
;