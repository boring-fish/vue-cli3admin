
module.exports = {
  outputDir: 'work',
  publicPath: './' ,
  devServer: {
    port: 8686,
    disableHostCheck: true,
    proxy: {
      '/material': {
        target:'https://service-mozvdzpo-1302382638.gz.apigw.tencentcs.com',
        changeOrigin: true,
        pathRewrite: {
         '^/material': ''  
       }
      },
      '/test': {
        target: 'https://service-rjctasfc-1300644403.gz.apigw.tencentcs.com',
        changeOrigin: true,
      //   pathRewrite: {
      //    '^/api': '/test'  
      //  }
      },
      '/linkflow':{
        target: 'https://open.leadswarp.com',
        changeOrigin: true,
        pathRewrite: {
          '^/linkflow': ''  
        }
      },
     
    }
  },
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main.js')
    })
    config.when(process.env.NODE_ENV === 'development', config => {
        config.entry('app').clear().add('./src/main-dev.js')
    })
    config.plugin('html').tap(args => {
      return [
        {
          ...args[0],
          title:'管家后台'
        }
      ];
    });
 
  }
}