var express = require('express');
var router = express.Router();
var mongo = require("mongodb");
var setting = require("../config/settings");
var async = require("async");
// var init = require("../core/initData_inc");
var urlmodule = require('url');
var user2 = require("../lib/database_func2");
var crypto = require('crypto');
var formidable = require('formidable');

var DATABASE,  //阮籍能自动记录的数据库信息
    ADMIN_NAME, //用户登录之后的用户名信息
    ADMIN_SHOP_NAME,//用户店铺登陆之后的店铺名信息
    URL = 'mongodb://localhost:27017/test';  //数据库连接url


//初始化数据库
//init.initData(setting.host,setting.port,setting.DB);



/**
 * 连接数据库
 */
user2.connectDB(URL, function (db) {
    DATABASE = db;

});

//setTimeout(function(){
//
//
//    user2.updateDocument(DATABASE, "buycar",{uName:'liuchen'},
//        {
//            $set: {
//                "gMuch":2
//            }
//        },
//        function (result) {
//            console.log('更新完毕'+result);
//        });
//},1000);

/**
 * index页get请求
 */
router.get('/index', function (req, res, next) {

    ////查询goods
    user2.findDocuments(DATABASE, "goods", 6, null, function (goods) {
        //查询shops
        user2.findDocuments(DATABASE, "users", null, {uHasshop:1}, function (shops){
            res.render('index', {title: '主页', goods: goods, shops:shops });
        });

    });

});
router.get('/', function (req, res, next) {

    ////查询goods
    user2.findDocuments(DATABASE, "goods", 6, null, function (goods) {
        //查询shops
        user2.findDocuments(DATABASE, "users", null, {uHasshop:1}, function (shops){
            res.render('index', {title: '主页', goods: goods, shops:shops });
        });

    });

});
/**
 * 商品详情页
 */
router.get('/details', function (req, res, next) {
    //查询good详情
    var url = urlmodule.parse(req.url, true).query;
    url = stringToNum(url);
    user2.findDocuments(DATABASE, "goods", 1, url, function (good) {
        res.render('details', {title: '详情页', good: good});
    });

});
/**
 *
 * 购物车页
 */
router.get('/buycar', function (req, res, next) {
    var buyThings;
    //查询buycar物品 对每一个物品查询goods详情
    var uName=req.cookies.ADMIN_NAME;
    user2.findDocuments(DATABASE, "buycar", null, {uName:uName}, function (goods) {
        if(goods.length>0){
            buyThings = goods;
            for (var i = 0; i < buyThings.length; i++) {
                (function (i) {
                    user2.findDocuments(DATABASE, "goods", 1, {"gId": parseInt(buyThings[i].gId)}, function (good) {
                        buyThings[i].gPics = good[0].gPics;
                        buyThings[i].gMoney = good[0].gMoney;
                        buyThings[i].gSum = good[0].gNumber;
                        buyThings[i].gName = good[0].gName;
                        if(i==buyThings.length-1){
                            res.render('buycar', {title: '购物车', goods: buyThings});
                        }

                    });
                })(i);

            }
        }else {
            res.render('buycar', {title: '购物车', goods: goods});
        }

    });

});

/**
 * 商品列表页
 */
router.get('/list', function (req, res, next) {

    ////查询所有goods
    user2.findDocuments(DATABASE, "goods", null, null, function (goods) {
        res.render('list', {title: '商品列表', goods: goods});
    });

});
/**
 * 注册页 get
 */
router.get('/reg', function (req, res, next) {
    res.render('reg', {title: '注册页'});
});

/**
 * 注册页 post
 */
router.post('/reg', function (req, res, next) {
    //先查询有没有这个user
    user2.findDocuments(DATABASE, "users", 1, {"uName":req.body.username}, function (user) {
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        if(user.length==0){
            //用户名没有重复  同意创建用户

            //加盐md5存储到数据库中
            var content=req.body.password;
            var salt=randomKey(16);
            var ciphertext=hmac(content,salt);

            //添加用户
            user2.insertDocuments(DATABASE, "users",
                [{
                    "uName":req.body.username,
                    "uPasswd":ciphertext,
                    "uEmail":req.body.email,
                    "uHasshop":0,
                    "uShopname":"null",
                    "aId":'-1',
                    "salt":salt

                }],
                function (result){
                    res.send({status:"success", message:"true"});
                }
            );
        }
        else{
            // 用户名重复。找到这个user 不同意创建用户
            res.send({status:"success", message:"false"});

        }
    });
});

