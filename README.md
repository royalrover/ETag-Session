# ETag-Session
use etag to realize the mechanism of session

项目采用koa作为web框架

采用Bigpipe实现客户端对服务端事件的订阅

此处只是简单的将数据存储在内存中，并且在多服务集群下未做同步，因为此处的目的是实现ETag存储sessionID，若要进行商用，则无比采用第三方
cache，比如redis

此处并不是设计一个通用的框架，因此会有相关的业务逻辑在app.js中，在后续步骤中会逐渐优化
