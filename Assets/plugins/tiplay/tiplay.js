(function($){
	$("head").append("<link>");
	    css = $("head").children(":last");
	    css.attr({
	        rel: "stylesheet",
	        type: "text/css",
	        href: "Assets/plugins/tiplay/tiplay.css"
	    });

	tiplay = function(params){
		
		if($('#confirmOverlay').length){
			// 确认框已经显示
			return false;
		}		
		var buttonHTML = '';
		$.each(params.buttons,function(name,obj){
			// 生成的标记按钮			
			buttonHTML += '<a href="#" class="button '+obj['class']+'">'+name+'<span></span></a>';			
			if(!obj.action){
				obj.action = function(){};
			}
		if (!params.title) {params.title = '提 示';}
		if (!params.msg) {params.msg = '确认要提交此操作吗？';}
		});
		var markup = [
			'<div id="confirmOverlay">',
			'<div id="confirmBox">',
			'<h1>',params.title,'</h1>',
			'<p>',params.msg,'</p>',
			'<div id="confirmButtons">',
			buttonHTML,
			'</div></div></div>'
		].join('');		
		$(markup).hide().appendTo('body').fadeIn();		
		var buttons = $('#confirmBox .button'),i = 0;
		$.each(params.buttons,function(name,obj){
			buttons.eq(i++).click(function(){				
				// Calling the action attribute when a
				// click occurs, and hiding the confirm.
				params.name = 
				obj.action();
				tiplay.hide();
				return false;
			});
		});
	}
	tiplay.hide = function(){
		$('#confirmOverlay').fadeOut(function(){
			$(this).remove();
		});
	}	
})(jQuery);