/**
 * 登录页 get
 */
router.get('/login', function (req, res, next) {
    res.render('login', {title: '登录页'});
});
/**
 * 登录页 post
 */
router.post('/login', function (req, res, next) {
    //查询有没有这个user
    sleep(1000);
    user2.findDocuments(DATABASE, "users", 1, {"uName":req.body.username}, function (user) {
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        if(user.length==0){
            res.send({status:"success", message:"i201"});
        }
        else{
        //,"uPasswd":req.body.password
            //验证用户密码是否正确

            //加盐md5
            var content=req.body.password;
            var salt=user[0].salt;
            var ciphertext=hmac(content,salt);
            if(ciphertext==user[0].uPasswd){

                //密码输入正确，将用户名记录到cookie中
                res.cookie('ADMIN_NAME', req.body.username);
                res.send({status:"success", message:"i200"});

            }else{
                res.send({status:"success", message:"i202"});
            }


    }
    });
});
/**
 * 模拟睡眠
 * @param sleepTime
 */
function sleep(sleepTime) {
    for(var start = +new Date; +new Date - start <= sleepTime; ) { }
}

/**
 * 店铺注册页 get
 */
router.get('/regShop', function (req, res, next) {
    res.render('regShop', {title: '店铺注册'});
});
/**
 * 店铺注册页 post
 */
router.post('/regShop', function (req, res, next) {
    //console.log(req.body);
    var uName=req.cookies.ADMIN_NAME;
    //查询有没有这个user
    user2.findDocuments(DATABASE, "users", 1, {"uName":uName}, function (user) {

        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        //没有店铺  可以注册
        if (user[0].uHasshop == 0) {
            console.log('可以注册');
            //查询点名有没有重复
            user2.findDocuments(DATABASE, "users", null, {"uShopname": req.body.uShopname}, function (results) {
                //没有找到同名网店，可以注册
                if (results.length == 0) {
                    user2.updateDocument(DATABASE, "users",
                        {"uName": req.cookies.ADMIN_NAME},
                        {
                            $set: {
                                "uHasshop": 1,
                                "uShopname": req.body.uShopname,
                                "aId": req.body.aId
                            }
                        },
                        function (result) {
                            res.send({status: "success", message: "i200"});
                        }
                    );
                }
                //找到同名网店，不可以注册
                else {
                    res.send({status: "success", message: "i202"});
                }
            });
        }
        //有店铺  不可以注册
        else if (user[0].uHasshop == 1) {
            res.send({status: "success", message: "i201"});
        }
    });
});
/**
 * 店铺登陆页 get
 */
router.get('/loginShop', function (req, res, next) {
    res.render('loginShop', {title: '店铺登陆'});
});

/**
 * 店铺登录页 post
 */
router.post('/loginShop', function (req, res, next) {

    var uName=req.cookies.ADMIN_NAME;

    //查询有没有这个user
    user2.findDocuments(DATABASE, "users", 1, {"uName":uName}, function (user) {

        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        //没有店铺
        if(user[0].uHasshop===0){
            res.send({status:"success",        message:"i201"});
        }
        //有店铺
        else if (user[0].uHasshop==1){
            //输入正确
            if(user[0].uShopname==req.body.uShopname){
                res.cookie('ADMIN_SHOP_NAME', req.body.uShopname);
                res.send({status:"success", message:"i200"});
            }
            //输入错误
            else{
                res.send({status:"success", message:"i202"});
            }
        }
    });
});

/**
 * 店铺页 get
 */
router.get('/shops', function (req, res, next) {

    var url = urlmodule.parse(req.url, true).query;
    url = stringToNum(url);
    ////查询所有goods
    user2.findDocuments(DATABASE, "goods", null, {uShopname:url.uShopName}, function (goods) {
        res.render('shops', {title: '店铺详情页', goods: goods});
    });
});
/**
 * 加入购物车 post
 */
