$(document).ready(function(){
	//按F5时 刷新业务
	document.onkeydown = function (e) {
        var ev = window.event || e;
        var code = ev.keyCode || ev.which;
        if (code == 116) {
            ev.keyCode ? ev.keyCode = 0 : ev.which = 0;
            refreshAvtive();
            return false;
        }
     }
	//屏蔽右键 
	$(document).bind("contextmenu",function(e){return false;});	
	//屏蔽F5
	/*$(document).bind("keydown",function(e){e=window.event||e; if(e.keyCode==116){e.keyCode = 0;return  false;} });
	//屏蔽F7 
	$(document).bind("keydown",function(e){e=window.event||e; if(e.keyCode==118){e.keyCode = 0;return  false;} });*/
	//屏蔽F11 
	$(document).bind("keydown",function(e){e=window.event||e; if(e.keyCode==67){e.keyCode = 0;return  false;} });
	//屏蔽F12
	$(document).bind("keydown",function(e){e=window.event||e; if(e.keyCode==123){e.keyCode = 0;return  false;} });
	 


});
