;(content => {
    const require = path => {
        const getSrcPath = p => {
            const srcPath = content[path].deps[p]
            return require(srcPath)
        }
        const exports = {}
        ;((require, exports, code) => {
            eval(code)
        })(getSrcPath, exports, content[path].code)
        return exports
    }
    require('./src/index.js')
})({
    './src/index.js': {
        deps: { './add.js': './src/add.js', './cute.js': './src/cute.js' },
        code: '"use strict";\n\nvar _add = _interopRequireDefault(require("./add.js"));\n\nvar _cute = require("./cute.js");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }\n\nvar num1 = (0, _add["default"])(1, 2);\nvar num2 = (0, _cute.cute)(100, 22);\nconsole.log(num1, num2);'
    },
    './src/add.js': {
        deps: {},
        code: '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports["default"] = void 0;\n\nvar add = function add(a, b) {\n  return a + b;\n};\n\nvar _default = add;\nexports["default"] = _default;'
    },
    './src/cute.js': {
        deps: { './utils/index.js': './src/utils/index.js' },
        code: '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.cute = void 0;\n\nvar _index = _interopRequireDefault(require("./utils/index.js"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }\n\nvar cute = function cute(a, b) {\n  return a - b;\n};\n\nexports.cute = cute;\n(0, _index["default"])();'
    },
    './src/utils/index.js': {
        deps: {},
        code: '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports["default"] = void 0;\n\nvar getUrl = function getUrl() {\n  var url = window.location.pathname;\n  return url;\n};\n\nvar _default = getUrl;\nexports["default"] = _default;'
    }
})