router.post('/add_buycar', function (req, res, next) {

    var gId=req.body.gId;
    var gMuch=req.body.count;
    var uName=req.cookies.ADMIN_NAME;
    ////查询所有购物车中有没有这么一条记录
    user2.findDocuments(DATABASE, "buycar", 1, {uName:uName,gId:gId}, function (goods) {
       //若没有 添加纪录
        if(!goods.length){
            user2.insertDocuments(DATABASE,"buycar",
                [
                    {
                        gId:parseInt(gId),
                        uName:uName,
                        gMuch:parseInt(gMuch)
                    }
                ],
                function(res){
                    reduceCount(gId,gMuch);

                })
        } else{
            var gMuchBefore=goods[0].gMuch;
            user2.updateDocument(DATABASE,"buycar",{uName:uName,gId:gId},
                {
                    $set:{
                        gMuch:parseInt(gMuch)+parseInt(gMuchBefore)
                    }

                }, function(res2){
                    reduceCount(gId,gMuch);
                })
        }

        //返回 i200 渲染到购物车界面
        res.send({status:"success", message:"i200"});
    });
});
/**
 * 删除购物车中指定gId的条目
 */
router.post('/remove_buycar', function (req, res, next) {
    console.log('remove_buycar');
    var gId = req.body.gId;
    var uName=req.cookies.ADMIN_NAME;
    user2.deleteDocument(DATABASE, "buycar", {uName:uName,gId: gId}, function (ress) {
            res.send({status:"success", message:"i200"});
        }
    );
});

/**
 * 购买清单页  get
 */
router.get('/records',function(req, res, next){

    var buyThings;
    //查询records物品 对每一个物品查询goods详情
    var uName=req.cookies.ADMIN_NAME;
    //-----------------------update  findTmp暂时未null-------应该使用session---------------------------------------------------
    user2.findDocuments(DATABASE, "records", null, {uName:uName}, function (goods) {
        if(goods.length>0){
            buyThings = goods;
            for (var i = 0; i < buyThings.length; i++) {
                (function (i) {
                    user2.findDocuments(DATABASE, "goods", 1, {"gId": parseInt(buyThings[i].gId)}, function (good) {
                        buyThings[i].gPics = good[0].gPics;
                        buyThings[i].gMoney = good[0].gMoney;
                        buyThings[i].gSum = good[0].gNumber;
                        buyThings[i].gName = good[0].gName;
                        buyThings[i].uShopname = good[0].uShopname;
                        buyThings[i].gTime=decrypt(buyThings[i].gTime,uName);
                        if(i==buyThings.length-1){
                            res.render('records', {title: '购买清单', goods: buyThings});
                        }

                    });
                })(i);

            }
        }else{
            res.render('records', {title: '购买清单', goods: goods});
        }

    });
});
/**
 * 添加一个商品到清单  post
 */
router.post('/add_records',function(req, res, next){



    var buyThings;
    var uName=req.cookies.ADMIN_NAME;
    var gId=req.body.gId;
    var count=req.body.count;
    //添加时间
    var time = new Date().Format("yyyy-MM-dd hh:mm:ss");

    user2.insertDocuments(DATABASE,"records",
        [
            {
                gId:parseInt(gId),
                uName:uName,
                gMuch:count,
                gTime: encrypt(time,uName)
            }
        ],
        function(ress){

            res.send({status:"success", message:"i200"});
        })

});

/**
 * 添加多个商品到清单  post
 */
router.post('/all_add_records',function(req, res, next){

    var uName=req.cookies.ADMIN_NAME;
    var s=req.body.data;
    var arr=s.split('@');

    for(var i=0;i<arr.length;i++){
        arr[i]=JSON.parse(arr[i]);
        arr[i].gTime=encrypt(arr[i].gTime,uName);
    }
    //console.log(arr);
    // 向details插入数据
    user2.insertDocuments(DATABASE,"records",
       arr,
        function(ress){
            //向buycar删除关于该用户的购物信息
            user2.deleteDocuments(DATABASE,'buycar',{uName:uName}, function(){
                res.send({status:"success", message:"i200"});
            })

        })




});
/**
 * 商店商品管理页面  get
 */
