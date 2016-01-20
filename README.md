#SOI2
Soul of IronⅡ 钢铁之魂2 (by Babylon.js)<br>
Licensed under the MIT license<br>
<br>
Copyright © 2015-2016 buaadpy. All Rights Reserved<br>
Contributors: [CrazySssst](https://github.com/CrazySssst) ; [MCJohn117](https://github.com/MCJohn117)<br>
Babylonjs Version: v2.3.0-alpha<br>
<br>
<br>
###0.参考资料
babylonjs官方文档:[http://doc.babylonjs.com/](http://doc.babylonjs.com/)<br>
babylonjs官网示例:[http://flightarcade.com/](http://flightarcade.com/)<br>
网游坦克世界:[http://wot.kongzhong.com/wot.html](http://wot.kongzhong.com/wot.html)<br>
###1.工程说明
asset  (游戏资源)<br>
css    (css文件)<br>
doc    (相关文档)<br>
js     (javascript文件)<br>
lib    (外部依赖项)<br>
page   (游戏页面)<br>
server (服务端程序)<br>
###2.部署说明
(1)修改game.html中两处IP地址为服务器IP地址<br>
(2)下载并解压缩apache-tomcat-8.0.26-windows-x64，将项目放至webapps文件夹中并启动tomcat<br>
(3)下载并安装node-v4.0.0-x64，运行server文件夹中的批处理文件启动websocket服务<br>
###3.联机说明
服务端启动以提供通信支持，另外需要一个网页端充当主机运行游戏逻辑<br>
<br>
![Version1.0](/doc/release_v1.0.jpg)