/**
 * used by koa
 */
var koa = require('koa');
var logger = require('koa-logger');
var router = require('koa-router')();
var iconv = require('iconv-lite');
var app = koa();

var session = {};

router.post('/login',function *(next){
    var ctx = this;
    if(ctx.method !== 'POST')
        return;

    var _req = ctx.req,bfs = [],body;

    var p = new Promise(function(resolve,reject){
        var len = 0;
        _req.on('data',function(b) {
            bfs.push(b);
            len += b.length;
        });
        _req.on('end',function() {
            bfs = Buffer.concat(bfs,len);
            body = iconv.decode(bfs,'utf-8');
            resolve(body);
            return p;
        });
    });

    p.then(function(body){
        var s = body.split('&');
        var usrname = s[0].split('=')[1];
        var pwd = s[1].split('=')[1];
        var etag = s[2].split('=')[1];
        session[etag] = {
            usrname: usrname,
            pwd: pwd,
            etag: etag
        };
//  console.log(session[etag],etag);
    }).catch(function(e){
        console.log(e);
    })

    ctx.body = 'post ready';
});

router.get('/_eTag_.js',function * (next){
    var ctx = this;
    var etag = ctx.header['if-none-match'];
    var cache;

    if(!etag) {
        etag = new Date().getTime() + '__etag';
    }
//    console.log(session)
    if(session[etag]) {
        cache = session[etag];
    }else {
        cache = {
            etag: etag
        };
    }
    cache = JSON.stringify(cache);
    ctx.set('ETag',etag);
    ctx.set('cache-control','no-cache');
    ctx.set('content-type','application/javascript');
//  ctx.body = 'window._session = '+ cache + ';';
    ctx.body = 'd.do("etag-ready",'+ cache +')';
//    console.log('cache: '+cache)
    yield *next;

});

app.use(logger());
app.use(require('koa-static')('static'));
app.use(router.routes());
app.listen(8100,function(){
    console.log('begin listening...');
})