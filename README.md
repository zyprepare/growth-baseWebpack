最基本的webpack打包方式，返回一个webpack配置对象，支持外部个性化配置传入。

基于webpack4打包静态文件，支持单页面和多页面入口，支持最新js语法和sass语法。

打包规则：

  入口文件：自动将src/pages目录下的所有文件当作入口文件，无需手动配置，会自动配置进去。
  
  入口文件格式 src/pages/文件名/index.ejs ，打包后的入口文件名为：文件名.js。
  
  打包模块支持：支持es6语法、sass语法、ejs模板、vue/react语法、图片压缩、全局zepto对象设置。
  
  插件支持：分离压缩css、打包banner描述、全局变量定义、html模版。
  
  其他支持：引入文件时不用写.js和.json后缀，引入文件时@符号表示src目录所在的绝对路径。
  
本地开发：webpackDevServer，默认端口8080，支持外部端口配置传入，代理路由/api/* 代理请求地址：http://localhost:9090/
