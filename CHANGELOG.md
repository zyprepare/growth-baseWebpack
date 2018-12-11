# 1.1.5

## Fixed

- 拼接路径使用path.posix.join方法拼接

# 1.1.4

## Fixed

- 修复bug，更新reademe文件

# 1.1.3

## FEATURE

- options入参增加mode属性，表示打包模式：0 表示默认，所有文件都放在dist目录中，文件引入时加hash值；1 表示将文件分类存放，引用文件不加hash值
- options入参增加outputPath属性，用于配置打包后的输出目录
- options入参增加spritesConfig属性，用于雪碧图配置

# 1.1.2

## Fixed

- 修复bug，更新reademe文件

# 1.1.1

## FEATURE

- 自动检测项目中是否有.babelrc文件，如果有则使用外部配置文件，没有则使用默认babel配置

# 1.1.0

## FEATURE

- 兼容iOS8到iOS10版本系统
