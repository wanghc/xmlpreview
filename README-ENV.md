## 环境说明
## node环境
```shell
$> node -v
v11.15.0
$> npm -v 
6.7.0
```
## 项目安装webpack
对于大多数项目，我们建议本地安装。这可以在引入重大更新(breaking change)版本时，更容易分别升级项目。 通常会通过运行一个或多个 npm scripts 以在本地 node_modules 目录中查找安装的 webpack， 来运行 webpack
```shell
npm install --save-dev webpack webpack-cli
## 安装完显示
+ webpack@5.90.3
+ webpack-cli@5.1.4
```
因为不是全局安装，命令行无法识别webpack命令，所以使用npm来运行。进行如下配置
## 修改package.json
```js
"scripts": {
    "build": "webpack --config webpack.config.js"
}
```
## 运行
```shell
$> npm run build

> xmlpreview@1.0.0 build x:\xx\xxx\xmlpreview
> webpack --config webpack.config.js

asset xmlPreviewByCanvas.js 20.6 KiB [emitted] [minimized] (name: main)
orphan modules 32.4 KiB [orphan] 5 modules
./src/index.js + 5 modules 50.3 KiB [built] [code generated]
webpack 5.90.3 compiled successfully in 573 ms
```
