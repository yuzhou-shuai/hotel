;

function MyAlert(obj){
	var callbackOK = null,
		callbackCancle = null;
	if ($(".alertBox").length == 0) {
		var alertElem = '<div class="alertDisable">\n' +
            '\t\t<div class="alertBox">\n' +
            '\t\t\t<ul>\n' +
            '\t\t\t\t<li class="alertHeader">标题</li>\n' +
            '\t\t\t\t<li class="alertContent">\n' +
            '\t\t\t\t<p></p>\n' +
            '\t\t\t\t</li>\n' +
            '\t\t\t\t<li class="alertFooter">\n' +
            '\t\t\t\t\t<a href="javascript:void(0);" class="alertOK">确定</a>\n' +
            '\t\t\t\t\t<a href="javascript:void(0);" class="alertCancle">取消</a>\n' +
            '\t\t\t\t</li>\n' +
            '\t\t\t</ul>\n' +
            '\t\t</div>\n' +
            '\t</div>';
        $("body").append(alertElem);
	}
	$(".alertFooter").on("click","a",function(){
    	if ($(this).attr("class") == "alertOK") {
    		if (callbackOK) {
    			callbackOK();
    		}
    		$(".alertDisable").css("display","none");
    	}
    	else{
    		if (callbackCancle) {
    			callbackCancle();
    		}
    		$(".alertDisable").css("display","none");
    	}
    	$(".alertContent").css({"line-height":"normal"});
		$(".alertContent p").css({"text-align":"left","text-indent":"2rem"});
    	$(".alertFooter").off("click","a");
    });

	if (!obj) {
		$(".alertCancle").css("display","none");
		$(".alertOK").css("margin-right","0");
		$(".alertDisable").css("display","block");
		return;
	}

	if (obj.title) {
		$(".alertHeader").text(obj.title);
	}
	if (obj.msg) {
		$(".alertContent p").text(obj.msg);
	}

	if (obj.button && obj.button.ok) {
		$(".alertOK").text(obj.button.ok);
		callbackOK = obj.button.okEvent;
		if (obj.button.cancle) {
			$(".alertCancle").text(obj.button.cancle);
			$(".alertCancle").css("display","inline-block");
			$(".alertOK").css("margin-right","5%");
			callbackCancle = obj.button.cancleEvent;
		}
		else{
			$(".alertCancle").css("display","none");
			$(".alertOK").css("margin-right","0");
		}
	}
	else{
		$(".alertCancle").css("display","none");
		$(".alertOK").css("margin-right","0");
	}

	$(".alertDisable").css("display","block");
	var p_msg = $(".alertContent p");
	// var a = parseInt(p_msg.css("font-size"));
	// var b= p_msg.height();
	if (p_msg.height() < 2*parseInt(p_msg.css("font-size"))) {
		$(".alertContent").css({"line-height":"10rem"});
		$(".alertContent p").css({"text-align":"center","text-indent":"0"});
	}
}