router.get('/shopControl', function (req, res, next) {
    res.render('shopControl', {title: '商品管理页'});
});

/**
 * 商店商品管理页面  post
 */
router.post('/shopControl', function (req, res, next) {
   console.log(req.body);
    //
    //
    //var form = new formidable.IncomingForm();   //创建上传表单
    //form.encoding = 'utf-8';		//设置编辑
    //form.uploadDir = 'public/images/';	 //设置上传目录
    //form.keepExtensions = true;	 //保留后缀
    //form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
    //
    //form.parse(req, function(err, fields, files) {
    //
    //    if (err) {
    //        console.log('err'+err);
    //        return;
    //    }
    //
    //    var extName = '';  //后缀名
    //    switch (files.uPic.type) {
    //        case 'image/pjpeg':
    //            extName = 'jpg';
    //            break;
    //        case 'image/jpeg':
    //            extName = 'jpg';
    //            break;
    //        case 'image/png':
    //            extName = 'png';
    //            break;
    //        case 'image/x-png':
    //            extName = 'png';
    //            break;
    //    }
    //
    //    if (extName.length == 0) {
    //        console.log('len=0');
    //        return;
    //    }
    //
    //    var avatarName = Math.random() + '.' + extName;
    //    var newPath = form.uploadDir + avatarName;
    //
    //    console.log(newPath);
    //    fs.renameSync(files.uPic.path, newPath);  //重命名
    //});
    user2.findDocuments(DATABASE, "goods", null, {}, function (goods) {
       var len=goods.length;
        var gId=goods[len-1].gId;
        var uShopname=req.cookies.ADMIN_SHOP_NAME;

        user2.insertDocuments(DATABASE, "goods",
            [{
                "gName":req.body.gName,
                "gMoney":req.body.gName,
                "gDetails":req.body.gDetails,
                "gNumber":req.body.gNumber,
                "gType":"连衣裙",
                "gId":gId+1,
                "gPics":"images/good7.jpg",
                "uShopname":uShopname

            }],
            function (result){
                res.send({status:"success", message:"true"});
            }
        );

    });



});

/**
 * 减少goods中指定商品的数量
 * @param gId
 * @param gMuch
 */
function reduceCount(gId,gMuch){
    user2.findDocuments(DATABASE, "goods", 1, {gId:gId},
        function (goods) {
            if(!goods.length)return false;
            user2.updateDocument(DATABASE,"goods",{gId:gId},
                {
                    $set:{
                        gMuch:goods[0].gMuch-gMuch
                    }

                }, function(res2){
                    return true;
                })
        });

}


/**
 * string 转 num
 * @param url
 * @returns {*}
 */
function stringToNum(url) {
    url.gId = parseInt(url.gId);
    return url;
}

/**
 * 时间格式化
 * @param fmt
 * @returns {*}
 * @constructor
 *
 * var time1 = new Date().Format(“yyyy-MM-dd”); var time2 = new Date().Format(“yyyy-MM-dd HH:mm:ss”);
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
}

/**
 * hmac 认证
 * @param content
 * @param SecrectKey
 */
function hmac(content,SecrectKey){
   //创建MD5加密方式
    var hmac = crypto.createHmac('sha1', SecrectKey)
        .update(content)
        .digest()
        .toString('base64');
    return hmac;
}
/**
 * aes 加密
 * @param str
 * @param secret
 * @returns {*|OrderedBulkOperation|UnorderedBulkOperation|Promise}
 */
function encrypt(str,secret) {
    var cipher = crypto.createCipher('aes192', secret);
    var enc = cipher.update(str,'utf8','hex');
    enc += cipher.final('hex');
    return enc;
}
/**
 * aes  解密
 * @param str
 * @param secret
 * @returns {*|OrderedBulkOperation|UnorderedBulkOperation|Promise}
 */
function decrypt(str,secret) {
    var decipher = crypto.createDecipher('aes192', secret);
    var dec = decipher.update(str,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
}
/**
 * 产生随机密钥
 * @param passwdLength
 * @returns {*}
 */
function randomKey(passwdLength){
    return crypto.randomBytes(passwdLength).toString('base64');
}


module.exports = router;


