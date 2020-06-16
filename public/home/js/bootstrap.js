var _JM = null;

// Dom对象加载完毕后执行
if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll) ) {
    __buildBootstrap();
} else {
    document.addEventListener("DOMContentLoaded", __buildBootstrap);
}

// 兼容IE8及以下(其实根本没必要, 后面代码都没注意兼容IE)
// document.attachEvent("onreadystatechange", function () {
//     if (document.readyState === "complete") {
//         document.detachEvent("onreadystatechange", arguments.callee);
//     }

//     __buildBootstrap();
// });

// 入口函数
function __buildBootstrap () {
    _JM = new Demo.App();
    _JM.execute();
}