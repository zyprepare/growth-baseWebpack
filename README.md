##最基本的webpack打包方式，返回一个webpack配置对象，支持外部个性化配置传入。

##基于webpack4打包静态文件，支持单页面和多页面入口，支持最新js语法和sass语法。

## 打包规则：
  入口文件：自动将src/pages目录下的所有文件当作入口文件，无需手动配置，会自动配置进去。<br>
  入口文件格式： src/pages/文件名/index.ejs ，打包后的入口文件名为：文件名.js。<br>
  打包模块支持：支持es6语法、sass语法、ejs模板、vue/react语法、图片压缩、文件压缩、文件分离。<br>
  其他支持：引入文件时不用写.js和.json后缀，引入文件时@符号表示src目录所在的绝对路径。<br>
  开发调试：支持webpack-dev-server。

## 版本说明：
 1.1.5：<br>
 -&nbsp;拼接路径使用path.posix.join方法拼接。<br>
 1.1.4：<br>
 -&nbsp;修复bug，更新reademe文件。<br>
 1.1.3：<br>
 -&nbsp;options入参增加mode属性，表示打包模式：0 表示默认，所有文件都放在dist目录中，文件引入时加hash值；1 表示将文件分类存放，引用文件不加hash值。<br> 
 -&nbsp;options入参增加outputPath属性，用于配置打包后的输出目录。<br>
 -&nbsp;options入参增加spritesConfig属性，用于雪碧图配置。<br>
 1.1.2：<br>
 -&nbsp;修复bug，更新reademe文件。<br>
 1.1.1：<br>
 -&nbsp;自动检测项目中是否有.babelrc文件，如果有则使用外部配置文件，没有则使用默认babel配置。<br>
 1.1.0：<br>
 -&nbsp;兼容iOS8到iOS10版本系统。<br>
