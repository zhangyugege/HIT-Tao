/**
 * Created by Administrator on 2016/6/30.
 */

var data =
{
    //商品
    "goods":
        [
            {
                "gId":0,
                "gName": "毛菇小象 2016夏季新款女装无袖印花连衣裙大码中长款高腰裙子",
                "gMoney":98.00,
                "gType": "连衣裙",
                gDetails:"简洁的短款收腰板型，穿上它，在深秋或者初冬这样的季节，一样可以窈窕美丽，而不像一般的棉衣一样臃肿；帽子的设计是一大特点，拉链设计，全部拉开可做大翻领，再加上满满的毛领，大牌范儿立现,！下摆可拆卸，穿着更加灵活哦。另外此款棉衣较为薄款，喜欢的MM一定要早下手哦，提前享受棉衣的温暖",
                gPics:"images/good1.jpg",
                gNumber:1000,
                uShopname:"果果家"
            },
            {
                "gId":1,
                "gName": "2016夏装新款女装潮明星同款性感中裙子夏季小清新背心直筒连衣裙",
                "gMoney":123.00,
                "gType": "连衣裙",
                gDetails:"简洁的短款收腰板型，穿上它，在深秋或者初冬这样的季节，一样可以窈窕美丽，而不像一般的棉衣一样臃肿；帽子的设计是一大特点，拉链设计，全部拉开可做大翻领，再加上满满的毛领，大牌范儿立现,！下摆可拆卸，穿着更加灵活哦。另外此款棉衣较为薄款，喜欢的MM一定要早下手哦，提前享受棉衣的温暖",
                gPics:"images/good2.jpg",
                gNumber:500,
                uShopname:"果果家"
            },
            {
                "gId":2,
                "gName": "高档真丝连衣裙2016夏季新款时尚绿色天鹅印花中长款修身大摆裙女",
                "gMoney":54.00,
                "gType": "连衣裙",
                gDetails:"简洁的短款收腰板型，穿上它，在深秋或者初冬这样的季节，一样可以窈窕美丽，而不像一般的棉衣一样臃肿；帽子的设计是一大特点，拉链设计，全部拉开可做大翻领，再加上满满的毛领，大牌范儿立现,！下摆可拆卸，穿着更加灵活哦。另外此款棉衣较为薄款，喜欢的MM一定要早下手哦，提前享受棉衣的温暖",
                gPics:"images/good3.jpg",
                gNumber:140,
                uShopname:"果果家"

            },
            {
                "gId":3,
                "gName": "印花吊带连衣裙",
                "gMoney":98.00,
                "gType": "连衣裙",
                gDetails:"几何元素印花潮流时尚线条感分明，撞色搭配清新自然富有视觉冲击力，无袖吊带背心的设计简洁利落个性自由不拘束，面料柔软舒适肌理分明透气吸汗，版型宽松舒适遮肉显瘦",
                gPics:"images/good4.jpg",
                gNumber:1000,
                uShopname:"果果家"

            },
            {
                "gId":4,
                "gName": "鸢尾花印花半身长裙",
                "gMoney":98.00,
                "gType": "连衣裙",
                gDetails:"鸢尾花图案花卉印花弹力超长半身裙，采用亮光斜纹布，立体感超强 、光泽好 、不易褶皱。高腰设计提高腰线，瞬间获得大长腿的既视感。清新中带着微微的复古感觉，让整个人都散发出文艺气息。",
                gPics:"images/good5.jpg",
                gNumber:1000,
                uShopname:"小屁孩"
            },
            {
                "gId":5,
                "gName": "喇叭袖纯色雪纺连衣裙",
                "gMoney":98.00,
                "gType": "连衣裙",
                gDetails:"简洁的短款收腰板型，穿上它，在深秋或者初冬这样的季节，一样可以窈窕美丽，而不像一般的棉衣一样臃肿；帽子的设计是一大特点，拉链设计，全部拉开可做大翻领，再加上满满的毛领，大牌范儿立现,！下摆可拆卸，穿着更加灵活哦。另外此款棉衣较为薄款，喜欢的MM一定要早下手哦，提前享受棉衣的温暖",
                gPics:"images/good6.jpg",
                gNumber:2890,
                uShopname:"小屁孩"
            }

        ],

    //用户
    "users": [

        { "uName": "liuchen", "uPasswd": "liuchen", "uEmail": "773772174@qq.com",uHasshop:1,uShopname:"果果家",aId:0},
        { "uName": "小屁孩", "uPasswd": "123", "uEmail": "773772174@qq.com",uHasshop:1,uShopname:"小屁孩",aId:1}


    ],

    //购物车  还未购买的记录
    "buycar": [

        { "uName": "liuchen", "gId": 1 ,"gMuch": 2}

    ],

    //支付宝账户
    "alipays": [

        { "aId": 0, "aMoney": 100000 },
        { "aId": 1, "aMoney": 100000 }

    ],
    //店铺
    "shops" : [

        { "uShopname": "果果家", "gId": 1 },
        { "uShopname": "果果家", "gId": 2 }

    ],
    //商品类型
    "types":[
        { "tName": "连衣裙" }
    ],
    //购物记录  购买之后的记录
    "records" : [

        { "gId": 1, "uName": "liuchen","gMuch": 2 },
        { "gId": 2, "uName": "liuchen","gMuch": 1 }
    ]
}

module.exports = data;