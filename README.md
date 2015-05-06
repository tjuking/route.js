# route.js

前端路由控制器，构建单页应用的利器

### 依赖

jQuery [http://jquery.com/](http://jquery.com/)

### 兼容性

IE10+、Chrome、Firefox、Safari等（在IE6-9中更新路由将更换页面）

### 使用

	<!-- 引入依赖 和 route.js -->
	<script src="../require/jquery-1.8.3.min.js"></script>
	<script src="../src/route.js"></script>
	<script>
	//实例化Route（可传递默认的路由参数）
	var theRoute = new Route({
        type: 1
    });
    
    //开始运行
    theRoute.init();
    
    //切换路由（参数为更新的url）
    theRoute.change(url);
    
    //监听路由
    $(theRoute).on("update", function(){
         //获取路由参数
         console.log(theRoute.getConfig().type);
    });
    </script>
    
### 说明

目前支持的是URL query的变化