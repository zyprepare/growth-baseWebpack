##最基本的webpack打包方式，返回一个webpack配置对象，支持外部个性化配置传入。

##基于webpack4打包静态文件，支持单页面和多页面入口，支持最新js语法和sass语法。

## 打包规则：
  入口文件：自动将src/pages目录下的所有文件当作入口文件，无需手动配置，会自动配置进去。<br>
  入口文件格式： src/pages/文件名/index.ejs ，打包后的入口文件名为：文件名.js。<br>
  打包模块支持：支持es6语法、sass语法、ejs模板、vue/react语法、图片压缩、文件压缩、文件分离。<br>
  其他支持：引入文件时不用写.js和.json后缀，引入文件时@符号表示src目录所在的绝对路径。<br>
  开发调试：支持webpack-dev-server。
