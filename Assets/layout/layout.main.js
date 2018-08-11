/*左侧菜单点击*/
$(".side-menu").on('click', 'li a', function(e) {
	var animationSpeed = 300;
	var $this = $(this);
	var checkElement = $this.next();

	if (checkElement.is('.menu-item-child') && checkElement.is(':visible')) {
	  checkElement.slideUp(animationSpeed, function() {
		checkElement.removeClass('menu-open');
	  });
	  checkElement.parent("li").removeClass("active");
	  $(this).find('i:first').removeClass("fa-folder-open-o").addClass("fa-folder-o");
	}
	//如果菜单是不可见的
	else if ((checkElement.is('.menu-item-child')) && (!checkElement.is(':visible'))) {
	  //文件夹图标打开
	  $(this).find('i:first').removeClass("fa-folder-o").addClass("fa-folder-open-o");
	  //获取上级菜单
	  var parent = $this.parents('ul').first();
	  //从父级开始找所有打开的菜单并关闭
	  var ul = parent.find('ul:visible').slideUp(animationSpeed);
	  //在父级中移出menu-open标记
	  ul.removeClass('menu-open');
	  //获取父级li
	  var parent_li = $this.parent("li");
	  //打开菜单时添加menu-open标记
	  checkElement.slideDown(animationSpeed, function() {
		//添加样式active到父级li
		checkElement.addClass('menu-open');
		parent.find('li.active').removeClass('active').find('i:first').removeClass("fa-folder-open-o").addClass("fa-folder-o");
		parent_li.addClass('active');
	  });
	}
	//防止有链接跳转
	e.preventDefault();

	BOOT($this);
});


//获取全部的tab标签的宽度
function getContentWidth(c){
    var w = 0;
    c.children().each(function(){
        w += $(this).outerWidth(true);
    });
    return w;
}
// 判断tab是否已存在
function tabRepeat(id) {
    var li = $(".tabs-content li");
    var isRepeat = false;
    $.each( li , function (i,n) {
        if($(n).attr("data-id") == id){
            isRepeat = true;
            return false;
        }
    });
    return isRepeat;
}

