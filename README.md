# signalR4Miniapp

供微信小程序与SignalR交互的js类库


## 如何使用

### 调用类库
在要使用的页面上：
```
///引入这个类库
var signalR = require('../../lib/signalr/signalr.js')
///实例化一个对象
let _client = new signalR.signalR();
```

### 创建 一个映射方法

这是为了让小程序收到SignalR的消息之后进行回调
```
callMethods(methods, args) {
        console.log(methods, args);
        let self = this;
        switch (methods) {
            case 'sayHello':
                self.sayHello(args[0]);
                break;
        }
    },
```
例子里有一个sayHello方法，我们用字符串作为key。

### 进行连接

```
_client.connection(url, methodMapping);
```
- url : signalR服务器
- methodMapping : 方法和字符串之间的Mapping



### 调用SignalR方法
```
 _client.call(methodName, args, success, fail)
```
- methodName:远程方法名
- args：参数，**这里注意一定要数组格式**
- success：调用成功后的回调
- fail：失败后的回调
