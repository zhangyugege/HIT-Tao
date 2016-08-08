/**
 * Created by Administrator on 2016/7/3.
 */
//判断用户登录
$(document).ready(function(){

    var username=$.cookie('ADMIN_NAME');
    if(!username){
        alert('宝宝你还没有登录哦，请先登录');
        window.location.href="login";
    }

});