//添加tab方法
function addTab(id, title, content) {

    var ul = $(".tabs-content");
    var panels = $(".tab-panel");
    var tab;

    // 如果tab标题已存在，就打开当前标签页并返回
    if (tabRepeat(id)) {
        tab = $(".tabs-content li[data-id=" + id + "]");
        scrollSelected(tab);
    } else {
        //创建tab
        //<i class="fa fa-times-circle tab-close" aria-hidden="true"></i></a>
        tab = $(
            '<li data-id = "' + id + '">' +
            '<a href="javascript:void(0)">' +
            title +
            ' <i class="icon layui-unselect tab-close" aria-hidden="true">&#x1006;</i>' +
            '</li>'
        );
        //创建tab面板
        var tabPanel = $(
            '<div class="panel-content" data-id="'+ id +'">' +
            content +
            '</div>'
        );
        //将tab和tab面板添加到页面
        tab.appendTo(ul);
        tabPanel.appendTo(panels);

        //如果标签过多，就滚动标签容器使标签显示
        var tabsWidth = getContentWidth(ul);
        tabsWidth > $(".tabs-wrap").width() &&  ul.animate({
            "margin-left" : $(".tabs-wrap").width() - tabsWidth
        });
    }
    //选中tab
    selectTab(tab);
}
//选中标签页
function selectTab(self){
    //所有的tab取消选中
    $(".tabs-content li").removeClass("active");
    //隐藏所有的面板
    $(".panel-content ").hide();
    //选中时显示选中的标签页
    self.addClass("active");
    var id = self.attr("data-id");
    $(".panel-content[data-id="+ id + "]").show();
    return false;
}
//选中时移动Tab
function scrollSelected(self){
    var w= parseInt(self.css("width"));
    var ul = $(".tabs-content");
    var ulLeft = parseInt( ul.css("margin-left"));
    var wapW = $(".tabs-wrap").width();
    var tabsWidth = getContentWidth(ul);
    var prveall = self.prevAll();
    var nextall = self.nextAll();
    var prveallwidth = 0;
    var nextallwidth = 0;
    var newleft;
    $.each(prveall,function(i , n){
        prveallwidth += parseInt($(n).css("width"))
    });
    $.each(nextall,function(i , n){
        nextallwidth += parseInt($(n).css("width"))
    });
    if(prveallwidth + w < wapW){
        newleft = 0
    }else if( nextallwidth < wapW ){
        newleft = wapW - tabsWidth
    }else{
        newleft = -prveallwidth + wapW/2
    }
    if( prveallwidth < -ulLeft || prveallwidth > wapW - w ){
        ul.animate({
            "margin-left": newleft
        })
    }
}
//删除标签页
function  closeTab(self){
    var li = self.parents("li");
    var id = li.attr("data-id");
    var nextLI = li.next();
    var prevLI = li.prev();
    var w = li.width();
    var ul = $(".tabs-content");
    var tabConLeft = parseInt(ul.css("margin-left"));
    //删除标签和面板
    li.remove();
    $(".panel-content[data-id="+ id + "]").remove();
    //删除标签页时显示其他标签页
    if(li.hasClass("active")){
        prevLI.addClass("active");
        $(".panel-content[data-id="+ prevLI.attr("data-id") + "]").show();
    }else if(li.hasClass("active") && nextLI.size() != 0){
        nextLI.addClass("active");
        $(".panel-content[data-id="+ nextLI.attr("data-id") + "]").show();
        return false
    }

    //需要时滚动标签
    tabConLeft < 0 && ul.animate({
        "margin-left": tabConLeft + w > 0 ? 0 : tabConLeft + w
    });
}
//绑定点击事件
function bindEvents(self) {
    self.unbind().bind("click", function (e) {
        var left = 260;
        var ul = $(".tabs-content");
        var ulLeft = parseInt(ul.css("margin-left"));
        var tabsWidth = getContentWidth(ul);
        if ($(e.target).hasClass("tab-left") || $(e.target).parent().hasClass("tab-left")) {
            ulLeft < 0 && scrollBy(left);
        } else if ($(e.target).hasClass("tab-right") || $(e.target).parent().hasClass("tab-right")) {
            ulLeft > $(".tabs-wrap").width() - tabsWidth && scrollBy(-left)
        } else if($(e.target).hasClass("tab-close")){
        	closeTab($(e.target));
        }else{
            var li = $(e.target).closest('li');
            if(li.length){
                selectTab(li);
            }
            return false
        }
    }).on('contextmenu','li',function(e){
        e.preventDefault();
        selectTab($(this));//使用右键，同时选择了该标签
        $(".Rightmenu").css({
            display: 'block',
            left: e.pageX,
            top: e.pageY
        });
    });
    tabRightmenuEven();
}
//设置标签滚动
function scrollBy(left){
    var ul = $(".tabs-content");
    var ulLeft = parseInt(ul.css("margin-left"));
    var tabsWidth = getContentWidth(ul);
    var newLeft = ulLeft + left;
    if(newLeft > 0 ){
        newLeft = 0
    }else if(newLeft < $(".tabs-wrap").width() - tabsWidth){
        newLeft = $(".tabs-wrap").width() - tabsWidth
    }
    ul.animate({
        "margin-left":  newLeft
    })
}

