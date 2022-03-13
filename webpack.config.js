const {resolve} = require('path');
const webpack = require('webpack');
const TerserJSPlugin = require('terser-webpack-plugin');
module.exports = {
    entry:['./src/index.js'],
    output: {
        environment: {
            arrowFunction: false  
        },
        filename:'xmlPreviewByCanvas.js', 
        //path: resolve(__dirname,'build')
        path: 'E:\\dthealth\\app\\dthis\\web\\scripts\\dhctt\\xmldesigner'
    },
    //mode:'development',
    mode:'production',
    optimization:{
        minimize:true,
        minimizer:[new TerserJSPlugin({
            // cache:false,
            // minify:
            extractComments: true,  //去除注释
            terserOptions: {
                ecma:undefined,
                parse: {},
                compress: {
                    drop_console:true,
                    drop_debugger:true
                },
                mangle: true, //混淆
                module: false,
                // Deprecated
                output: null,
                format: null,
                toplevel: false,
                nameCache: null,
                ie8: true,
                keep_classnames: true,
                keep_fnames: true,
                safari10: false,
              }
        })]
    }
};
// if (process.env.NODE_ENV === 'development') {
//     module.exports.plugins = (module.exports.plugins || []).concat([new webpack.optimize.UglifyJsPlugin({
//         minimize: true,
//         compress: true
//     })]);
// }
// if (process.env.NODE_ENV === 'production') {
//     module.exports.plugins = (module.exports.plugins || []).concat([new webpack.optimize.UglifyJsPlugin({
//         minimize: false,
//         compress: false
//     })]);
// }