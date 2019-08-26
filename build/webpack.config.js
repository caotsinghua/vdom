const merge=require('webpack-merge');
const base=require('./webpack.base')
const dev=require('./webpack.dev')
const prod=require('./webpack.prod')
module.exports=(env,argv)=>{
    const mode=env.production?'production':'development';
    const config=env.production?prod:dev;
    return merge(base,{
        mode,
        ...config
    })
}