//绑定右键菜单事件
function tabRightmenuEven() {
    //离开选项卡时，隐藏右键菜单
    $(".Rightmenu").on('mouseleave',function(){
        $(this).hide();
        return false;
    });
    $(".sidebar, .main, .top-navbar").mouseover(function(){
        $(".Rightmenu").hide();
    });
    //关闭标签
    $('.tabCloseOne').click(function(){
        layer.msg('这个功能还在开发中，请稍后在试！');
    });
    //刷新
    $('.tabUpdate').click(function () {
        var tabs = $(".tabs-content li");
        tabs.each(function (i, n) {
            if ($(n).hasClass("active")) {
                var id = $(n).attr("data-id");
                //用js调用强制刷新
                $(".panel-content[data-id = '"+ id +"'] iframe").attr('src', $(".panel-content[data-id = '"+ id +"'] iframe").attr('src'));
            }
        });
        $(".Rightmenu").hide();
        return false;
    });
    //关闭全部
    $(".tabCloseAll").click(function () {
        var tabs = $(".tabs-content li");
        $.each( tabs, function( i , n){
            var id = $(n).attr("data-id");
            if(id != 0){
                $(n).remove();
                $(".panel-content[data-id = '"+ id +"']").remove();
            }else{
                $(n).addClass("active");
                $(".panel-content[data-id = '"+ id +"']").show();
            }
        });
        $(".Rightmenu").hide();
        return false;
    });
    //关闭其他页面
    $(".tabCloseOther").click(function () {
        var tabs = $(".tabs-content li");
        tabs.parent().css("margin-left", "0px");
        tabs.each(function (i, n) {
            if (i != 0 && !$(n).hasClass("active")) {
                var id = $(n).attr("data-id");
                $(n).remove();
                $(".panel-content[data-id = '"+ id +"']").remove();
            }
        });
        $(".Rightmenu").hide();
        return false;
    });
    //关闭当前tab之前的所有页面
    $(".tabprevClose").click(function () {
        var tab =  $(".tabs-content li.active");
        var prevalltab =  tab.prevAll();
        var ulLeft = parseInt(tab.parent().css("margin-left"));
        prevalltab.each(function (i, n) {
            if (i != prevalltab.length-1) {
                var id = $(n).attr("data-id");
                $(n).remove();
                $(".panel-content[data-id = '"+ id +"']").remove();
            }
        });
        ulLeft < 0 && tab.parent().animate({ "margin-left" : 0 });
        $(".Rightmenu").hide();
        return false;
    });
    //关闭当前tab之后的所有页面
    $(".tabnextClose").click(function () {
        var tab =  $(".tabs-content li.active");
        var nextalltab =  tab.nextAll();
        var ulLeft = parseInt(tab.parent().css("margin-left"));
        var wapW = $(".tabs-wrap").width();
        nextalltab.each(function (i, n) {
            var id = $(n).attr("data-id");
            $(n).remove();
            $(".panel-content[data-id = '" + id + "']").remove();
        });
        var tabs = $(".tabs-content li");
        var tabsW = 0;
        tabs.each(function(z,x){
            tabsW += parseInt($(x).css("width"));
        });
        if(ulLeft < 0 ){
            tab.parent().animate({
                "margin-left" : tabsW < wapW ? 0 : wapW - tabsW
            });
        }
        $(".Rightmenu").hide();
        return false;
    });
}


function BOOT(cur){
	/*alert(1);*/
	var $this = cur;
	var h = $this.attr("href"),
		id2 = $this.data("index"),
		id  = $this.attr("data-id"),
		title = $this.find("span").text(),
		isHas = false;/*alert(h);*/
	if (h == "" || $.trim(h).length == 0) {
		return false;
	}

    var content = '<iframe class="body-iframe" name="iframe0" width="100%" height="100%" src="'+h+'" frameborder="0" seamless></iframe>';
    addTab(id,title,content);
    bindEvents($(".tab-header"));
    return false
}


/*循环菜单*/
function initMenu(menu,parent){
	for(var i=0; i<menu.length; i++){   
		var item = menu[i];
		var str = "";
		try{
			if(item.isHeader == "1"){
				str = "<li class='menu-header'>"+item.name+"</li>";
				$(parent).append(str);
				if(item.childMenus != ""){
					initMenu(item.childMenus,parent);
				}
			}else{
				item.icon == "" ? item.icon = "&#xe610" : item.icon = item.icon;
				if(item.childMenus == ""){
					//无子菜单
					str = "<li><a href='"+item.url+"' data-id='"+item.id+"'><i class='fa fa-file-text-o' aria-hidden='true'></i><span>"+item.name+"</span></a></li>";
					$(parent).append(str);
				}else{
					//有子菜单
					str = "<li><a href='"+item.url+"' data-id='"+item.id+"'><i class='fa fa-folder-o' aria-hidden='true'></i><span>"+item.name+"</span><i class='fa fa-caret-right icon-right' aria-hidden='true'></i></a>";
					str +="<ul class='menu-item-child' id='menu-child-"+item.id+"'></ul></li>";
					$(parent).append(str);
					var childParent = $("#menu-child-"+item.id);
					initMenu(item.childMenus,childParent);
				}
			}
		}catch(e){}
	}
}



/*头部下拉框移入移出*/
$(document).on("mouseenter",".header-bar-nav",function(){
	$(this).addClass("open");
});
$(document).on("mouseleave",".header-bar-nav",function(){
	$(this).removeClass("open");
});

/*左侧菜单展开和关闭按钮事件*/
$(document).on("click",".layout-side-arrow",function(){
	if($(".layout-side").hasClass("close")){
		$(".layout-side").removeClass("close");
		$(".layout-main").removeClass("full-page");
		$(".layout-footer").removeClass("full-page");
		$(this).removeClass("Sclose");
		$(".layout-side-arrow-icon").removeClass("Sclose");
	}else{
		$(".layout-side").addClass("close");
		$(".layout-main").addClass("full-page");
		$(".layout-footer").addClass("full-page");
		$(this).addClass("Sclose");
		$(".layout-side-arrow-icon").addClass("Sclose");
	}
});

