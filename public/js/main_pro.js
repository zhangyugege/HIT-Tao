/**
 * Created by Administrator on 2016/7/1.
 */

/**
 * 用户登陆ajax
 */
$("#login_submit").click(function(){
    var username=$('#username').val();
    var password=$('#password').val();
    if(!username){
        ///////////////////////update   angular.js//////////////////////////////
        alert('请输入用户名');
        window.location.href="login";
        return ;
    }
    if(!password){
        alert('请输入密码');
        window.location.href="login";
        return ;
    }
    $.ajax({
        type: "post",
        url: "http://localhost:3000/login",
        dataType: "json",
        data:{ username: username, password: password },
        success: function(data){
            if(data){
               if(data.message=="i202"){
                   alert('密码错误，请重新输入');
                   window.location.href="login";
               }else if(data.message=="i200"){
                    alert('登陆成功');
                    window.location.href="index";
                }
                else{
                    alert('没有这个用户名');
                   window.location.href="login";
                 }
            } else{


            }
        }
    });
    while(1){}
});
/**
 * 用户注册ajax
 */
$("#reg_submit").click(function(){
    var username=$('#username').val();
    var password=$('#password').val();
    var email=$('#email').val();
    console.log(username,password,email);
    if(!username){
        alert('请输入用户名');
        window.location.href="reg";
        return ;
    }
    if(!password){
        alert('请输入密码');
        window.location.href="reg";
        return ;
    }
    if(!email){
        //判断email格式
        alert('请输入email');
        window.location.href="reg";
        return ;
    }
    $.ajax({
        type: "post",
        url: "http://localhost:3000/reg",
        dataType: "json",
        data:{ username: username, password: password,email: email },
        success: function(data){
            if(data){
                if(data.message=="false"){
                    alert('用户名已经被注册了');
                    window.location.href="reg";
                }else{
                    alert('注册成功！请登录。');
                    window.location.href="login";
                }
            } else{


            }
        }
    });
});
/**
 * 用户商店登陆ajax
 */
$("#loginShop_submit").click(function(){
    var uShopname=$('#uShopname').val();
    if(!uShopname){
        alert('请输入店铺名');
        window.location.href="loginShop";
        return ;
    }
    $.ajax({
        type: "post",
        url: "http://localhost:3000/loginShop",
        dataType: "json",
        data:{ uShopname: uShopname },
        success: function(data){
            if(data){
                //没有店铺
                if(data.message=="i201"){
                    alert('您还没有店铺哦，来注册吧');
                    window.location.href="regShop";
                    //有店铺 并登录成功
                }else if(data.message=="i200"){
                    alert('店铺登陆成功');
                    window.location.href="index";
                    //有店铺登录失败
                }else if(data.message=="i202"){
                    alert('店铺名输入错误，登录失败');
                    window.location.href="loginShop";
                }
            } else{

            }
        }
    });
});
/**
 * 用户商店注册ajax
 */
$("#regShop_submit").click(function(){
    var uShopname=$('#uShopname').val();
    var aId=$('#aId').val();
    if(!uShopname){
        alert('请输入店铺名');
        window.location.href="regShop";
        return ;
    }
    aId=parseInt(aId);
    if(aId!=0&&typeof aId!='number'){
        alert('请输入支付宝账号');
        window.location.href="regShop";
        return ;
    }

    $.ajax({
        type: "post",
        url: "http://localhost:3000/regShop",
        dataType: "json",
        data:{ uShopname: uShopname,aId:aId },
        success: function(data){
            if(data){
                //有店铺 不可以注册
                if(data.message=="i201"){
                    alert('您已经有店铺啦，直接登陆吧');
                    window.location.href="loginShop";
                    //有店铺 并登录成功
                }else if(data.message=="i200"){
                    alert('店铺注册成功');
                    window.location.href="loginShop";
                    //有店铺登录失败
                }else if(data.message=="i202"){
                    alert('店铺名已经被使用啦，再选一个吧');
                    window.location.href="regShop";
                }
            } else{

            }
        }
    });
});

/**
 * detail.ejs 添加到购物车ajax
 */
