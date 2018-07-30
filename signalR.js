var signalR = (function () {
    let recordCode = 0x1e;
    let recordString = String.fromCharCode(recordCode);
    let isConnectioned = false;
    return {
        connection: function (url, callbacker) {
            let self = this;
            wx.connectSocket({
                url: url
            });
            wx.onSocketOpen(function () {

                let handshakeRequest = {
                    protocol: 'json',
                    version: 1
                };
                let senddata = `${JSON.stringify(handshakeRequest)}${recordString}`;
                self.isConnectioned = true;
                console.log('连接成功', senddata);
                wx.sendSocketMessage({
                    data: senddata,
                });
            });
            wx.onSocketClose(function () {
                self.isConnectioned = false;
                console.log('连接已关闭', self.isConnectioned);

            });
            //接收到消息
            wx.onSocketMessage(function (res) {
                try {
                    console.log(res);
                    let jsonstr = String(res.data).replace(recordString, '');
                    if (jsonstr.indexOf('{}{') > -1)
                        jsonstr = jsonstr.replace('{}', '');

                    let obj = JSON.parse(jsonstr);
                    console.log('server return :', obj);
                    //当收到返回消息type=1（调用方法）,target为调用的方法
                    if (obj.type == 1) {
                      
                        callbacker.callMethods(obj.target, obj.arguments);
                    }
                } catch (ex) {
                    console.log('异常：' + ex);
                    console.log('收到服务器内容：' + res.data);
                }
            });
            wx.onSocketError(function () {
                self.isConnectioned = false;
                console.log('websocket连接失败！');
            });
        },
        abortConnection: function () {
            console.log(String(this.abortConnection.name));
            wx.closeSocket();
        },
        call: function (method, data, success, fail) {
            let self = this;
            if (!self.isConnectioned){
                console.log('未连接');
                return;
            }
            let body = {
                arguments:data,
                target: method,        //SignalR端方法
                type: 1,
            };

            //发送的数据，分隔符结尾：
            let senddata = `${JSON.stringify(body)}${recordString}`;
            console.log('发送的数据：', senddata);
            wx.sendSocketMessage({
                data: senddata,
                success:success,
                fail:fail
            });
        }
    }
});

module.exports.signalR = signalR
