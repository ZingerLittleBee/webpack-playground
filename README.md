# webpack-playground

## build-your-own-webpack
> Read the original article https://juejin.cn/post/6908565593562202125#heading-4

实现思路
<details>
  <summary>1. 从入口地址读取代码, 递归收集所有依赖项</summary>
    1. 将代码转换成 ast, 获取 `ImportDeclaration` 节点的值, 收集依赖项
    2. 使用 `@babel/preset-env` 将 ast 转换为 es5 代码
    3. 将处理完的结果保存为 [{ entry, deps, transCode }] 的结构
</details>

<details>
  <summary>2. 将依赖项写入 js 文件</summary>
    步骤一获得的对象结构, 需要 JSON 化才可以保存到文件中, js 文件无法识别 JSON 字符串, 但是可以通过立即执行函数 `(() => {})()` 传入
</details>

<details>
  <summary>3. 实现 require 和 exports 方法</summary>
  并不是所有的浏览器环境都支持 `require` 和 `exports`, 因此需要自行实现
</details>
