const path=require("path")
const HtmlWebpackPlugin =require('html-webpack-plugin')
const resolve=(dir)=>path.join(__dirname,dir);
module.exports={
    mode:"development",
    entry:{
        // 'index':resolve('../lib/index.ts'),
        // 'showVNode':resolve('../lib/showVNode.js'),
        // 'h':resolve('../lib/h.js')
        demo:resolve('../lib/demo')
    },
    output:{
        filename:'[name].js',
        path:resolve('../dist')
    },
    module:{
        rules:[
            {
                test:/\.tsx?$/,
                use:['ts-loader']
            },
            {
                test:/\.jsx?$/,
                use:['babel-loader'],
                exclude:/node_modules/
            },
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
           title:'demo',
           template:path.resolve(__dirname,'../template/demo.html'),
           filename:'demo.html',
          //  chunks:['showVNode','h'],
          //  excludeChunks:['index']
        })
    ],
    stats:"normal"
}