var banners = 1;//banner显示的第一幅画面1~banner_max范围内任意选择
var speed = 5;//每5秒切换一次
var banner_max;//banner总数
var timer;//计时器对象

//img标签后直接调用运行
function loads()
{
	var img_num = $(".banner_img").children("img").length;//获取img标签的总数量
 	banner_max = img_num;

 	//隐藏所有banner
 	for(var i=1; i<=banner_max; ++i)
	{
		$(".banner_img"+i).fadeTo(100,0);
	}
	
	$(".banner_img"+banners).fadeTo(100,1);//显示设置的第一张banner

 	var numbers_span = "";
	for(var i=1; i<=img_num; ++i)
	{
		numbers_span += '<span class="num'+i+'" onclick="manual_replace_banner('+i+')">'+i+'</span>'; //循环赋值到字符串
	}

	$(".numbers").html(numbers_span);//设置对应banner的数字

	//自适应修改行高
	var banners_height = $(".banners").height(); 
	$(".banners").css("line-height",banners_height+"px");


}

//窗口事件修改行高
$(window).resize(function() {

	var banners_height = $(".banners").height(); 
	$(".banners").css("line-height",banners_height+"px");

});



//页面文件加载完毕后自动调用
$(document).ready(function(){

	banner_number();//banner页数高亮显示

	timer = setInterval(auto_replace_banner, speed*1000);//banner切换计时器

});



//点击左右按钮更换banner
function banner_left_right(sj)
{
	var sjs;

	if(sj == "left")
	{
		if(banners == 1)
		{
			sjs = banner_max;
		}
		else
		{
			sjs = banners-1;
		}
	}
	else
	{
		if(banners == banner_max)
		{
			sjs = 1;
		}
		else
		{
			sjs = banners+1;
		}
	}

	manual_replace_banner(sjs);
}



//点击数字切换
function manual_replace_banner(sj)
{
	var bannerz = banners;

	banners = sj;

	if(banners == bannerz)
	{
		return;
	}

	clearInterval(timer);//停止计时器

	fade_in_out(bannerz,banners);//调用切换函数

	timer = setInterval(auto_replace_banner, speed*1000);//banner切换计时器重新启动
}



//自动更换banner
function auto_replace_banner()
{
	var bannerz = banners;

	if(banners == banner_max)
	{
		banners = 1;
	}
	else
	{
		banners += 1;
	}

	fade_in_out(bannerz,banners);//调用切换函数
}



//淡入淡出效果方法
function fade_in_out(bannerz,banners)
{
	var out_id = ".banner_img"+bannerz;//淡出标签的ID名
	var banner_out=$(out_id);//获取淡出对象

	var in_id = ".banner_img"+banners;//淡入标签的ID名
	var bannet_in=$(in_id);//获取淡入对象
	
	banner_out.fadeTo(600,0);//JQuery方法淡出到指定透明度,参数1为速度，参数2为透明度
	bannet_in.fadeTo(500,1);//JQuery方法淡入,参数1为速度，参数2为透明度

	banner_number();//调用数字颜色更换
}



//banner数字显示
function banner_number()
{
	for(var i=1; i<=banner_max; i++)
	{
		var num_id = ".num"+i;
		var num_object = $(num_id);
		if(banners == i)
		{
			num_object.css("color" , "black");
			num_object.css("backgroundColor" , "white");
		}
		else
		{
			num_object.css("color" , "white");
			num_object.css("backgroundColor" , "rgba(0,0,0,0)");
		}
	}
}


//banner链接跳转
function link(url,mode=true)
{
	if(mode == true)
	{
		window.open(url);
	}
	else
	{
		window.location.href = url;
	}
}
