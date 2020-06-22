const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin"); // 导入 在内存中自动生成html文件 的插件
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require('webpack');

// 创建一个插件的实例对象
const htmlPlugin = new htmlWebpackPlugin({
    template: path.join(__dirname, "./src/index.html"), // 源文件
    filename: "index.html" // 生成的 内存中首页的 名称
})

const cleanPlugin = new CleanWebpackPlugin();

// 向外暴露一个打包的实例对象，因为webpack是基于Node构建的，所以webpack支持所有Node API和语法
// webpack 默认只能打包处理.js后缀名类型的文件，想.vue .png无法主动处理，所以要配置第三方的loader
module.exports = {
    mode: 'development', // development 或 production
    entry: {
        app: path.join(__dirname, './src/index.js'),
        vendors: ['jquery']
    },
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'js/[name].js'
		},
		optimization: {
			splitChunks: {
					cacheGroups: {
							commons: {
									name: "vendors",
									chunks: "initial",
									minChunks: 2
							}
					}
			}
		},
    plugins: [
        htmlPlugin,
				cleanPlugin,
    ],
    module: { // 所有第三方模块的配置规则
        rules: [ // 第三方匹配规则
            {
                test: /\.js|jsx$/,
                use: "babel-loader",
                exclude: /node_modules/ // exclude千万别忘记 排除项
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.css$/,
                //webpack use 中是从后往前匹配 
                //-loader不能省略 省略是1.X版本的功能 
                //参数modules 为css启用模块化 防止css全局覆盖
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.ttf|woff|woff2|eot|svg$/,
                use: 'url-loader'
            },
            {
                test: /\.scss$/,
                use: ['style-loader', {
                    loader: 'css-loader',
                    // options: {
                    //     modules: true,
                    //     importLoaders: 1
                    // }
                    options: {
                        modules: {
                            localIdentName: "[path][name]-[local]-[hash:5]" // [path] 当前文件路径 [name] 当前文件名 [local] 该类样式 [hash] hash值  默认32位 
                        }
                     }
                }, 'sass-loader']
            },
            {
                test: /\.(png|jpg|jpeg|bmp|gif)$/,
                use: 'url-loader?limit=5000&name=images/[hash:8]-[name].[ext]'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'], // 忽略文件后缀名
        alias: {
            '@': path.join(__dirname, './src/') // 配置导入包的目录文件
        }
    }
}