/*头部菜单按钮点击事件*/
$(".header-menu-btn").click(function(){
	$(".layout-side").removeClass("close");
	$(".layout-main").removeClass("full-page");
	$(".layout-footer").removeClass("full-page");
	$(".layout-side-arrow").removeClass("close");
	$(".layout-side-arrow-icon").removeClass("close");
	
	$(".layout-side").slideToggle();
});

/*左侧菜单响应式*/
$(window).resize(function() {
    var width = $(this).width();  
	if(width >= 750){
		$(".layout-side").show();
	}else{
		$(".layout-side").hide();
	}
});
//刷新当前页面
$(".refresh").click(function() {
    tiplay({
            /*'title'       : '提示',*/
            /*'msg' : '22222222222',*/
            'buttons'   : {
                '确 认'   : {
                    'class' : 'blue',
                    'action': function(){
                        var tabs = $(".tabs-content li");
                        tabs.each(function (i, n) {
                            if ($(n).hasClass("active")) {
                                var id = $(n).attr("data-id");
                                //用js调用强制刷新
                                $(".panel-content[data-id = '"+ id +"'] iframe").attr('src', $(".panel-content[data-id = '"+ id +"'] iframe").attr('src'));
                            }
                        });
                    }
                },
                '取 消'   : {
                    'class' : 'gray',
                    'action': function(){
                        $(".Rightmenu").hide();
                    }  // 在这种情况下。你可以省略action属性
                }
            }
        });
	//询问框
   /* layer.confirm('你确定要刷新当前页面吗？', {
      btn: ['确 定','取 消'] //按钮
    }, function(){
        var tabs = $(".tabs-content li");
        tabs.each(function (i, n) {
            if ($(n).hasClass("active")) {
                var id = $(n).attr("data-id");
                //用js调用强制刷新
                $(".panel-content[data-id = '"+ id +"'] iframe").attr('src', $(".panel-content[data-id = '"+ id +"'] iframe").attr('src'));
            }
        });
        $(".Rightmenu").hide();
        layer.msg('刷新成功！', {icon: 1});
    }, function(){
      layer.close();
    });*/
})
/*皮肤选择*/
$(".dropdown-skin li a").click(function(){
	var v = $(this).attr("data-val");
	var hrefStr=$("#layout-skin").attr("href");
	var hrefRes=hrefStr.substring(0,hrefStr.lastIndexOf('skin/'))+'skin/'+v+'/skin.css';
	$(window.frames.document).contents().find("#layout-skin").attr("href",hrefRes);
	
	setCookie("scclui-skin", v);
});

/*获取cookie中的皮肤*/
function getSkinByCookie(){
	var v = getCookie("scclui-skin");
	var hrefStr=$("#layout-skin").attr("href");
	if(v == null || v == ""){
		v="qingxin";
	}
	if(hrefStr != undefined){
		var hrefRes=hrefStr.substring(0,hrefStr.lastIndexOf('skin/'))+'skin/'+v+'/skin.css';
		$("#skin").attr("href",hrefRes);
	}
}

/*随机颜色*/
function getMathColor(){
	var arr = new Array();
	arr[0] = "#ffac13";
	arr[1] = "#83c44e";
	arr[2] = "#2196f3";
	arr[3] = "#e53935";
	arr[4] = "#00c0a5";
	arr[5] = "#16A085";
	arr[6] = "#ee3768";

	var le = $(".menu-item > a").length;
	for(var i=0;i<le;i++){
		var num = Math.round(Math.random()*5+1);
		var color = arr[num-1];
		$(".menu-item > a").eq(i).find("i:first").css("color",color);
	}
}

/***************************************暂时未用******************/
/*设置cookie*/
function setCookie(name, value, days){
	if(days == null || days == ''){
		days = 300;
	}
	var exp  = new Date();
	exp.setTime(exp.getTime() + days*24*60*60*1000);
	document.cookie = name + "="+ escape (value) + "; path=/;expires=" + exp.toGMTString();
}

/*获取cookie*/
function getCookie(name) {
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr = document.cookie.match(reg))
		return unescape(arr[2]); 
	else 
		return null; 
}

/*ajax请求*/
function ajax(url, param, datat, callback) {  
	$.ajax({  
		type: "post",  
		url: url,  
		data: param,  
		dataType: datat,  
		success: function(data){
			callback;
		},  
		error: function () {  
			alert("失败.."); 
		}
	});  
}  
/************************************************************************/


