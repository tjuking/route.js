/**
 * 单页应用中的路由控制对象Route
 * https://github.com/tjuking/route.js v0.2
 * @param defaultConfig {object} 默认参数
 * @constructor Route
 */
function Route(defaultConfig) {
    this._defaultConfig = defaultConfig;
    this.updateConfig();
}

//Route的一些原型方法
Route.prototype = {

    //设置构造器
    constructor: Route,

    /**
     * 路由开启运行
     */
    start: function () {
        var that = this;
        var originEvent;
        //检测浏览器对pushState的支持情况
        if (this.supported()) {
            //浏览器的前进后退事件的监听
            $(window).on('popstate', function (e) {
                originEvent = e.originalEvent;
                //需要对数据的正确性进行校验
                if (originEvent && originEvent.state) {
                    //对于浏览器的前进后退响应将不再pushState
                    that.change(originEvent.state.url, false, true);
                }
            });
        }
    },

    /**
     * 更新配置信息
     * @param [url=locaiton.href] {string} 传入的URL参数
     */
    updateConfig: function (url) {
        //清空原有的配置信息，避免干扰
        this._config = {};
        //合并URL中的以及默认配置信息到最终的配置中
        $.extend(this._config, this._defaultConfig, this.getQuery(url));
    },

    /**
     * 改变路由
     * @param url {string} 需要改变到的URL（例如"/?type=1"）
     * @param [notTrigger=false] {boolean} 是否不触发update通知，默认是触发
     * @param [notHandler=false] {boolean} 是否不插入历史记录，默认是需要插入历史记录
     */
    change: function (url, notTrigger, notHandler) {
        url = this.getUrl(url);
        this.updateConfig(url);
        //触发update通知
        if (!notTrigger) {
            $(this).trigger("update");
        }
        //插入历史记录或新开窗口
        if (!notHandler) {
            this.handleUrl(url);
        }
    },

    /**
     * 获取路由配置信息（不暴露this._config）
     * @returns {object}
     */
    getConfig: function () {
        return this._config;
    },

    /**
     * 处理url（插入历史记录，对于不支持的情况则当前窗口打开页面）
     * @param url {string} 需要处理的URL
     */
    handleUrl: function (url) {
        url = this.getUrl(url);
        //对于支持的情况则插入历史记录
        if (this.supported()) {
            this.pushState(url);
        //如果不支持则当前窗口打开页面
        } else {
            window.open(url, "_self");
        }
    },

    /**
     * 插入或替换历史记录
     * @param url {string} 需要处理的URL
     * @param [title=document.title] {string} 标题
     * @param [isReplace=false] {boolean} 是否替换历史记录
     */
    pushState: function (url, title, isReplace) {
        var state;
        url = this.getUrl(url);
        title = title || document.title;
        state = {
            url: url,
            title: title
        };
        if (this.supported()) {
            history[isReplace ? "replaceState" : "pushState"](state, title, url);
        }
    },

    /**
     * 检测浏览器是否支持pushState特性
     * @returns {boolean}
     */
    supported: function () {
        return window.history && typeof history.pushState == "function";
    },

    /**
     * 获取URL中对query的解析结果
     * @param url {string} 需要处理的URL
     * @returns {object}
     */
    getQuery: function (url) {
        url = this.getUrl(url);
        var search = url.indexOf("?") >= 0 ? url.split("?")[1] : "";
        var queryParam = search.split("&");
        var queryObj = {};
        for (var i = 0; i < queryParam.length; i++) {
            var queryItem = queryParam[i].split("=");
            if (queryItem.length && queryItem[0]) {
                queryObj[queryItem[0]] = queryItem.length == 2 ? queryItem[1] : true;
            }
        }
        return queryObj;
    },

    /**
     * 获取URL的修正结果
     * @param url 需要处理的URL
     * @returns {string}
     */
    getUrl: function (url) {
        return url || location.href;
    }
};