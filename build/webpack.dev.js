const path=require("path")
const resolve=(dir)=>path.join(__dirname,dir);
module.exports={
    devtool:'cheap-module-source-map',
    devServer:{
        contentBase:resolve('../dist'),
        port:9090
    }
}
