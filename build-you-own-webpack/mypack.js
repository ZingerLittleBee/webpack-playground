const fs = require('fs')
const babel = require('@babel/core')
const parser = require('@babel/parser') // 转换代码为 ast
const traverse = require('@babel/traverse').default // 遍历 ast
const path = require('path')

// 获取 babel 处理后的代码, { 入口地址, 依赖路径映射, 转换后的代码 }
const getCode = entry => {
    // 读取入口的地址的代码
    const code = fs.readFileSync(entry, 'utf-8')
    // 获取当前文件所在的目录
    const dirname = path.dirname(entry)
    // 将读取到的代码转换为 ast
    const ast = parser.parse(code, {
        sourceType: 'module'
    })
    // 依赖路径映射
    const deps = {}
    // 遍历 ast, 获取所有的依赖
    traverse(ast, {
        ImportDeclaration(p) {
            // 获取代码中的依赖
            const importPath = p.get('source').node.value
            // webpack 执行的路径和代码中依赖的相对路径不一定相同
            // 获取相对于 src 目录的路径
            const asbPath = './' + path.join(dirname, importPath)
            // 记录 { 相对目录: src 路径 } 映射关系
            deps[importPath] = asbPath
        }
    })
    // 使用 @babel/preset-env 插件, 将 ast 转换成 es5 js 代码
    const { code: transCode } = babel.transformFromAst(ast, null, {
        presets: ['@babel/preset-env']
    })
    return { entry, deps, transCode }
}

// 递归调用 getCode
const recurrenceGetCode = entry => {
    // 获取入口文件所有信息
    const entryInfo = getCode(entry)
    const allInfo = [entryInfo]

    // 递归获取依赖 deps, 添加到 allInfo 数组中
    const recurrenceDeps = (deps, modules) => {
        Object.keys(deps).forEach(key => {
            const info = getCode(deps[key])
            modules.push(info)
            recurrenceDeps(info.deps, modules)
        })
    }
    recurrenceDeps(entryInfo.deps, allInfo)

    // 遍历依赖 allInfo 数组, 转换为 { 依赖路径: { deps, code } }
    const webpack_modules = {}
    allInfo.forEach(item => {
        webpack_modules[item.entry] = { deps: item.deps, code: item.transCode }
    })
    return webpack_modules
}

// 入口函数
const webpack = entry => {
    // 获取依赖关系
    const webpack_modules = recurrenceGetCode(entry)
    // 立即执行函数模板, webpack_modules 通过参数形式传入
    // 需要自行实现 require 和 exports, 因为有的环境可能不支持
    const writeFunction = `((content)=>{
      const require = (path) => {
        const getSrcPath = (p) => {
          const srcPath = content[path].deps[p];
          return require(srcPath)
        }
        const exports = {};
        ((require,exports,code)=>{
          eval(code)
        })(getSrcPath,exports,content[path].code)
        return exports;
      }
      require('./src/index.js')
    })(${JSON.stringify(webpack_modules)})`
    // 将代码写入文件
    fs.writeFileSync('./exs.js', writeFunction)
}

webpack('./src/index.js')
