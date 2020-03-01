<!-- - 作者管理pagination显示错误
作者管理中，先进入最后一页页，搜索“陈其快”，再点击重置。
此时，页面下方pagination显示错误！它显示的是最后一页，但是内容却是第一页的内容。

this.state.current
 -->
<!-- 第一层查询有错误？？ -->
<!-- 

如果诗词被删除了。
那么其他使用到这首诗词的地方应该怎么办
出现了以下错误！！
```
{
    code: -1
    msg: "fail"
    message: "第2层查询错误"
    error: {}
}

遍历数组的时候，遇到了undefined
``` -->

<!-- 
# 注册
TypeError: Cannot read property '_id' of null
    at router.post (E:\WorkSpace\WebCode\final-project-etc\mern-boilerplate\server\routes\signup.js:55:30)
    at process._tickCallback (internal/process/next_tick.js:68:7)
 -->

 

POST /favoritePoetry/getPoetries 200 2.422 ms - 60
(node:35512) UnhandledPromiseRejectionWarning: Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
    at ServerResponse.setHeader (_http_outgoing.js:470:11)
    at ServerResponse.header (E:\WorkSpace\WebCode\final-project-etc\mern-boilerplate\server\node_modules\express\lib\response.js:767:10)
    at ServerResponse.send (E:\WorkSpace\WebCode\final-project-etc\mern-boilerplate\server\node_modules\express\lib\response.js:170:12)
    at ServerResponse.json (E:\WorkSpace\WebCode\final-project-etc\mern-boilerplate\server\node_modules\express\lib\response.js:267:15)
    at router.post (E:\WorkSpace\WebCode\final-project-etc\mern-boilerplate\server\routes\favoritePoetry.js:53:13)
    at process._tickCallback (internal/process/next_tick.js:68:7)

(node:35512) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
(node:35512) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.