$("#add_buycar").click(function(){
    //首先判断是否登录
    var login=checkLogin();

    if(login==false){
        alert('您还么有登陆哦！');
        window.location.href = "login";
        return ;
    }

    //获取url中的参数gid
    var gId=parseInt(getUrlParam("gId"));

    //再次判断输入的参数是否正确
    var count=parseInt($('#count').val());
    if(!count){
        alert('请输入购买数量');
        return ;
    }
    if(gId!=0&&isNaN(gId)){
        console.log('找不到商品ID');
        return ;
    }
    //发送请求
    $.ajax({
        type: "post",
        url: "http://localhost:3000/add_buycar",
        dataType: "json",
        data:{ gId: gId,count:count },
        success: function(data){
            if(data){
                //跳转到购物车界面
                 if(data.message=="i200") {
                     alert('添加购物车成功');
                     window.location.href = "buycar";
                 }
            } else{

            }
        }
    });
});
/**
 * 从购物车中删除ajax
 */
$('a[id^=buycar_delete_]').click(function(){

    var id=this.id;
    var gId=id.split('_')[2];
    //发送请求  删除buycar数据库中id为gId的数据
    $.ajax({
        type: "post",
        url: "http://localhost:3000/remove_buycar",
        dataType: "json",
        data:{ gId: gId},
        success: function(data){
            if(data){
                //刷新购物车界面
                if(data.message=="i200") {
                    window.location.href = "buycar";
                }
            } else{

            }
        }
    });

});

/**
 * detail.ejs  立即购买ajax
 */

$("#buy_now").click(function(){
    //首先判断是否登录
    var login=checkLogin();
    if(login==false){
        alert('您还么有登陆哦！');
        window.location.href = "login";
        return ;
    }

    //获取url中的参数gid
    var gId=parseInt(getUrlParam("gId"));
    console.log(gId);

    //再次判断输入的参数是否正确
    var count=parseInt($('#count').val());
    if(!count){
        alert('请输入购买数量');
        return ;
    }
    if(gId!=0&&isNaN(gId)){
        console.log('找不到商品ID');
        return ;
    }
    //发送请求
    $.ajax({
        type: "post",
        url: "http://localhost:3000/add_records",
        dataType: "json",
        data:{ gId: gId,count:count },
        success: function(data){
            if(data){
                //跳转到购物清单界面
                if(data.message=="i200") {
                    alert('立即购买成功');
                    window.location.href = "records";
               }
            } else{

            }
        }
    });
});

/**
 * buycar.ejs  全部购买ajax
 */
$('#all_buy').click(function(){

    //容错处理，如果没有商品点击无效
    if($('form li').length==0)return;

    //获取每一个li标签的第一个p标签  拿到id 和 much
    var cals=$('p[id^=cal_sum_]');
    var len=cals.length;
    //构造str字符串  使用字符串解析规约
    var str='';
    for(var i=0;i<len;i++){
        var gId=parseInt(cals[i].id.split('_')[2]);
        var gMuch=cals[i].innerHTML.split('|')[1];
        var uName=$.cookie('ADMIN_NAME');
        var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
        str+=JSON.stringify({gId:gId,gMuch:gMuch,gTime:time,uName:uName});
        if(i<len-1)str+="@";
    }
    console.log(str);
    //发送ajax请求
    $.ajax({
        type: "post",
        url: "http://localhost:3000/all_add_records",
        dataType: 'json',
        data:{data:str},
        success: function(data){
            if(data){
                //跳转到购物记录界面
                if(data.message=="i200") {
                    alert("成功添加到购物记录");
                    window.location.href = "records";
                }
            } else{

            }
        }
    });


});

/**
 * 判断用户是否登录
 * @returns {boolean}
 */

function checkLogin(){
    var username=$.cookie('ADMIN_NAME');
    if(!username){
        return false;
    }

    return true;
}
/**
 * 获取url中的参数
 * @param name
 * @returns {*}
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var s=decodeURI(window.location.search);
    var r = s.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
/**
 * 时间格式化
 * @param fmt
 * @returns {*}
 * @constructor
 *
 * var time1 = new Date().Format(“yyyy-MM-dd”);var time2 = new Date().Format(“yyyy-MM-dd HH:mm:ss”);
 */
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