/*
  初始化加载
*/
$(function(){
	/*获取皮肤*/
	//getSkinByCookie();

	/*菜单json*/
	var menu = [{"id":"1","name":"内容管理","parentId":"0","url":"","icon":"","order":"1","isHeader":"1","childMenus":[
					{"id":"3","name":"文章管理","parentId":"1","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
						{"id":"4","name":"文章审核","parentId":"3","url":"test.html","icon":"","order":"1","isHeader":"0","childMenus":""},
						{"id":"5","name":"文章列表","parentId":"3","url":"test2.html","icon":"","order":"1","isHeader":"0","childMenus":""},
						{"id":"19","name":"发表文章","parentId":"3","url":"test3.html","icon":"","order":"1","isHeader":"0","childMenus":""}
					]},
					{"id":"6","name":"功能组件	","parentId":"1","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
						{"id":"7","name":"微信管理","parentId":"6","url":"home3.html","icon":"","order":"1","isHeader":"0","childMenus":""},
						{"id":"8","name":"图片播放器","parentId":"6","url":"home4.html","icon":"","order":"1","isHeader":"0","childMenus":""},
						{"id":"30","name":"广告管理","parentId":"6","url":"home5.html","icon":"","order":"1","isHeader":"0","childMenus":""},
						{"id":"31","name":"留言管理","parentId":"6","url":"home6.html","icon":"","order":"1","isHeader":"0","childMenus":""},
						{"id":"32","name":"评论管理","parentId":"6","url":"home7.html","icon":"","order":"1","isHeader":"0","childMenus":""},
						{"id":"33","name":"友情链接","parentId":"6","url":"home8.html","icon":"","order":"1","isHeader":"0","childMenus":""},
						{"id":"34","name":"站点风格","parentId":"6","url":"home9.html","icon":"","order":"1","isHeader":"0","childMenus":""},
						{"id":"35","name":"浏览权限管理","parentId":"6","url":"hom10.html","icon":"","order":"1","isHeader":"0","childMenus":""}
					]},
					{"id":"31","name":"会员管理","parentId":"1","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
						{"id":"32","name":"会员信息","parentId":"31","url":"home13.html","icon":"","order":"1","isHeader":"0","childMenus":""},
						{"id":"33","name":"会员角色","parentId":"31","url":"home14.html","icon":"","order":"1","isHeader":"0","childMenus":""},
						{"id":"34","name":"积分配置","parentId":"31","url":"home15.html","icon":"","order":"1","isHeader":"0","childMenus":""}
					]}
				]},
				{"id":"2","name":"框架案例","parentId":"0","url":"","icon":"","order":"2","isHeader":"1","childMenus":[
					{"id":"9","name":"新功能","parentId":"2","url":"","icon":"","order":"1","isHeader":"0","childMenus":""},
					{"id":"10","name":"多级","parentId":"2","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
						{"id":"11","name":"一级","parentId":"10","url":"","icon":"","order":"1","isHeader":"0","childMenus":""},
						{"id":"12","name":"一级","parentId":"10","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
							{"id":"13","name":"二级","parentId":"12","url":"","icon":"","order":"1","isHeader":"0","childMenus":""},
							{"id":"14","name":"二级","parentId":"12","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
								{"id":"15","name":"三级","parentId":"14","url":"","icon":"","order":"1","isHeader":"0","childMenus":""},
								{"id":"16","name":"三级","parentId":"14","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
									{"id":"17","name":"四级","parentId":"16","url":"","icon":"","order":"1","isHeader":"0","childMenus":""},
									{"id":"18","name":"四级","parentId":"16","url":"1.html","icon":"","order":"1","isHeader":"0","childMenus":""}
								]}
							]}
						]}
					]}
				]},
				{"id":"3","name":"菜单管理","parentId":"0","url":"","icon":"","order":"2","isHeader":"1","childMenus":[
					{"id":"19","name":"头部菜单","parentId":"3","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
                    {"id":"21","name":"添加菜单","parentId":"20","url":"","icon":"","order":"1","isHeader":"0","childMenus":""},
                    ]},
					{"id":"20","name":"右侧菜单","parentId":"3","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
						{"id":"21","name":"管理右侧菜单","parentId":"20","url":"","icon":"","order":"1","isHeader":"0","childMenus":""},
						{"id":"22","name":"添加右侧菜单","parentId":"20","url":"admenu/addmenu.html","icon":"","order":"1","isHeader":"0","childMenus":""}
					]},
				]},
                {"id":"100","name":"框架示例","parentId":"0","url":"","icon":"","order":"2","isHeader":"1","childMenus":[
                    {"id":"101","name":"表格","parentId":"100","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
                        {"id":"102","name":"基本","parentId":"101","url":"table_basic.html","icon":"","order":"1","isHeader":"0","childMenus":""},
                        {"id":"103","name":"管理","parentId":"101","url":"table_manage.html","icon":"","order":"1","isHeader":"0","childMenus":""},
                        {"id":"104","name":"默认","parentId":"101","url":"table_manage.html","icon":"","order":"1","isHeader":"0","childMenus":""},              
                        {"id":"103","name":"表格工具","parentId":"101","url":"table_manage_tabletools.html","icon":"","order":"1","isHeader":"0","childMenus":""},
                        {"id":"104","name":"键表格","parentId":"101","url":"table_manage_keytable.html","icon":"","order":"1","isHeader":"0","childMenus":""},
                        {"id":"105","name":"排序表","parentId":"101","url":"","icon":"","order":"1","isHeader":"0","childMenus":""},
                        {"id":"106","name":"校验表","parentId":"101","url":"","icon":"","order":"1","isHeader":"0","childMenus":""},
                    ]},
                    {"id":"200","name":"相册","parentId":"100","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
                        {"id":"201","name":"相册 V1","parentId":"200","url":"gallery.html","icon":"","order":"1","isHeader":"0","childMenus":""},
                        {"id":"202","name":"相册 V2","parentId":"200","url":"gallery_v2.html","icon":"","order":"1","isHeader":"0","childMenus":""}
                    ]},
                    {"id":"300","name":"表单","parentId":"100","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
                        {"id":"301","name":"表单元素","parentId":"300","url":"form_elements.html","icon":"","order":"1","isHeader":"0","childMenus":""},
                        {"id":"302","name":"表单插件","parentId":"300","url":"form_plugins.html","icon":"","order":"1","isHeader":"0","childMenus":""},
                        {"id":"303","name":"滑块形式+切换器","parentId":"300","url":"form_slider_switcher.html","icon":"","order":"1","isHeader":"0","childMenus":""},
                        {"id":"304","name":"表单验证","parentId":"300","url":"","icon":"","order":"1","isHeader":"0","childMenus":""},
                        {"id":"305","name":"表单向导","parentId":"300","url":"form_validation.html","icon":"","order":"1","isHeader":"0","childMenus":""},
                        {"id":"306","name":"向导+验证","parentId":"300","url":"form_wizards_validation.html","icon":"","order":"1","isHeader":"0","childMenus":""},
                        {"id":"307","name":"文件上传","parentId":"300","url":"form_multiple_upload.html","icon":"","order":"1","isHeader":"0","childMenus":""},
                    ]},
                    {"id":"400","name":"电子邮箱","parentId":"100","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
                        {"id":"401","name":"收件箱v1","parentId":"400","url":"email_inbox.html","icon":"","order":"1","isHeader":"0","childMenus":""},
                        {"id":"402","name":"收件箱v2","parentId":"400","url":"email_inbox_v2.html","icon":"","order":"1","isHeader":"0","childMenus":""},
                        {"id":"403","name":"写邮件","parentId":"400","url":"email_compose.html","icon":"","order":"1","isHeader":"0","childMenus":""},
                        {"id":"404","name":"阅读邮件","parentId":"400","url":"email_detail.html","icon":"","order":"1","isHeader":"0","childMenus":""},
                    ]},
                    {"id":"500","name":"页面布局","parentId":"100","url":"","icon":"","order":"1","isHeader":"0","childMenus":[
                        {"id":"501","name":"面板","parentId":"500","url":"page_Panel.html","icon":"","order":"1","isHeader":"0","childMenus":""},
                        {"id":"502","name":"布局","parentId":"500","url":"page_layout.html","icon":"","order":"1","isHeader":"0","childMenus":""},
                    ]},
                ]},
                {"id":"1000","name":"框架版本","parentId":"0","url":"","icon":"","order":"2","isHeader":"1","childMenus":[
                    {"id":"1001","name":"程序发布","parentId":"1000","url":"../update.php","icon":"","order":"1","isHeader":"0","childMenus":""},
                ]},
				];
	initMenu(menu,$(".side-menu"));
	$(".side-menu > li").addClass("menu-item");
	
	/*获取菜单icon随机色*/
	//getMathColor();
});












