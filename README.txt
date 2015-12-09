# SOI2
钢铁之魂2 (by babylon.js & node.js)
Licensed under the MIT license

Copyright © 2015 buaadpy. All Rights Reserved
Contributors: CrazySssst, MCJohn117

0.学习资料
http://doc.babylonjs.com/
采用babylonjs v2.1版本

1.工程结构说明
asset  游戏资源
css    css文件
doc    文档
js     javascript文件
lib    外部依赖项
page   游戏页面
server 服务端程序

2.部署说明
修改game.html中两处IP地址为本地IP地址；
下载并解压缩apache-tomcat-8.0.26-windows-x64，将工程项目放至webapps文件夹中，启动tomcat；
下载并安装node-v4.0.0-x64，运行server文件夹中的批处理文件启动websocket服务。