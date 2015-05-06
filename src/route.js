//路由对象，可传递默认路由参数（需要移到common下）
function Route(defaultConfig) {
    this._config = {};
    $.extend(this._config, defaultConfig);
}

//原型属性和方法
Route.prototype = {

    //设置构造器
    constructor: Route,

    //路由初始化
    init: function () {
        this._bindEvent();
        this._updateConfig();
    },

    //改变路由（第二个参数可设置是否触发update事件，默认触发）
    change: function (url, notTrigger) {
        this._updateConfig(url);
        this._updateUrl(url);
        if (!notTrigger) {
            $(this).trigger("update");
        }
    },

    //获取路由参数
    getConfig: function () {
        return this._config;
    },

    //事件绑定
    _bindEvent: function () {
        var that = this;
        if (history.pushState) {
            $(window).on('popstate', function (e) {
                var originE = e.originalEvent;
                if (originE && originE.state) {
                    that.change(originE.state.url);
                }
            });
        }
    },

    //更新路由参数
    _updateConfig: function (url) {
        $.extend(this._config, this._getQuery(url));
    },

    //更新url
    _updateUrl: function (url) {
        if (!url) {
            return;
        }
        if (history.pushState) {
            var state = {
                title: document.title,
                url: url
            };
            history.pushState(state, state.title, state.url);
        } else {
            window.open(url, "_self");
        }
    },

    //获取query对象
    _getQuery: function (url) {
        if (!url) {
            url = location.search;
        }
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
    }
};